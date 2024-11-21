import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/users';
import IUser from '../interfaces/user';
import { ErrorHandler } from '../middleware/errorHandler';
import { config } from 'dotenv';
import { CustomJwtPayload } from '../interfaces';
import { sendVerificationMail } from '../utils/emails';
import cache from '../utils/cache';

config();

class UserController {
	static async register(req: Request, res: Response, next: NextFunction) {
		const { firstname, lastname, email, password, role } = req.body;

		const requiredFields = [
			{ field: firstname, name: 'Firstname' },
			{ field: lastname, name: 'Lastname' },
			{ field: role, name: 'Role' },
			{ field: email, name: 'Email' },
			{ field: password, name: 'Password' },
		];

		for (const { field, name } of requiredFields) {
			if (!field || field.trim() === '')
				return next(new ErrorHandler(400, `${name} is missing`));

			if (
				name === 'Role' &&
				!['senator', 'senate_president'].includes(field)
			)
				return next(new ErrorHandler(400, 'Invalid role'));
		}

		try {
			const user = await User.findOne({ email });
			if (!user) {
				const newUser = await User.create({
					firstname,
					lastname,
					email,
					password,
					role,
				});

				sendVerificationMail(newUser._id.toString(), email);

				return res.status(201).json({
					status: 'success',
					message: 'An OTP has been sent to your email',
				});
			}
			return next(new ErrorHandler(409, 'Email has already been used'));
		} catch (error) {
			return next(error);
		}
	}

	static async verifyOtp(req: Request, res: Response, next: NextFunction) {
		const { otp, email } = req.body;

		if (!email) return next(new ErrorHandler(400, 'email is missing'));
		if (!otp) return next(new ErrorHandler(400, 'otp is missing'));

		try {
			const user = await User.findOne({ email });
			if (!user)
				return next(new ErrorHandler(404, 'User does not exist'));

			if (await cache.isOtpValid(user._id.toString(), otp)) {
				user.isVerified = true;

				const payload: CustomJwtPayload = {
					_id: user._id,
					email: user.email,
					accessLevel: user.accessLevel,
				};
				const accessToken: string = jwt.sign(
					payload,
					process.env.JWT_SECRET as string,
					{ expiresIn: '5min' }
				);
				const refreshToken: string = await user.generateRefreshToken(
					payload
				);
				

				res.cookie('accessToken', accessToken, {
					maxAge: 5 * 60 * 1000,
					httpOnly: true,
					secure: true,
				});
				res.cookie('refreshToken', refreshToken, {
					maxAge: 7 * 24 * 60 * 60 * 1000,
					httpOnly: true,
					secure: true,
				}); // 7 days in ms

				return res.status(200).json({
					status: 'success',
					message: 'Successfully logged in',
				});
			}
		} catch (error) {
			return next(error);
		}
	}

	static async resendOtp(req: Request, res: Response, next: NextFunction) {
		const { email } = req.body;

		if (!email) return next(new ErrorHandler(400, 'email is missing'));

		try {
			const user = await User.findOne({ email });
			if (!user)
				return next(new ErrorHandler(404, 'User does not exist'));

			sendVerificationMail(user._id.toString(), email);

			return res.status(200).json({
				status: 'success',
				message: 'OTP has been successfully sent to your email.',
			});
		} catch (error) {
			return next(error);
		}
	}

	static async login(req: Request, res: Response, next: NextFunction) {
		const { email, password } = req.body;

		if (!email || !password)
			return next(new ErrorHandler(400, 'Email or Password is missing'));

		try {
			const user = await User.findOne({ email });

			if (!user || !(await user.isPasswordCorrect(password))) {
				return next(new ErrorHandler(401, 'Invalid email or password'));
			}

			if (!user.isVerified)
				return next(new ErrorHandler(403, 'User is not verified'));

			if (user) {
				const payload: CustomJwtPayload = {
					_id: user._id,
					email: user.email,
					accessLevel: user.accessLevel,
				};
				const accessToken: string = jwt.sign(
					payload,
					process.env.JWT_SECRET as string,
					{ expiresIn: '5min' }
				);
				const refreshToken: string = await user.generateRefreshToken(
					payload
				);

				res.cookie('accessToken', accessToken, {
					maxAge: 5 * 60 * 1000,
					httpOnly: true,
					secure: true,
				});
				res.cookie('refreshToken', refreshToken, {
					maxAge: 7 * 24 * 60 * 60 * 1000,
					httpOnly: true,
					secure: true,
				}); // 7 days in ms

				return res.status(200).json({
					status: 'success',
					message: 'Successfully logged in',
				});
			}
		} catch (error) {
			return next(error);
		}
	}

	static async logout(req: Request, res: Response, next: NextFunction) {
		try {
			const user = await User.findById(req.user._id);

			if (!user) return next(new ErrorHandler(401, 'Login required'));

			const refreshToken: string = req.cookies?.refreshToken;

			if (user.refreshTokens.includes(refreshToken)) {
				user.refreshTokens = user.refreshTokens.filter(
					(rt) => rt !== refreshToken
				);
				await user.save();
			}

			res.clearCookie('accessToken', { httpOnly: true, secure: true });
			res.clearCookie('refreshToken', { httpOnly: true, secure: true });

			res.status(200).json({
				status: 'success',
				message: 'Logged out successfully',
			});
		} catch (error) {
			return next(error);
		}
	}

	static async logoutAllDevices(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const user = await User.findById(req.user._id);

			if (!user) return next(new ErrorHandler(401, 'Login required'));

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
			return next(error);
		}
	}
}

export default UserController;
