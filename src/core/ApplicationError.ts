import { StatusCodes } from 'http-status-codes';

export class ApplicationError extends Error {
  public readonly httpCode: number;
  public readonly statusCode: number;
  constructor(httpCode: number, statusCode: number, message: string) {
    super(message);
    this.httpCode = httpCode;
    this.statusCode = statusCode;
  }
}

export class NotFoundException extends ApplicationError {
  constructor(public readonly message: string) {
    super(StatusCodes.NOT_FOUND, StatusCodes.NOT_FOUND, message || 'Entity not found');
  }
}

export class PasswordNotMatchException extends ApplicationError {
  constructor(public readonly message: string) {
    super(StatusCodes.UNAUTHORIZED, StatusCodes.UNAUTHORIZED, message || 'Password not match');
  }
}

export class ConcurrencyException extends ApplicationError {
  constructor(public readonly message: string) {
    super(StatusCodes.CONFLICT, StatusCodes.CONFLICT, message || 'Concurrency detected');
  }
}
