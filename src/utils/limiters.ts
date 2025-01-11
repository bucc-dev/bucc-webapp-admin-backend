import rateLimit from "express-rate-limit";
import { Response, Request, NextFunction } from "express";

const rateLimitHandler = (req: Request, res: Response, next: NextFunction, options: any) => {
    const { time } = options;
    const url: string = req.originalUrl;

    // wip
    const logMessage = `Rate limit exceeded for IP: ${req.ip}, on URL: ${url}, with method: ${req.method}: too many requests with [` + `${req.body?.email ? `email: ${req.body.email}` : `ID: ${req?.user?._id}`}] \n`;
    console.log(logMessage);

    res.status(429).json({
        status: 'fail',
        message: `Too many requests, please try again after ${time}`
    });
}

/**
 * Limits requests to 100 every 5 minutes.
 */
export const minimalRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    handler: (req, res, next) => rateLimitHandler(req, res, next, {
        time: "5 minutes"
    })
});

/**
 * Limits requests to 5 per minute.
 */
export const moderateRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    handler: (req, res, next) => rateLimitHandler(req, res, next, {
        time: "1 minute"
    })
});

/**
 * Limits requests to 1 per minute.
 * like for otp and emails
 */
export const strictRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1,
    handler: (req, res, next) => rateLimitHandler(req, res, next, {
        time: "1 minute"
    })
});
