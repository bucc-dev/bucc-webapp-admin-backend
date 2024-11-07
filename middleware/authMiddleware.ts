import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../interfaces';
import { ErrorHandler } from './errorHandler';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.headers.authorization?.split(' ')[1];

    try {
        const secret: string | undefined = process.env.JWT_SECRET;

        if (!token || !secret) throw new ErrorHandler(401, 'Login required');

        const decoded: CustomJwtPayload = jwt.verify(token, secret) as CustomJwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};

export default authMiddleware;
