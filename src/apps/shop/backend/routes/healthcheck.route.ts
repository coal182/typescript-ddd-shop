import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import { HealthcheckController } from '@shop-backend-app/controllers/healthcheck-get-controller';

export const register = async (app: Express, container: ContainerBuilder) => {
  const healthcheckController: HealthcheckController = container.get(
    'Apps.Shop.Backend.controllers.HealthcheckController'
  );
  app.get('/healthcheck', healthcheckController.run.bind(healthcheckController));
};
