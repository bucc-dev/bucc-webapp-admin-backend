import { Response } from "express";

export interface CustomError extends Error {
    statusCode: number;
}

/**
 * Custom error handler class for HTTP responses that extends the built-in Error class.
 * Includes a status code for HTTP responses.
 */
export class ErrorHandler extends Error implements CustomError {
    public statusCode: number = 500;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

/**
 * Handles errors by sending a graceful HTTP response.
 * @param error - The custom error object.
 * @param response - The HTTP response object.
 */
export const handleError = (error: CustomError, response: Response) => {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";

    // mongoose error status codes
    if (error.name === 'ValidationError') {
        const firstError: string = error.message.split(/,\s\w+:/)[0];
        message = firstError.split(':').slice(-1)[0].trim();
        statusCode = 422; // Unprocessable Entity for validation errors
    }

    console.error(error); // removed for prod
    response.status(statusCode).json({
      status: "fail",
      message
    });
};