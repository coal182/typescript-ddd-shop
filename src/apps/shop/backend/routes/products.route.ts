import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import {
  ProductGetByCriteriaController,
  ProductPostController,
  ProductGetAllController,
  ProductGetByIdController,
  ProductPutDescriptionController,
  ProductPutImageController,
} from '../controllers';

export const register = async (app: Express, container: ContainerBuilder) => {
  const productPostController: ProductPostController = container.get(
    'Apps.Shop.Backend.controllers.ProductPostController'
  );

  const productGetAllController: ProductGetAllController = container.get(
    'Apps.Shop.Backend.controllers.ProductGetAllController'
  );
  const productGetByIdController: ProductGetByIdController = container.get(
    'Apps.Shop.Backend.controllers.ProductGetByIdController'
  );
  const productGetByCriteriaController: ProductGetByCriteriaController = container.get(
    'Apps.Shop.Backend.controllers.ProductGetByCriteriaController'
  );

  const productPutDescriptionController: ProductPutDescriptionController = container.get(
    'Apps.Shop.Backend.controllers.ProductPutDescriptionController'
  );
  const productPutImageController: ProductPutImageController = container.get(
    'Apps.Shop.Backend.controllers.ProductPutImageController'
  );

  app.post('/product', productPostController.run.bind(productPostController));

  app.get('/product', productGetAllController.run.bind(productGetAllController));
  app.get('/product/criteria', productGetByCriteriaController.run.bind(productGetByCriteriaController));
  app.get('/product/:id', productGetByIdController.run.bind(productGetByIdController));
  app.put('/product/:id/description', productPutDescriptionController.run.bind(productPutDescriptionController));
  app.put('/product/:id/image', productPutImageController.run.bind(productPutImageController));
  app.get('/product', productGetAllController.run.bind(productGetAllController));
};
