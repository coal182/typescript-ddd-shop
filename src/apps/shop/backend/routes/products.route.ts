import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import { ProductGetByCriteriaController, ProductGetAllController, ProductGetByIdController } from '../controllers';

export const register = async (app: Express, container: ContainerBuilder) => {
  const productGetAllController: ProductGetAllController = container.get(
    'Apps.Shop.Backend.controllers.ProductGetAllController'
  );
  const productGetByIdController: ProductGetByIdController = container.get(
    'Apps.Shop.Backend.controllers.ProductGetByIdController'
  );
  const productGetByCriteriaController: ProductGetByCriteriaController = container.get(
    'Apps.Shop.Backend.controllers.ProductGetByCriteriaController'
  );

  app.get('/product', productGetAllController.run.bind(productGetAllController));
  app.get('/product/criteria', productGetByCriteriaController.run.bind(productGetByCriteriaController));
  app.get('/product/:id', productGetByIdController.run.bind(productGetByIdController));

  app.get('/product', productGetAllController.run.bind(productGetAllController));
};
