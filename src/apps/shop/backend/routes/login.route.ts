import {LoginRenewGetController} from '@shop-backend-app/controllers/login/login-renew-get-controller';
import {loginValidator} from '@shop-backend-app/middlewares/validators/login-validator';
import {Express} from 'express';
import {ContainerBuilder} from 'node-dependency-injection';

import {LoginPostController} from '../controllers';
import {verifyJWT_MW} from '../middlewares/auth';

export const register = (app: Express, container: ContainerBuilder): void => {
    const loginPostController: LoginPostController = container.get('Apps.Shop.Backend.controllers.LoginPostController');
    const loginRenewGetController: LoginRenewGetController = container.get('Apps.Shop.Backend.controllers.LoginRenewGetController');

    app.post('/login/signin', loginValidator(), loginPostController.run.bind(loginPostController));

    app.get('/login/renew/:uid', verifyJWT_MW, loginRenewGetController.run.bind(loginRenewGetController));
};
