import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/users';
import IUser from '../interfaces/user';
import { ErrorHandler } from '../middleware/errorHandler';
import { config } from 'dotenv';

config();

class UserController {
	static async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body;

			if (!email || !password)
				throw new ErrorHandler(400, 'Email or Password is missing');

			const user: IUser | null = await User.findOne({ email });

			if (!user || !user.isPasswordCorrect(password)) {
                throw new ErrorHandler(404, 'Incorrect email or password');
            }

            if (!user.isVerified) throw new ErrorHandler(403, 'Account is not verified');

			if (user) {
				const accessToken: string = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '5min'});
				const refreshToken: string = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d'});

                user.refreshToken = refreshToken;
                await user.save();

                res.status(200).json({
                    status: 'success',
                    message: 'Successfully logged in',
                    data: {
                        accessToken,
                        refreshToken
                    }
                })
			}
		} catch (error) {
			next(error);
		}
	}

	static async logout(req: Request, res: Response, next: NextFunction) {
		try {
			const user: IUser | null = await User.findById(req.user._id);

			if (!user) throw new ErrorHandler(401, 'Login required');

			if (user.refreshToken) {
				user.refreshToken = '';
				await user.save();
			}

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
