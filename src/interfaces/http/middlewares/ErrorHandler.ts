import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res.status(err.httpCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: Number(err.statusCode) || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message,
  });
};
