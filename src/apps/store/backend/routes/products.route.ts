import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import {
  ProductGetByCriteriaController,
  ProductPostController,
  ProductGetAllController,
  ProductGetByIdController,
  ProductPutDescriptionController,
  ProductPutImageController,
} from '@storebackapp/controllers';

export const register = async (app: Express, container: ContainerBuilder) => {
  const productPostController: ProductPostController = container.get(
    'Apps.Store.Backend.controllers.ProductPostController'
  );

  const productGetAllController: ProductGetAllController = container.get(
    'Apps.Store.Backend.controllers.ProductGetAllController'
  );
  const productGetByIdController: ProductGetByIdController = container.get(
    'Apps.Store.Backend.controllers.ProductGetByIdController'
  );
  const productGetByCriteriaController: ProductGetByCriteriaController = container.get(
    'Apps.Store.Backend.controllers.ProductGetByCriteriaController'
  );

  const productPutDescriptionController: ProductPutDescriptionController = container.get(
    'Apps.Store.Backend.controllers.ProductPutDescriptionController'
  );
  const productPutImageController: ProductPutImageController = container.get(
    'Apps.Store.Backend.controllers.ProductPutImageController'
  );

  app.post('/product', productPostController.run.bind(productPostController));

  app.get('/product', productGetAllController.run.bind(productGetAllController));
  app.get('/product/criteria', productGetByCriteriaController.run.bind(productGetByCriteriaController));
  app.get('/product/:id', productGetByIdController.run.bind(productGetByIdController));
  app.put('/product/:id/description', productPutDescriptionController.run.bind(productPutDescriptionController));
  app.put('/product/:id/image', productPutImageController.run.bind(productPutImageController));
};
