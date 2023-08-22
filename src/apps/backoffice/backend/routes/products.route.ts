import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import {
  ProductGetByCriteriaController,
  ProductPostController,
  ProductGetAllController,
  ProductGetByIdController,
} from '../controllers';

export const register = async (app: Express, container: ContainerBuilder) => {
  const productPostController: ProductPostController = container.get(
    'Apps.Backoffice.Backend.controllers.ProductPostController'
  );

  const productGetAllController: ProductGetAllController = container.get(
    'Apps.Backoffice.Backend.controllers.ProductGetAllController'
  );
  const productGetByIdController: ProductGetByIdController = container.get(
    'Apps.Backoffice.Backend.controllers.ProductGetByIdController'
  );
  const productGetByCriteriaController: ProductGetByCriteriaController = container.get(
    'Apps.Backoffice.Backend.controllers.ProductGetByCriteriaController'
  );

  app.post('/product', productPostController.run.bind(productPostController));

  app.get('/product', productGetAllController.run.bind(productGetAllController));
  app.get('/product/criteria', productGetByCriteriaController.run.bind(productGetByCriteriaController));
  app.get('/product/:id', productGetByIdController.run.bind(productGetByIdController));
  app.get('/product', productGetAllController.run.bind(productGetAllController));
};
