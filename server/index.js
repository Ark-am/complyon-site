import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { createInquirySender } from './email.js';

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)), quiet: true });

for (const name of ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'SES_FROM_EMAIL']) {
  if (!process.env[name]?.trim()) throw new Error(`Missing server environment variable: ${name}`);
}

const port = Number(process.env.PORT || 3002);
const proxyHops = Number(process.env.TRUST_PROXY || 0);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid port number.');
if (!Number.isInteger(proxyHops) || proxyHops < 0) throw new Error('TRUST_PROXY must be a non-negative number of trusted proxy hops.');

const sendInquiry = createInquirySender({
  region: process.env.AWS_REGION,
  fromEmail: process.env.SES_FROM_EMAIL,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    ...(process.env.AWS_SESSION_TOKEN ? { sessionToken: process.env.AWS_SESSION_TOKEN } : {}),
  },
});

const app = createApp({ sendInquiry, trustProxy: proxyHops || false });
app.listen(port, () => console.log(`ComplyOn inquiry API listening on port ${port}`));
