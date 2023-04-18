import { MongoClient, Db } from 'mongodb';

import config from '@config/main';

export const createMongodbConnection = async (host: string): Promise<Db> => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(host, (error, client) => {
      if (error) reject(error);
      if (client) resolve(client.db(config.DB_NAME));
    });
  });
};
