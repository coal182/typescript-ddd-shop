import {HealthcheckController} from '@backoffice-backend-app/controllers/healthcheck-get-controller';
import {Express} from 'express';
import {ContainerBuilder} from 'node-dependency-injection';

export const register = (app: Express, container: ContainerBuilder): void => {
    const healthcheckController: HealthcheckController = container.get('Apps.Backoffice.Backend.controllers.HealthcheckController');
    app.get('/healthcheck', healthcheckController.run.bind(healthcheckController));
};
