import Logger from '@shared/domain/logger';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, {Request, Response} from 'express';
import Router from 'express-promise-router';
import helmet from 'helmet';
import httpStatus from 'http-status';
import {ContainerBuilder} from 'node-dependency-injection';
import {ZodError} from 'zod';

import * as http from 'http';

import {registerRoutes} from './routes';

export class Server {
    private express: express.Express;
    readonly port: string;
    private logger: Logger;
    httpServer?: http.Server;

    constructor(port: string, container: ContainerBuilder) {
        this.port = port;
        this.logger = container.get('Shared.Logger');
        this.express = express();
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: true}));
        this.express.use(helmet.xssFilter());
        this.express.use(helmet.noSniff());
        this.express.use(helmet.hidePoweredBy());
        this.express.use(helmet.frameguard({action: 'deny'}));
        const router = Router();
        router.use(cors());
        this.express.use(router);
        registerRoutes(router, container);

        router.use((err: Error, req: Request, res: Response) => {
            this.logger.error(err);
            if (err instanceof ZodError) {
                res.status(httpStatus.BAD_REQUEST).json(err);
            }
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
        });
    }

    async listen(): Promise<void> {
        return new Promise((resolve) => {
            this.httpServer = this.express.listen(this.port, () => {
                this.logger.info(`  Backoffice Backend App is running at http://localhost:${this.port} in ${this.express.get('env')} mode`);
                this.logger.info('  Press CTRL-C to stop\n');
                resolve();
            });
        });
    }

    getHTTPServer(): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | undefined {
        return this.httpServer;
    }

    async stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.httpServer) {
                this.httpServer.close((error) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve();
                });
            }

            return resolve();
        });
    }
}
