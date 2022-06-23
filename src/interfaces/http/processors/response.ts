import * as StatusCodes from 'http-status-codes';

export const ok = (message: string, data: any) => ({
  status: StatusCodes.OK,
  message: message || 'Success',
  data,
});
