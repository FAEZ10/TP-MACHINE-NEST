import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { AbstractMailProvider } from './mail-provider.abstract';
import { SendEmailOptions } from '../../../common/interfaces/mail-provider.interface';

@Injectable()
export class SmtpMailProvider extends AbstractMailProvider {
  private readonly logger = new Logger(SmtpMailProvider.name);
  private smtpHost: string;
  private smtpPort: number;
  private fromEmail: string;
  private fromName: string;

  constructor(private configService: ConfigService) {
    super();
    
    this.smtpHost = this.configService.get<string>('mail.smtpHost') || 'localhost';
    this.smtpPort = this.configService.get<number>('mail.smtpPort') || 1025;
    this.fromEmail = this.configService.get<string>('mail.fromEmail') || 'noreply@devshowcase.com';
    this.fromName = this.configService.get<string>('mail.fromName') || 'DevShowcase';
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        host: this.smtpHost,
        port: this.smtpPort,
        secure: false,
        ignoreTLS: true,
      });

      await transporter.sendMail({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.htmlContent,
      });

      this.logger.log(`Email sent to ${options.to}`);
    } catch (error: any) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }
}

