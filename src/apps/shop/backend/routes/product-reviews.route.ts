import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import { ProductReviewGetByProductIdController } from '@shop-backend-app/controllers/product-review/product-review-get-by-product-id-controller';
import { ProductReviewPutController } from '@shop-backend-app/controllers/product-review/product-review-put-controller';

import { ProductReviewPostController } from '../controllers';

export const register = async (app: Express, container: ContainerBuilder) => {
  const productReviewPostController: ProductReviewPostController = container.get(
    'Apps.Shop.Backend.controllers.ProductReviewPostController'
  );

  const productReviewPutController: ProductReviewPutController = container.get(
    'Apps.Shop.Backend.controllers.ProductReviewPutController'
  );

  const productReviewGetByProductIdController: ProductReviewGetByProductIdController = container.get(
    'Apps.Shop.Backend.controllers.ProductReviewGetByProductIdController'
  );

  app.post('/product-review', productReviewPostController.run.bind(productReviewPostController));
  app.put('/product-review', productReviewPutController.run.bind(productReviewPutController));
  app.get(
    '/product-review/product/:id',
    productReviewGetByProductIdController.run.bind(productReviewGetByProductIdController)
  );
};
