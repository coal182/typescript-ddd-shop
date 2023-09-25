import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import { ProductReviewPostController } from '../controllers';

export const register = async (app: Express, container: ContainerBuilder) => {
  const productReviewPostController: ProductReviewPostController = container.get(
    'Apps.Shop.Backend.controllers.ProductReviewPostController'
  );

  app.post('/product-review', productReviewPostController.run.bind(productReviewPostController));
};
