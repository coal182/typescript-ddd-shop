import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import {
  BookGetByCriteriaController,
  BookPostController,
  BookGetAllController,
  BookGetByIdController,
} from '@storebackapp/controllers';

export const register = async (app: Express, container: ContainerBuilder) => {
  const bookPostController: BookPostController = container.get('Apps.Store.Backend.controllers.BookPostController');
  const bookGetAllController: BookGetAllController = container.get(
    'Apps.Store.Backend.controllers.BookGetAllController'
  );
  const bookGetByIdController: BookGetByIdController = container.get(
    'Apps.Store.Backend.controllers.BookGetByIdController'
  );
  const bookGetByCriteriaController: BookGetByCriteriaController = container.get(
    'Apps.Store.Backend.controllers.BookGetByCriteriaController'
  );

  app.post('/book', bookPostController.run.bind(bookPostController));

  app.get('/book', bookGetAllController.run.bind(bookGetAllController));
  app.get('/book/criteria', bookGetByCriteriaController.run.bind(bookGetByCriteriaController));
  app.get('/book/:id', bookGetByIdController.run.bind(bookGetByIdController));
};
