import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import {
  UserGetByCriteriaController,
  UserPostController,
  UserGetAllController,
  UserGetByIdController,
  UserPutPasswordController,
  UserPutController,
} from '../controllers';

export const register = async (app: Express, container: ContainerBuilder) => {
  const userPostController: UserPostController = container.get('Apps.Shop.Backend.controllers.UserPostController');

  const userGetAllController: UserGetAllController = container.get(
    'Apps.Shop.Backend.controllers.UserGetAllController'
  );
  const userGetByIdController: UserGetByIdController = container.get(
    'Apps.Shop.Backend.controllers.UserGetByIdController'
  );
  const userGetByCriteriaController: UserGetByCriteriaController = container.get(
    'Apps.Shop.Backend.controllers.UserGetByCriteriaController'
  );

  const userPutController: UserPutController = container.get('Apps.Shop.Backend.controllers.UserPutController');
  const userPutPasswordController: UserPutPasswordController = container.get(
    'Apps.Shop.Backend.controllers.UserPutPasswordController'
  );

  app.post('/user', userPostController.run.bind(userPostController));

  app.get('/user', userGetAllController.run.bind(userGetAllController));
  app.get('/user/criteria', userGetByCriteriaController.run.bind(userGetByCriteriaController));
  app.get('/user/:id', userGetByIdController.run.bind(userGetByIdController));
  app.put('/user/:id/update', userPutController.run.bind(userPutController));
  app.put('/user/:id/password', userPutPasswordController.run.bind(userPutPasswordController));
};
