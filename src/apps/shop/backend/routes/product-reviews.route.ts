import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import { ProductReviewGetByProductIdController } from '@shop-backend-app/controllers/product-review/product-review-get-by-product-id-controller';

import { ProductReviewPostController } from '../controllers';

export const register = async (app: Express, container: ContainerBuilder) => {
  const productReviewPostController: ProductReviewPostController = container.get(
    'Apps.Shop.Backend.controllers.ProductReviewPostController'
  );

  const productReviewGetByProductIdController: ProductReviewGetByProductIdController = container.get(
    'Apps.Shop.Backend.controllers.ProductReviewGetByProductIdController'
  );

  app.post('/product-review', productReviewPostController.run.bind(productReviewPostController));
  app.get(
    '/product-review/product/:id',
    productReviewGetByProductIdController.run.bind(productReviewGetByProductIdController)
  );
};
