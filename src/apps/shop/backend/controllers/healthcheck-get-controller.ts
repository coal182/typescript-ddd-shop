import {Request, Response} from 'express';
import httpStatus from 'http-status';

export class HealthcheckController {
    async run(req: Request, res: Response): Promise<void> {
        const healthcheck = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now(),
        };
        try {
            res.send(healthcheck);
        } catch (error) {
            res.status(httpStatus.SERVICE_UNAVAILABLE).send();
        }
    }
}
