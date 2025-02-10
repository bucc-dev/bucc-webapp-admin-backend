import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../interfaces';
import { ErrorHandler } from '../utils/errorHandler';
import User from '../models/users';
import mongoose from 'mongoose';
import { sendVerificationMail } from '../utils/emails';
import cache from '../utils/cache';
import IUser from '../interfaces/user';


function isValidSchoolEmail(email: string) {
    const pattern = /^[a-zA-Z0-9._%+-]+@(student|staff)\.babcock\.edu\.ng$/;
    if (!pattern.test(email)) {
        throw new ErrorHandler(400, "Please input a valid school email");
    }
}

class authController {
    /**
     * Refreshes the access token using the provided refresh token.
     * 
     * @param {Request} req - The request object containing cookies and user information.
     * @param {Response} res - The response object to send the new tokens.
     * @param {NextFunction} next - The next middleware function.
     * 
     * @returns {Promise<void>} - Sends new access and refresh tokens as cookies or calls next with an error.
     */
	static async refreshAccessToken(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const refreshToken: string | undefined = req.cookies?.refreshToken;

		console.error(1)
		console.error(req.originalUrl)
		if (!refreshToken) return next(new ErrorHandler(401, 'Login required'));
		console.error(2)

		const session = await mongoose.startSession();
		session.startTransaction();

		try {
            const secret = process.env.JWT_SECRET as string;
            const decoded: CustomJwtPayload = jwt.verify(refreshToken, secret) as CustomJwtPayload;

            const user: IUser | null = await User.findById(decoded._id);
            if (!user) {
                return next(new ErrorHandler(401, "Login required - Invalid refresh token"));
            }
            
			const payload: CustomJwtPayload = { _id: user._id };

			if (!user.refreshTokens.includes(refreshToken)) {
                return next(new ErrorHandler(401, "Login required - invalid refresh token"));
            }

			// generate refresh token func saves the document.
			const newRefreshToken: string = await user.generateRefreshToken(
				payload,
                refreshToken
			);

			await session.commitTransaction();
			session.endSession();

            const newAccessToken: string = jwt.sign(
				payload,
				secret,
				{
					expiresIn: '50min',
				}
			);

			res.cookie('accessToken', newAccessToken, {
				maxAge: 5 * 60 * 1000,
				httpOnly: true,
				secure: true, // change for prod
				sameSite: 'none'
			}); // 5 minutes
			res.cookie('refreshToken', newRefreshToken, {
				maxAge: 7 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				secure: true, // change for prod
				path: '/api/v1/auth/refresh',
				sameSite: 'none'
			}); // 7 days
console.error("SUCCESSFUL REFRESH");
			return res.status(200).end();
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			return next(error);
		}
	}

	static async register(req: Request, res: Response, next: NextFunction) {
		const { firstname, lastname, email, password, role } = req.body;

		const requiredFields = [
			{ field: firstname, name: 'firstname' },
			{ field: lastname, name: 'lastname' },
			{ field: role, name: 'role' },
			{ field: email, name: 'email' },
			{ field: password, name: 'password' },
		];

		for (const { field, name } of requiredFields) {
			if (!field || field.trim() === '')
				return next(new ErrorHandler(400, `${name} is missing`));

			if (name === 'role' && !['admin', 'super_admin', 'student'].includes(field))
				return next(new ErrorHandler(400, 'Invalid role'));
		}

		try {
            isValidSchoolEmail(email);

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

	static async verifyAccountToLogin(req: Request, res: Response, next: NextFunction) {
		const { otp, email } = req.body;

		if (!email) return next(new ErrorHandler(400, 'email is missing'));
		if (!otp) return next(new ErrorHandler(400, 'otp is missing'));

		try {
            isValidSchoolEmail(email);

			const user = await User.findOne({ email });
			if (!user)
				return next(new ErrorHandler(404, 'Account does not exist'));

			if (await cache.isOtpValid(user._id.toString(), otp)) {
				if (user.isVerified == true) {
					return res.status(201).json({
						status: 'success',
						message: 'Account is already verified',
					});
				}

				user.isVerified = true;

				const payload: CustomJwtPayload = {
					_id: user._id,
				};
				const accessToken: string = jwt.sign(
					payload,
					process.env.JWT_SECRET as string,
					{ expiresIn: '5min' }
				);

				// this function saves state at the end
				const refreshToken: string = await user.generateRefreshToken(
					payload
				);

				res.cookie('accessToken', accessToken, {
					maxAge: 5 * 60 * 1000,
					httpOnly: true,
					secure: false, // change for prod
					sameSite: 'none'
				}); // 5min
				res.cookie('refreshToken', refreshToken, {
					maxAge: 7 * 24 * 60 * 60 * 1000,
					httpOnly: true,
					secure: false, // change for prod
                    path: '/api/v1/auth/refresh',
					sameSite: 'none'
				}); // 7d

				return res.status(200).json({
					status: 'success',
					message: 'Successfully logged in',
				});
			} else return next(new ErrorHandler(401, 'otp is invalid'));
		} catch (error) {
			return next(error);
		}
	}

	static async resendOtp(req: Request, res: Response, next: NextFunction) {
		const { email } = req.body;

		if (!email) return next(new ErrorHandler(400, 'email is missing'));


		try {
            isValidSchoolEmail(email);

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

		if (!email) return next(new ErrorHandler(400, 'Email is missing'));
		if (!password)
			return next(new ErrorHandler(400, 'Password is missing'));

		try {
            isValidSchoolEmail(email);

			const user = await User.findOne({ email });

			if (!user || !(await user.isPasswordCorrect(password))) {
				return next(new ErrorHandler(401, 'Invalid email or password'));
			}

			if (!user.isVerified)
				return next(new ErrorHandler(403, 'Account is not verified'));

			if (user) {
				console.error(user);
				const payload: CustomJwtPayload = {
					_id: user._id,
					email: user.email,
					isVerified: user.isVerified,
				};
				const accessToken: string = jwt.sign(
					payload,
					process.env.JWT_SECRET as string,
					{ expiresIn: '50min' } // temporary
				);
				const refreshToken: string = await user.generateRefreshToken(
					payload
				);

				res.cookie('accessToken', accessToken, {
					maxAge: 50 * 60 * 1000, // temporary
					httpOnly: true,
					secure: true, // change for prod
					sameSite: 'none'
				}); // 5min
				res.cookie('refreshToken', refreshToken, {
					maxAge: 7 * 24 * 60 * 60 * 1000,
					httpOnly: true,
					secure: true, // change for prod
                    path: '/api/v1/auth/refresh',
					sameSite: 'none'
				}); // 7d

				await cache.storeUser(user);

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
        const accessToken: string = req.cookies?.accessToken;
		console.error(req.user);
		try {
            await cache.blacklistAccessToken(req.user._id, accessToken);
    
			if (req.user.refreshTokens && req.user.refreshTokens.length > 0) {
				await User.findByIdAndUpdate({ _id: req.user._id }, { $push: { refreshTokens: [] } });
			}

			res.clearCookie('accessToken', { httpOnly: true, secure: true }); // temporarily false
			res.clearCookie('refreshToken', { httpOnly: true, secure: true, path: '/api/v1/auth/refresh' }); // temporarily false

			await cache.removeUser(req.user._id);

			res.status(200).json({
				status: 'success',
				message: 'Logged out successfully',
			});
		} catch (error) {
			return next(error);
		}
	}
}

export default authController;
