import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import {
  CartGetByUserController,
  CartPostController,
  CartAddItemPostController,
  CartGetByIdController,
  CartDeleteController,
  CartRemoveItemDeleteController,
} from '../controllers';

export const register = async (app: Express, container: ContainerBuilder) => {
  const cartPostController: CartPostController = container.get('Apps.Shop.Backend.controllers.CartPostController');
  const cartAddItemPostController: CartAddItemPostController = container.get(
    'Apps.Shop.Backend.controllers.CartAddItemPostController'
  );

  const cartGetByUserController: CartGetByUserController = container.get(
    'Apps.Shop.Backend.controllers.CartGetByUserController'
  );
  const cartGetByIdController: CartGetByIdController = container.get(
    'Apps.Shop.Backend.controllers.CartGetByIdController'
  );

  const cartRemoveItemDeleteController: CartRemoveItemDeleteController = container.get(
    'Apps.Shop.Backend.controllers.CartRemoveItemDeleteController'
  );

  const cartDeleteController: CartDeleteController = container.get(
    'Apps.Shop.Backend.controllers.CartDeleteController'
  );

  app.post('/cart', cartPostController.run.bind(cartPostController));
  app.post('/cart/add', cartAddItemPostController.run.bind(cartAddItemPostController));

  app.get('/cart/user/:id', cartGetByUserController.run.bind(cartGetByUserController));
  app.get('/cart/:id', cartGetByIdController.run.bind(cartGetByIdController));
  app.delete(
    '/cart/remove/:id/:productId/:qty/:price',
    cartRemoveItemDeleteController.run.bind(cartRemoveItemDeleteController)
  );
  app.delete('/cart/clear/:id', cartDeleteController.run.bind(cartDeleteController));
};
