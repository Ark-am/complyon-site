import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './app.js';
import { createInquirySender, INQUIRY_RECIPIENT } from './email.js';
import { renderInquiryEmail } from './email-template.js';

const valid = {
  first_name: 'Jane',
  last_name: 'Smith',
  email: 'jane@example.com',
  organization: 'Example Firm',
  area_of_interest: 'Fractional CCO services',
  message: 'Please contact me about compliance support.\nThank you.',
};

function setup(overrides = {}) {
  const sent = [];
  const app = createApp({
    sendInquiry: async values => sent.push(values),
    logger: { error() {} },
    ...overrides,
  });
  return { app, sent };
}

test('valid inquiry is trimmed, delivered, and acknowledged', async () => {
  const { app, sent } = setup();
  const response = await request(app).post('/api/inquiry').set('Origin', origin)
    .send({ ...valid, first_name: '  Jane  ', to: 'attacker@example.com' }).expect(200);
  assert.deepEqual(response.body, { ok: true });
  assert.equal(response.headers['access-control-allow-origin'], origin);
  assert.deepEqual(sent, [valid]);
});

test('all required fields are enforced by the API', async () => {
  for (const field of ['first_name', 'last_name', 'email', 'message']) {
    const { app, sent } = setup();
    await request(app).post('/api/inquiry').send({ ...valid, [field]: '   ' }).expect(400);
    assert.equal(sent.length, 0);
  }
});

test('optional fields may be omitted', async () => {
  const { app, sent } = setup();
  const { organization, area_of_interest, ...required } = valid;
  await request(app).post('/api/inquiry').send(required).expect(200);
  assert.equal(sent[0].organization, '');
  assert.equal(sent[0].area_of_interest, '');
});

test('invalid email, field types, control characters, and oversized fields are rejected', async () => {
  for (const input of [
    { ...valid, email: 'not-an-email' },
    { ...valid, email: 'Jane <jane@example.com>' },
    { ...valid, email: 'a..b@example.com' },
    { ...valid, email: 'jane@example.com\r\nBcc:other@example.com' },
    { ...valid, first_name: ['Jane'] },
    { ...valid, first_name: 'a'.repeat(101) },
    { ...valid, organization: { value: 'Company' } },
    { ...valid, organization: 'Company\r\nBcc:other@example.com' },
    { ...valid, message: 'a'.repeat(5001) },
    { ...valid, message: 'bad\u0000value' },
    [valid],
  ]) {
    const { app, sent } = setup();
    await request(app).post('/api/inquiry').send(input).expect(400);
    assert.equal(sent.length, 0);
  }
});

test('honeypot silently discards bots without sending an email', async () => {
  const { app, sent } = setup();
  await request(app).post('/api/inquiry').send({ ...valid, _gotcha: 'spam' }).expect(200);
  assert.equal(sent.length, 0);
});

test('API permits any origin and preflight for configured methods', async () => {
  const { app, sent } = setup();
  const responseFromOtherOrigin = await request(app).post('/api/inquiry')
    .set('Origin', 'https://unapproved.example').send(valid).expect(200);
  assert.equal(responseFromOtherOrigin.headers['access-control-allow-origin'], '*');
  const response = await request(app).options('/api/inquiry').set('Origin', 'http://localhost:3001')
    .set('Access-Control-Request-Method', 'POST').set('Access-Control-Request-Headers', 'content-type').expect(204);
  assert.equal(response.headers['access-control-allow-origin'], '*');
  assert.match(response.headers['access-control-allow-methods'], /PUT/);
  assert.match(response.headers['access-control-allow-methods'], /DELETE/);
  assert.equal(sent.length, 1);
});

test('malformed JSON, unsupported content types, and huge bodies cannot reach SES', async () => {
  const { app, sent } = setup();
  await request(app).post('/api/inquiry').type('json').send('{broken').expect(400);
  await request(app).post('/api/inquiry').type('form').send(valid).expect(415);
  await request(app).post('/api/inquiry').send({ ...valid, message: 'a'.repeat(40000) }).expect(413);
  assert.equal(sent.length, 0);
});

test('rate limiting stops repeated email delivery', async () => {
  const { app, sent } = setup({ rateLimitMax: 2 });
  await request(app).post('/api/inquiry').send(valid).expect(200);
  await request(app).post('/api/inquiry').send(valid).expect(200);
  const response = await request(app).post('/api/inquiry').send(valid).expect(429);
  assert.match(response.body.error, /Too many inquiries/);
  assert.equal(sent.length, 2);
});

test('delivery errors return a retryable response without exposing AWS details', async () => {
  const { app } = setup({ sendInquiry: async () => { throw new Error('private provider details'); } });
  const response = await request(app).post('/api/inquiry').send(valid).expect(503);
  assert.match(response.body.error, /try again/);
  assert.equal(JSON.stringify(response.body).includes('private provider details'), false);
});

test('success is not returned before the email provider accepts delivery', async () => {
  let delivered = false;
  const { app } = setup({ sendInquiry: async () => {
    await new Promise(resolve => setTimeout(resolve, 20));
    delivered = true;
  } });
  await request(app).post('/api/inquiry').send(valid).expect(200);
  assert.equal(delivered, true);
});

