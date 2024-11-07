import { Response } from "express";

export interface CustomError extends Error {
    statusCode: number;
}

export class ErrorHandler extends Error implements CustomError {
    public statusCode: number = 500;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const handleError = (error: CustomError, response: Response) => {
    let statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    // mongoose error status codes
    if (error.name === 'ValidationError') {
        statusCode = 422; // Unprocessable Entity for validation errors
    }


    response.status(statusCode).json({
      status: "fail",
      message
    });
};