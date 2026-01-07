import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  smtpHost: process.env.SMTP_HOST || 'localhost',
  smtpPort: parseInt(process.env.SMTP_PORT || '1025', 10),
  fromEmail: process.env.MAIL_FROM_EMAIL || 'noreply@devshowcase.com',
  fromName: process.env.MAIL_FROM_NAME || 'DevShowcase',
}));

