import dotenv from 'dotenv';

dotenv.config({});

export const config = {
  NODE_ENV: process.env.NODE_ENV || '',
  CLIENT_URL: process.env.CLIENT_URL || '',
  SENDER_EMAIL: process.env.SENDER_EMAIL || '',
  SENDER_EMAIL_PASSWORD: process.env.SENDER_EMAIL_PASSWORD || '',
  RABBITMQ_ENDPOINT: process.env.RABBITMQ_ENDPOINT || '',
  ELASTIC_SEARCH_URL: process.env.ELASTIC_SEARCH_URL || '',
};
