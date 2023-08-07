import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import { ProductsCounterGetController } from '@storebackapp/controllers/products-counter-get-controller';

export const register = async (app: Express, container: ContainerBuilder) => {
  const productsCounterGetController: ProductsCounterGetController = container.get(
    'Apps.Shop.Backend.controllers.ProductsCounterGetController'
  );

  app.get('/products-counter', productsCounterGetController.run.bind(productsCounterGetController));
};
