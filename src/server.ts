import { IEmailMessageDetails, winstonLogger } from '@cedricngoune/shared';
import 'express-async-errors';
import { Logger } from 'winston';
import { config } from './config';
import { Application } from 'express';
import http from 'http';
import { healthRoutes } from './routes';
import { checkConnection } from './elasticsearch';
import { createConnection } from './queues/connection';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from './queues/email.consumer';
import { Channel } from 'amqplib';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export const start = (app: Application) => {
  startServer(app);
  app.use('', healthRoutes);

  startQueues();
  startElasticSearch();
};

async function startQueues(): Promise<void> {
  const emailChannel = (await createConnection()) as Channel;
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);
  const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=12334zerefr`;
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: `${config.SENDER_EMAIL}`,
    verifyLink: verificationLink,
    template: 'verifyEmail'
  };
  await emailChannel.assertExchange('email-notification', 'direct');
  const message = JSON.stringify(messageDetails);
  emailChannel.publish('email-notification', 'auth-email', Buffer.from(message));

  // const message1 = JSON.stringify({
  //   name: 'jobber',
  //   service: 'order notification-service',
  // });
  // emailChannel.publish(
  //   'order-notification',
  //   'order-email',
  //   Buffer.from(message1),
  // );
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application) {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker process ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification service running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
}
