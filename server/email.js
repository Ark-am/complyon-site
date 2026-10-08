import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';
import nodemailer from 'nodemailer';
import { getInquirySubject, renderInquiryEmail } from './email-template.js';

export const INQUIRY_RECIPIENT = 'andalib.kibria@ark-am.com';

export function createInquirySender({ region, credentials, fromEmail, client }) {
  const ses = client || new SESClient({ region, credentials, maxAttempts: 1 });
  // Compose MIME with Nodemailer, then use the same SES SendRawEmail API as
  // shouldertocryon. Stream transport only builds bytes; SES delivers them.
  const composer = nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
    newline: 'windows',
    disableFileAccess: true,
    disableUrlAccess: true,
  });

  return async function sendInquiry(values) {
    const email = await composer.sendMail({
      from: { name: 'ComplyOn inquiries', address: fromEmail },
      to: INQUIRY_RECIPIENT,
      replyTo: { name: `${values.first_name} ${values.last_name}`, address: values.email },
      subject: getInquirySubject(values),
      html: renderInquiryEmail(values),
      text: [
        'New ComplyOn website inquiry',
        '',
        `Name: ${values.first_name} ${values.last_name}`,
        `Organization: ${values.organization || 'Not provided'}`,
        `Email: ${values.email}`,
        `Area of interest: ${values.area_of_interest || 'Not specified'}`,
        '',
        'Message:',
        values.message,
      ].join('\n'),
    });

    await ses.send(new SendRawEmailCommand({
      Source: fromEmail,
      Destinations: [INQUIRY_RECIPIENT],
      RawMessage: { Data: email.message },
    }), { abortSignal: AbortSignal.timeout(15000) });
  };
}
