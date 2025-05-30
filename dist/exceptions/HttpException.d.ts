export declare class HttpException extends Error {
    success: boolean;
    status: number;
    message: string;
    errors?: string[];
    constructor(success: boolean, status: number, message: string, errors?: string[]);
}
export declare class HttpExceptionTooManyRequests extends HttpException {
    constructor(errors: string[]);
}
