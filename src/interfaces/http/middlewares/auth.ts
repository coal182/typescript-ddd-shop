import { Request, Response, NextFunction } from 'express';
import * as StatusCodes from 'http-status-codes';
import { JwtPayload, verify, sign } from 'jsonwebtoken';
import _ from 'lodash';

import config from '@config/main';

export function verifyJWTToken(token: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    verify(token, config.JWT_SECRET, (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err);
      }
      resolve(decodedToken as JwtPayload);
    });
  });
}

export function createJWToken(details: JwtPayload): string {
  if (typeof details !== 'object') {
    details = {};
  }

  if (!details.maxAge || typeof details.maxAge !== 'number') {
    details.maxAge = 3600;
  }

  details.sessionData = _.reduce(
    details.sessionData || {},
    (memo: any, val: any, key: any) => {
      if (typeof val !== 'function' && key !== 'password') {
        memo[key] = val;
      }
      return memo;
    },
    {}
  );

  const token = sign(
    {
      data: details.sessionData,
    },
    config.JWT_SECRET,
    {
      expiresIn: details.maxAge,
      algorithm: 'HS256',
    }
  );

  return token;
}

export function verifyJWT_MW(req: Request, res: Response, next: NextFunction): void {
  let token = req.headers['authorization'] || '';
  token = token.replace('Bearer', '').trim();

  verifyJWTToken(token)
    .then((decodedToken) => {
      req.params.user = decodedToken.data;
      next();
    })
    .catch((err) => {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: `Invalid auth token provided. ${err}` });
    });
}

export default {
  verifyJWT_MW,
  verifyJWTToken,
  createJWToken,
};
