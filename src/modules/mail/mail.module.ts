import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { SmtpMailProvider } from './providers/smtp-mail.provider';
import { AbstractMailProvider } from './providers/mail-provider.abstract';

@Module({
  providers: [
    MailService,
    {
      provide: AbstractMailProvider,
      useClass: SmtpMailProvider,
    },
  ],
  exports: [MailService],
})
export class MailModule {}

