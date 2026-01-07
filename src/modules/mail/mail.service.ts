import { Injectable } from '@nestjs/common';
import { AbstractMailProvider } from './providers/mail-provider.abstract';
import { TemplateRenderer } from './utils/template-renderer';

@Injectable()
export class MailService {
  private templateRenderer: TemplateRenderer;

  constructor(private readonly mailProvider: AbstractMailProvider) {
    this.templateRenderer = new TemplateRenderer();
  }

  async sendVerificationEmail(
    to: string,
    token: string,
    firstName: string,
  ): Promise<void> {
    const htmlContent = this.templateRenderer.renderTemplate(
      'email-verification',
      {
        firstName,
        token,
        year: new Date().getFullYear(),
      },
    );

    await this.mailProvider.sendEmail({
      to,
      subject: 'Vérifiez votre adresse email - DevShowcase',
      htmlContent,
    });
  }

  async send2FACode(to: string, code: string, firstName: string): Promise<void> {
    const now = new Date();
    const htmlContent = this.templateRenderer.renderTemplate('two-factor-auth', {
      firstName,
      code,
      date: now.toLocaleDateString('fr-FR'),
      time: now.toLocaleTimeString('fr-FR'),
      year: now.getFullYear(),
    });

    await this.mailProvider.sendEmail({
      to,
      subject: 'Code de vérification 2FA - DevShowcase',
      htmlContent,
    });
  }
}

