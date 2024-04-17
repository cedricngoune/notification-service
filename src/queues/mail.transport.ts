import { IEmailLocals, winstonLogger } from '@cedricngoune/shared';
import { config } from '@notifications/config';
import { emailTemplates } from '@notifications/helpers';
import { Logger } from 'winston';

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'mailTransport',
  'debug',
);

async function sendEmail(
  template: string,
  receiver: string,
  locals: IEmailLocals,
): Promise<void> {
  try {
    emailTemplates(template, receiver, locals);
    log.info('Email sent successfully!');
  } catch (error) {
    log.log(
      'error',
      'NotificationService MailTransport sendEmail() method error',
      error,
    );
  }
}

export { sendEmail };
