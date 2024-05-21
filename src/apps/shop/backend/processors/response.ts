import {StatusCodes} from 'http-status-codes';

export interface ApiResponse {
    status: StatusCodes;
    message: string;
    data: Record<string, unknown>;
}

export const ok = (message: string, data?: any): ApiResponse => ({
    status: StatusCodes.OK,
    message: message || 'Success',
    data,
});

export const created = (message: string, data?: any): ApiResponse => ({
    status: StatusCodes.CREATED,
    message: message || 'Success',
    data,
});
