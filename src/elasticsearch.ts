/** How to connect our functions to elasticsearch */
import { Client } from '@elastic/elasticsearch';
import { config } from './config';
import { Logger } from 'winston';
import { winstonLogger } from '@cedricngoune/shared';

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'notificationElasticSearchService',
  'debug',
);

const esClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`,
  auth: {
    username: 'elastic',
    password: 'changeme',
  },
});
export async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health = await esClient.cluster.health({});
      log.info(
        `NotificationService ElasticSearch health status - ${health.status}`,
      );
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elastic search failed. Retrying...');
      log.log('error', 'NotificationService checkConnection() methid:', error);
    }
  }
}
