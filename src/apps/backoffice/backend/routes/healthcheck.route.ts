import { Express } from 'express';
import { ContainerBuilder } from 'node-dependency-injection';

import { HealthcheckController } from '@backoffice-backend-app/controllers/healthcheck-get-controller';

export const register = async (app: Express, container: ContainerBuilder) => {
  const healthcheckController: HealthcheckController = container.get(
    'Apps.Backoffice.Backend.controllers.HealthcheckController'
  );
  app.get('/healthcheck', healthcheckController.run.bind(healthcheckController));
};
