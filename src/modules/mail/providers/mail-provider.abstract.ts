import { SendEmailOptions, MailProvider } from '../../../common/interfaces/mail-provider.interface';

export abstract class AbstractMailProvider implements MailProvider {
  abstract sendEmail(options: SendEmailOptions): Promise<void>;
}

