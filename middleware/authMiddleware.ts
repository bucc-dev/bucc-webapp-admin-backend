import { Request, Response, NextFunction } from 'express';
import jwt, { decode, TokenExpiredError } from 'jsonwebtoken';
import { CustomJwtPayload } from '../interfaces';
import { ErrorHandler } from './errorHandler';
import User from '../models/users';
import IUser from '../interfaces/user';


const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken: string | undefined = req.cookies?.accessToken;
    const refreshToken: string | undefined = req.cookies?.refreshToken;
    const secret: string | undefined = process.env.JWT_SECRET;

    if (!accessToken || !refreshToken || !secret) {
        return next(new ErrorHandler(401, 'Login required'));
    }

    // ensure refreshtoken is also valid
    const refreshIsValid = jwt?.verify(refreshToken, secret);
    if (!refreshIsValid) return next(new ErrorHandler(401, 'Login required'));

    try {
        const decoded: CustomJwtPayload = jwt?.verify(accessToken, secret) as CustomJwtPayload;
        req.user = decoded;

        return next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            const decoded = jwt.decode(accessToken) as CustomJwtPayload;

            const user: IUser | null = await User.findById(decoded._id);

            if (user && user.refreshToken === refreshToken) {
                const payload: CustomJwtPayload = { _id: user._id, email: user.email, refreshed: true };
                const newAccessToken: string = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '5min' });

                res.cookie('accessToken', newAccessToken, { maxAge: 5 * 60 * 1000, httpOnly: true, secure: true }); // 5 mins

                req.user = payload;
                return next();
            }
        }
        return next(new ErrorHandler(401, 'Login required'));
    }
};

export default authMiddleware;
