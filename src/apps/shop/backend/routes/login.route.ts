import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import { LoginRenewGetController } from '@storebackapp/controllers/login-renew-get-controller';

import { LoginPostController } from '../controllers';
import { verifyJWT_MW } from '../middlewares/auth';

export const register = async (app: Express, container: ContainerBuilder) => {
  const loginPostController: LoginPostController = container.get('Apps.Shop.Backend.controllers.LoginPostController');
  const loginRenewGetController: LoginRenewGetController = container.get(
    'Apps.Shop.Backend.controllers.LoginRenewGetController'
  );

  app.post('/login/signin', loginPostController.run.bind(loginPostController));

  app.get('/login/renew/:uid', [verifyJWT_MW, loginRenewGetController.run.bind(loginRenewGetController)]);
};
