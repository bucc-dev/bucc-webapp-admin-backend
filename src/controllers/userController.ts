import { Request, Response, NextFunction } from 'express';
import User from '../models/users';
import { ErrorHandler } from '../utils/errorHandler';
import { config } from 'dotenv';
import { sendVerificationMail } from '../utils/emails';
import cache from '../utils/cache';
import mongoose from 'mongoose';
import IUser from '../interfaces/user';
import { checkUserPermission } from '../utils/controllerUtils';

config();


class UserController {
	static async getUser(req: Request, res: Response, next: NextFunction) {
		let targetUserId: string | mongoose.Schema.Types.ObjectId = req.params.targetUserId;
		let scope: 'own' | 'others' = targetUserId ? 'others' : 'own';

		try {
			await checkUserPermission(req.user, 'users', 'read', scope, targetUserId);

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
	
}

export default UserController;
