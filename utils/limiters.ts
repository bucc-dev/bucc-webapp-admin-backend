import rateLimit from "express-rate-limit";
import { Response, Request, NextFunction } from "express";

const rateLimitHandler = (req: Request, res: Response, next: NextFunction) => {
    const url: string = req.originalUrl;
    let message: string;
    let time: string = '1 minute'; // default

    if (url.includes('login')) {
        message = 'login attempts';
    } else if (url.includes('signup')) {
        message = 'signup attempts';
    } else {
        message = 'requests';
        time = '5 minutes';
    }

    // wip
    const logMessage = `Rate limit exceeded for IP: ${req.ip}, on URL: ${url}, with method: ${req.method}: too many ${message} with [` + `${req.body?.email ? `email: ${req.body.email}` : `ID: ${req?.user?._id}`}] \n`;
    console.log(logMessage);

    res.status(429).json({
        status: 'fail',
        message: `Too many ${message}, please try again after ${time}`
    });
}

/**
 * Limits requests to 5 per minute.
 */
export const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    handler: rateLimitHandler
});

/**
 * Limits requests to 100 every 5 minutes.
 */
export const generalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    handler: rateLimitHandler
});
