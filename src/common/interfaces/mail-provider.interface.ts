export interface SendEmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
}

export interface MailProvider {
  sendEmail(options: SendEmailOptions): Promise<void>;
}

