import rateLimit from "express-rate-limit";
import { Response, Request, NextFunction } from "express";

const rateLimitHandler = (req: Request, res: Response, next: NextFunction) => {
    const url: string = req.originalUrl;
    let message: string;
    let logMessage: string = `Rate limit exceeded for IP: ${req.ip}, on URL: ${url}, with method: ${req.method}`;

    if (url.includes('login')) {
        message = 'login attempts';
        logMessage = `Rate limit exceeded for IP: ${req.ip}, on URL: ${url}, with method: ${req.method} \n too many login attempts with ${req.body?.email}`;
    } else if (url.includes('signup')) {
        message = 'signup attempts';
    } else {
        message = 'requests';
    }

    console.log(logMessage);

    res.status(429).json({
        status: 'fail',
        message: `Too many ${message}, please try again after 5 minutes`
    });
}

export const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10,
    handler: rateLimitHandler
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    handler: rateLimitHandler
});
