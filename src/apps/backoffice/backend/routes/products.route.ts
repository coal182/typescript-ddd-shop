import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import {
  ProductPutImageController,
  ProductGetByCriteriaController,
  ProductPostController,
  ProductGetAllController,
  ProductGetByIdController,
} from '@backoffice-backend-app/controllers';
import { ProductPutDescriptionController } from '@backoffice-backend-app/controllers/product-put-description-controller';

export const register = async (app: Express, container: ContainerBuilder) => {
  const productPostController: ProductPostController = container.get(
    'Apps.Backoffice.Backend.controllers.ProductPostController'
  );

  const productPutDescriptionController: ProductPutDescriptionController = container.get(
    'Apps.Backoffice.Backend.controllers.ProductPutDescriptionController'
  );
  const productPutImageController: ProductPutImageController = container.get(
    'Apps.Backoffice.Backend.controllers.ProductPutImageController'
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
  app.put('/product/:id/description', productPutDescriptionController.run.bind(productPutDescriptionController));
  app.put('/product/:id/image', productPutImageController.run.bind(productPutImageController));

  app.get('/product', productGetAllController.run.bind(productGetAllController));
  app.get('/product/criteria', productGetByCriteriaController.run.bind(productGetByCriteriaController));
  app.get('/product/:id', productGetByIdController.run.bind(productGetByIdController));
  app.get('/product', productGetAllController.run.bind(productGetAllController));
};
