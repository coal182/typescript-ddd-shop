import * as http from 'http';

import bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import Router from 'express-promise-router';
import helmet from 'helmet';
import httpStatus from 'http-status';
import { ContainerBuilder } from 'node-dependency-injection';

import { registerRoutes } from './routes';

export class Server {
  private express: express.Express;
  readonly port: string;
  httpServer?: http.Server;

  constructor(port: string, container: ContainerBuilder) {
    this.port = port;
    this.express = express();
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(helmet.xssFilter());
    this.express.use(helmet.noSniff());
    this.express.use(helmet.hidePoweredBy());
    this.express.use(helmet.frameguard({ action: 'deny' }));
    const router = Router();
    router.use(cors());
    this.express.use(router);
    registerRoutes(router, container);

    router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
    });
  }

  async listen(): Promise<void> {
    return new Promise((resolve) => {
      this.httpServer = this.express.listen(this.port, () => {
        resolve();
      });
    });
  }

  getHTTPServer() {
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
