import { Response } from "express";

export interface CustomError extends Error {
    statusCode: number;
}

export class ErrorHandler extends Error implements CustomError {
    public statusCode: number = 500;
    public message: string;

    constructor(statusCode: number, message: string) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

export const handleError = (error: CustomError, response: Response) => {
    let { statusCode, message } = error;
    if (!statusCode) {
        // default
        statusCode = 500;
    }

    // mongoose error status codes
    if (error.name === 'ValidationError') {
        statusCode = 422; // Unprocessable Entity for validation errors
    }


    response.status(statusCode).json({
      status: "fail",
      message
    });
};