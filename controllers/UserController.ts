import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/users';
import IUser from '../interfaces/user';
import { ErrorHandler } from '../middleware/errorHandler';
import { config } from 'dotenv';
import { CustomJwtPayload } from '../interfaces';

config();

class UserController {
	static async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body;

			if (!email || !password)
				throw new ErrorHandler(400, 'Email or Password is missing');

			const user: IUser | null = await User.findOne({ email });

			if (!user || !(await user.isPasswordCorrect(password))) {
                throw new ErrorHandler(401, 'Invalid email or password');
            }

            if (!user.isVerified) throw new ErrorHandler(403, 'Account is not verified');

			if (user) {
				const payload: CustomJwtPayload = { _id: user._id, email: user.email, accessLevel: user.accessLevel };
				const accessToken: string = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '5min'});
				const refreshToken: string = await user.generateRefreshToken(payload);

                res.cookie('accessToken', accessToken, { maxAge: 5 * 60 * 1000, httpOnly: true, secure: true });
                res.cookie('refreshToken', refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true }); // 7 days in ms

                res.status(200).json({
                    status: 'success',
                    message: 'Successfully logged in'
                });
			}
		} catch (error) {
			next(error);
		}
	}

	static async logout(req: Request, res: Response, next: NextFunction) {
		try {
			const user: IUser | null = await User.findById(req.user._id);

			if (!user) throw new ErrorHandler(401, 'Login required');

			const refreshToken: string = req.cookies?.refreshToken;

			if (user.refreshTokens.includes(refreshToken)) {
				user.refreshTokens = user.refreshTokens.filter(rt => rt !== refreshToken);
				await user.save();
			}

			res.clearCookie('accessToken', { httpOnly: true, secure: true });
            res.clearCookie('refreshToken', { httpOnly: true, secure: true });

			res.status(200).json({
				status: 'success',
				message: 'Logged out successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	static async logoutAllDevices(req: Request, res: Response, next: NextFunction) {
		try {
			const user: IUser | null = await User.findById(req.user._id);

			if (!user) throw new ErrorHandler(401, 'Login required');

			const refreshToken: string = req.cookies?.refreshToken;

			if (user.refreshTokens && user.refreshTokens.length > 0) {
				user.refreshTokens = [];
				await user.save();
			}

			res.clearCookie('accessToken', { httpOnly: true, secure: true });
            res.clearCookie('refreshToken', { httpOnly: true, secure: true });

			res.status(200).json({
				status: 'success',
				message: 'Logged out successfully',
			});
		} catch (error) {
			next(error);
		}
	}
}

export default UserController;
