import {NextFunction, Request, Response} from 'express';
import {z} from 'zod';

import {zodValidator} from './zod-validator';

const dataSchema = z.object({
    body: z.object({
        password: z.string({
            required_error: 'Password is required',
        }),
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email('Not a valid email'),
    }),
});

export const loginValidator = (): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => zodValidator(dataSchema);
