import {HealthcheckController} from '@shop-backend-app/controllers/healthcheck-get-controller';
import {Express} from 'express';
import {ContainerBuilder} from 'node-dependency-injection';

export const register = (app: Express, container: ContainerBuilder): void => {
    const healthcheckController: HealthcheckController = container.get('Apps.Shop.Backend.controllers.HealthcheckController');
    app.get('/healthcheck', healthcheckController.run.bind(healthcheckController));
};
