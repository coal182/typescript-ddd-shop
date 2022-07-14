import '@storebackapp/controllers';

import cors from 'cors';
import { Application, urlencoded, json } from 'express';
import { frameguard, hidePoweredBy, noSniff, xssFilter } from 'helmet';
import { InversifyExpressServer } from 'inversify-express-utils';

import config from '@config/main';
import { errorHandler } from '@storebackapp/middlewares/error-handler';

import { initialiseContainer } from './container';

const server = async () => {
  const container = await initialiseContainer();
  const server = new InversifyExpressServer(container);

  // Add a list of allowed origins.
  // If you have more origins you would like to add, you can add them to the array below.
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4200',
    'https://angular-pvnyyc--4200.local.webcontainer.io',
  ];

  const options: cors.CorsOptions = {
    origin: allowedOrigins,
  };

  server.setConfig((app: Application) => {
    app.use(cors(options));
    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(xssFilter());
    app.use(noSniff());
    app.use(hidePoweredBy());
    app.use(frameguard({ action: 'deny' }));
  });

  server.setErrorConfig((app: Application) => {
    app.use(errorHandler);
  });

  const apiServer = server.build();
  apiServer.listen(config.API_PORT, () =>
    console.log('The application is initialised on the port %s', config.API_PORT)
  );

  return container;
};

export { server };
