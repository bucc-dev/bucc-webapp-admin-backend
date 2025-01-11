import { Request, Response, NextFunction } from 'express';
import User from '../models/users';
import { ErrorHandler } from '../utils/errorHandler';
import { config } from 'dotenv';
import { sendVerificationMail } from '../utils/emails';
import cache from '../utils/cache';
import mongoose, { DeleteResult } from 'mongoose';
import IUser from '../interfaces/user';
import { checkUserPermission } from '../utils/controllerUtils';

config();


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

			return res.status(200).json({
				status: 'succcess',
				data: targetUser.toJSON()
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

			const user = await User.findById(targetUserId);
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
	
}

export default UserController;
