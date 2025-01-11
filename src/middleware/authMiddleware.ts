import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../interfaces';
import { ErrorHandler } from '../utils/errorHandler';
import User from '../models/users';
import IUser from '../interfaces/user';
import cache from '../utils/cache';

/**
 * Middleware to authenticate users using JWT tokens.
 * Verifies the access token and attaches the user payload to the request object.
 * Handles errors and clears invalid tokens.
 * 
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken: string | undefined = req.cookies?.accessToken;
    const secret: string | undefined = process.env.JWT_SECRET;

    if (!accessToken || !secret) {
        return next(new ErrorHandler(401, 'Login required'));
    }

    try {
        const decoded: CustomJwtPayload = jwt.verify(accessToken, secret) as CustomJwtPayload;

        if (await cache.isAccessTokenBlacklisted(decoded._id, accessToken)) {
            return next(new ErrorHandler(401, "Login required"));
        }

        let user: IUser | null = await cache.getUser(decoded._id) as IUser | null;
        if (!user) {
            const user: IUser | null = await User.findById(decoded._id);
            if (!user) return next(new ErrorHandler(404, "Account does not exist: Invalid ID"));
            if (!user.isVerified) return next(new ErrorHandler(403, 'Account is not verified'));

            await cache.storeUser(user);
        }

        req.user = user as IUser;

        return next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            const payload: CustomJwtPayload = jwt.decode(req.cookies?.accessToken) as CustomJwtPayload;

            if (payload && payload.reset) {
                return next(new ErrorHandler(401, 'Password reset link has expired'));
            }
        }
        console.log(error);
        return next(new ErrorHandler(401, "Login required"));
    }
};

export default authMiddleware;