test('email uses the fixed destination, configured sender, and visitor Reply-To', async () => {
  const calls = [];
  const send = createInquirySender({
    region: 'ap-southeast-2',
    fromEmail: 'info@shouldertocryon.health',
    client: { send: async command => calls.push(command) },
  });
  await send({ ...valid, to: 'attacker@example.com' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].constructor.name, 'SendRawEmailCommand');
  assert.deepEqual(calls[0].input.Destinations, [INQUIRY_RECIPIENT]);
  assert.equal(calls[0].input.Source, 'info@shouldertocryon.health');
  const raw = calls[0].input.RawMessage.Data.toString();
  assert.match(raw, /Content-Type: multipart\/alternative/);
  assert.match(raw, /Content-Type: text\/plain/);
  assert.match(raw, /Content-Type: text\/html/);
  assert.match(raw, /To: hirethedeveloperkamal@gmail\.com/);
  assert.match(raw, /Reply-To: Jane Smith <jane@example\.com>/);
  assert.match(raw, /From: ComplyOn inquiries <info@shouldertocryon\.health>/);
  assert.match(raw, /Organization: Example Firm/);
  assert.match(raw, /Area of interest: Fractional CCO services/);
  assert.match(raw, /Please contact me about compliance support/);
  assert.equal(raw.includes('attacker@example.com'), false);
});

test('HTML email treats submitted markup as text and preserves message line breaks', () => {
  const html = renderInquiryEmail({
    ...valid,
    first_name: '<img src=x onerror=alert(1)>',
    organization: 'Research & Advisory <script>alert(1)</script>',
    area_of_interest: '<a href="https://untrusted.example">Click here</a>',
    message: 'First line\r\n\r\n<script>alert("test")</script>\nLast line & details',
  });
  assert.equal(html.includes('<script>'), false);
  assert.equal(html.includes('<img src=x'), false);
  assert.equal(html.includes('<a href="https://untrusted.example">'), false);
  assert.match(html, /Research &amp; Advisory &lt;script&gt;/);
  assert.match(html, /First line<br><br>&lt;script&gt;alert\(&quot;test&quot;\)&lt;\/script&gt;<br>Last line &amp; details/);
});

test('HTML email has usable optional-field fallbacks and an encoded reply link', () => {
  const html = renderInquiryEmail({ ...valid, organization: '', area_of_interest: '', email: "jane+advisory@example.com" });
  assert.match(html, /Organization not provided/);
  assert.match(html, /Not specified/);
  assert.match(html, /href="mailto:jane%2Badvisory@example\.com\?subject=Re%3A%20ComplyOn%20website%20inquiry%20%E2%80%94%20Jane%20Smith&amp;body=/);
  assert.equal(html.includes('undefined'), false);
});

test('both email links preserve the recipient separator and safely encode address characters', () => {
  for (const email of ['kamal.kh0098@gmail.com', 'jane+advisory@example.com', 'jane?cc=other&tag#ref@example.com']) {
    const html = renderInquiryEmail({ ...valid, email });
    const links = [...html.matchAll(/href="(mailto:[^"]+)"/g)].map(match => new URL(match[1].replaceAll('&amp;', '&')));
    assert.equal(links.length, 2);
    for (const link of links) {
      assert.equal(link.pathname.split('@').length, 2);
      assert.equal(decodeURIComponent(link.pathname), email);
      assert.equal(link.searchParams.has('cc'), false);
      assert.equal(link.hash, '');
    }
    assert.equal(links[0].search, '');
    assert.equal(links[1].searchParams.get('subject'), 'Re: ComplyOn website inquiry — Example Firm');
  }
});

test('reply draft includes the original subject, contact context, and complete quoted message', () => {
  const values = {
    ...valid,
    organization: 'Research & Advisory',
    message: 'Can we discuss AML & OFAC?\r\n\r\nBudget: €5,000 + fees.\nSee https://example.com/?a=1&b=2#details',
  };
  const html = renderInquiryEmail(values);
  const href = [...html.matchAll(/href="(mailto:[^"]+)"/g)][1][1].replaceAll('&amp;', '&');
  const link = new URL(href);
  assert.equal(decodeURIComponent(link.pathname), values.email);
  assert.equal(link.searchParams.get('subject'), 'Re: ComplyOn website inquiry — Research & Advisory');
  assert.deepEqual([...link.searchParams.keys()], ['subject', 'body']);
  assert.equal(link.searchParams.get('body'), [
    '', '', '--- Original inquiry ---',
    'From: Jane Smith <jane@example.com>',
    'Organization: Research & Advisory',
    'Subject: ComplyOn website inquiry — Research & Advisory',
    'Area of interest: Fractional CCO services',
    '',
    '> Can we discuss AML & OFAC?',
    '> ',
    '> Budget: €5,000 + fees.',
    '> See https://example.com/?a=1&b=2#details',
  ].join('\r\n'));
});
