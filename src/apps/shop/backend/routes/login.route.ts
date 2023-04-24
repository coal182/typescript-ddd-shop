import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import { LoginPostController } from '../controllers';
import { verifyJWT_MW } from '../middlewares/auth';

export const register = async (app: Express, container: ContainerBuilder) => {
  const loginPostController: LoginPostController = container.get('Apps.Shop.Backend.controllers.LoginPostController');

  app.post('/login/signin', loginPostController.run.bind(loginPostController));

  app.get('/login/renew', [verifyJWT_MW]);
};
