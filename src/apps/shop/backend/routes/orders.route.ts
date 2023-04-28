import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import {
  OrderGetByUserController,
  OrderPostController,
  OrderGetByIdController,
  OrderDeleteController,
} from '../controllers';

export const register = async (app: Express, container: ContainerBuilder) => {
  const orderPostController: OrderPostController = container.get('Apps.Shop.Backend.controllers.OrderPostController');

  const orderGetByUserController: OrderGetByUserController = container.get(
    'Apps.Shop.Backend.controllers.OrderGetByUserController'
  );
  const orderGetByIdController: OrderGetByIdController = container.get(
    'Apps.Shop.Backend.controllers.OrderGetByIdController'
  );

  const orderDeleteController: OrderDeleteController = container.get(
    'Apps.Shop.Backend.controllers.OrderDeleteController'
  );

  app.post('/order', orderPostController.run.bind(orderPostController));

  app.get('/order/user/:id', orderGetByUserController.run.bind(orderGetByUserController));
  app.get('/order/:id', orderGetByIdController.run.bind(orderGetByIdController));
  app.delete('/order/remove', orderDeleteController.run.bind(orderDeleteController));
};
