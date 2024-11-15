import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { CustomJwtPayload } from '../interfaces';
import { ErrorHandler } from './errorHandler';
import User from '../models/users';
import IUser from '../interfaces/user';
import mongoose from 'mongoose';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken: string | undefined = req.cookies?.accessToken;
    const refreshToken: string | undefined = req.cookies?.refreshToken;
    const secret: string | undefined = process.env.JWT_SECRET;

    if (!accessToken || !secret) {
        return next(new ErrorHandler(401, 'Login required'));
    }

    try {
        const decoded: CustomJwtPayload = jwt.verify(accessToken, secret) as CustomJwtPayload;
        req.user = decoded;
        return next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            if (!refreshToken) return next(new ErrorHandler(401, 'Login required'));

            try {
                jwt.verify(refreshToken, secret);
            } catch (error) {
                return next(new ErrorHandler(401, 'Login required'));
            }

            const user: IUser | null = await User.findOne({ refreshTokens: refreshToken });

            if (user) {
                const session = await mongoose.startSession();
                session.startTransaction();

                try {
                    user.refreshTokens = user.refreshTokens.filter(rt => rt !== refreshToken);

                    const payload: CustomJwtPayload = { _id: user._id, email: user.email, accessLevel: user.accessLevel };

                    const newRefreshToken: string = await user.generateRefreshToken(payload);
                    const newAccessToken: string = jwt.sign(payload, secret, { expiresIn: '5min' });

                    res.cookie('accessToken', newAccessToken, { maxAge: 5 * 60 * 1000, httpOnly: true, secure: true }); // 5 minutes
                    res.cookie('refreshToken', newRefreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true }); // 7 days

                    req.user = payload;

                    await session.commitTransaction();
                    session.endSession();
                    return next();
                } catch (error) {
                    await session.abortTransaction();
                    session.endSession();
                    return next(error);
                }
            }
        }

        // remove expired or invalid tokens
        res.clearCookie('accessToken', { httpOnly: true, secure: true });
        res.clearCookie('refreshToken', { httpOnly: true, secure: true });

        return next(new ErrorHandler(401, 'Login required'));
    }
};

export default authMiddleware;
