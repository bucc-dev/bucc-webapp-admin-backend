import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose, { DeleteResult } from 'mongoose';
import User from '../models/users';
import { ErrorHandler } from '../utils/errorHandler';
import { sendPasswordResetEmail, sendVerificationMail } from '../utils/emails';
import cache from '../utils/cache';
import IUser from '../interfaces/user';
import { checkUserPermission } from '../utils/controllerUtils';
import { CustomJwtPayload } from '../interfaces';

config();

const defaultExcludedFields: string = '-password -refreshTokens';

class UserController {

	static async getUser(req: Request, res: Response, next: NextFunction) {
		let targetUserId: string | mongoose.Schema.Types.ObjectId = req.params.targetUserId;

		try {
			await checkUserPermission(req.user, 'users', 'read', targetUserId);

			let targetUser: IUser | null;
			if (targetUserId) {
				targetUser = await User.findById(targetUserId);
				if (!targetUser) {
					return next(new ErrorHandler(404, "User does not exist"));
				}
			} else {
				targetUser = req.user;
			}

			// send the user object without sensitive fields
			const { password, refreshTokens, ...responseUser } = targetUser;
			const user = responseUser;

			return res.status(200).json({
				status: 'succcess',
				data: user
			});
		} catch (error) {
			return next(error);
		}
	}

	static async deleteUser(req: Request, res: Response, next: NextFunction) {
		let targetUserId: string | mongoose.Schema.Types.ObjectId = req.params.targetUserId ? req.params.targetUserId : req.user._id;

		try {
			await checkUserPermission(req.user, 'users', 'delete', targetUserId);

			const result: DeleteResult = await User.deleteOne({ _id: targetUserId });
			if (result.deletedCount === 0) {
				return next(new ErrorHandler(404, "User does not exist"));
			}

			return res.status(204).send();
		} catch (error) {
			return next(error);
		}
	}

	static async updateUserRole(req: Request, res: Response, next: NextFunction) {
		let targetUserId: string | mongoose.Schema.Types.ObjectId = req.params.targetUserId;
		const newRole = req.body.newRole;

		if (req.user._id.toString() ===  targetUserId) {
			return next(new ErrorHandler(400, 'User cannot update their own role'));
		}

		try {
			await checkUserPermission(req.user, 'users', 'update', targetUserId);

			const user = await User.findById(targetUserId).select(defaultExcludedFields);
			if (!user) {
				return next(new ErrorHandler(404, 'User does not exist'));
			}
			if (user.role === newRole) {
				return next(new ErrorHandler(400, `User already has the ${newRole} role`));
			}

			user.role = newRole;
			await user.save();

			return res.status(200).json({
				status: 'success',
				data: user
			});
		} catch (error) {
			return next(error);
		}
	}

	static async updateUserName(req: Request, res: Response, next: NextFunction) {
		const { newFirstName, newLastName } = req.body;

		if (!newFirstName && !newLastName) {
			return next(new ErrorHandler(400, ''));
		}

		try {
			await checkUserPermission(req.user, 'users', 'update');

			if (newFirstName) {
				req.user.firstname = newFirstName;
			}
			if (newLastName) {
				req.user.lastname = newLastName;
			}

			await req.user.save();

			// send the user object without sensitive fields
			const { password, refreshTokens, ...responseUser } = req.user;
			const user = responseUser;
	  
			return res.status(200).json({
				status: 'success',
				data: user
			});
		} catch (error) {
			return next(error);
		}
	}

	static async updateUserPassword(req: Request, res: Response, next: NextFunction) {
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		if (!oldPassword || !newPassword || !confirmNewPassword) {
			return next(new ErrorHandler(400, 'All password fields are required'));
		}

		if (newPassword !== confirmNewPassword) {
			return next(new ErrorHandler(400, 'newPassword and confirmNewPassword do not match'));
		}

		if (!(req.user.isPasswordCorrect(oldPassword))) {
			return next(new ErrorHandler(401, 'oldPassword is incorrect'));
		}

		try {
			await checkUserPermission(req.user, 'users', 'update');

			req.user.password = await bcrypt.hash(newPassword, 10);

			await req.user.save();

			return res.status(200).json({
				status: 'success',
				message: 'Password has been updated'
			});
		} catch (error) {
			return next(error);
		}
	}

	static async forgotPassword(req: Request, res: Response, next: NextFunction) {
		const { email } = req.body;

		if (!email) {
			return next(new ErrorHandler(400, 'email is missing'));
		}

		try {
			const user = await User.findOne({ email });
			if (!user) {
				return next(new ErrorHandler(404, 'Email is not registered'));
			}

			const accessToken: string = jwt.sign(
				{ _id: user._id, reset: true },
				process.env.JWT_SECRET as string,
				{ expiresIn: '5min' }
			);

			sendPasswordResetEmail(user, accessToken);

			return res.status(200).json({
				status: 'success',
				message: 'A password reset link has been sent to your email'
			});
		} catch (error) {
			return next(error);
		}
	}

	static async resetPassword(req: Request, res: Response, next: NextFunction) {
		const { newPassword, confirmNewPassword } = req.body;

		if (!newPassword || !confirmNewPassword) {
			return next(new ErrorHandler(400, 'All password fields are required'));
		}

		if (newPassword !== confirmNewPassword) {
			return next(new ErrorHandler(400, 'newPassword and confirmNewPassword do not match'));
		}

		try {
			await checkUserPermission(req.user, 'users', 'update');

			req.user.password = await bcrypt.hash(newPassword, 10);

			await req.user.save();

			return res.status(200).json({
				status: 'success',
				message: 'Password has been successfully reset'
			});
		} catch (error) {
			return next(error);
		}
	}

	static async updateEmail(req: Request, res: Response, next: NextFunction) {
		const { email } = req.body;

		if (!email) {
			return next(new ErrorHandler(400, 'email is missing'));
		}

		try {
			const user = await User.findOne({ email });
			if (user) {
				return next(new ErrorHandler(409, 'Email has already been used'));
			}

			sendVerificationMail(req.user._id.toString(), email);

			return res.status(200).json({
				status: 'success',
				message: 'A OTP has been sent to your new email'
			});
		} catch (error) {
			return next(error);
		}
	}

	static async setNewEmail(req: Request, res: Response, next: NextFunction) {
		const { email: newEmail, otp } = req.body;

		if (!newEmail) {
			return next(new ErrorHandler(400, 'email is missing'));
		}

		try {
			const user = await User.findOne({ newEmail });
			if (user) {
				return next(new ErrorHandler(409, 'Email has already been used'));
			}

			if (await cache.isOtpValid(req.user._id.toString(), otp)) {
				req.user.email = newEmail;

				await req.user.save();

				return res.status(200).json({
					status: 'success',
					message: 'Email has been updated'
				});
			} else {
				return next(new ErrorHandler(401, 'otp is invalid'));
			}
		} catch (error) {
			return next(error);
		}
	}
}

export default UserController;
