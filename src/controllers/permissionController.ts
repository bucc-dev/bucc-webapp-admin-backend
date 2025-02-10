import { Request, Response, NextFunction } from 'express';
import User from '../models/users';
import Permission from '../models/permissions';
import { ErrorHandler } from '../utils/errorHandler';
import { IPermission } from '../interfaces/permission';

class PermissionController {
	static async getPermission(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const { targetUserId } = req.params;
        if (!targetUserId) {
            return next(new ErrorHandler(400, 'targetUserId is missing'));
        }

		try {
            // students can't view permissions and admins can only view their own permissions, while super_admin can view anybody's own.
			if (
				req.user.role === 'student' ||
				(req.user._id.toString() !== targetUserId &&
					req.user.role !== 'super_admin')
			) return next(new ErrorHandler(403, 'Access denied'));

            let targetUser;
            if (req.user._id.toString() === targetUserId ) {
                targetUser = req.user;
            } else {
			    targetUser = await User.findById(targetUserId);
			    if (!targetUser) return next(new ErrorHandler(404, 'User does not exist'));
            }

			const permissionDocument = (await Permission.findOne({
				userId: targetUser._id,
			})) as IPermission;

			return res.status(200).json({
				status: 'success',
				data: permissionDocument,
			});
		} catch (error) {
			return next(error);
		}
	}

	static async checkPermission(
		req: Request,
		res: Response,
		next: NextFunction
	) { 
		try {
			const { resource, action } = req.body;
			const scope: 'own' | 'others' = req.body.scope;

			const requiredFields = [
				{ field: resource, name: 'resource' },
				{ field: action, name: 'action' },
				{ field: scope, name: 'scope' },
			];

			for (const { field, name } of requiredFields) {
				if (!field || field.trim() === '')
					return next(new ErrorHandler(400, `${name} is missing`));
			}

			let hasPermission: boolean = true;
			let message: string = 'User has permission';
			let statusCode: number = 200;

			if (!(await req.user.hasPermission(resource, action, scope))) {
				hasPermission = false;
				message = 'User does not have permission';
				statusCode = 403;
			}

			return res.status(statusCode).json({
				status: 'success',
				message,
				hasPermission,
			});
		} catch (error) {
			return next(error);
		}
	}

	static async grantPermission(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const currentUser = req.user

			const targetUserId = req.params.targetUserId;
			const { resource, action, scope } = req.body;

			const requiredFields = [
				{ field: targetUserId, name: 'targetUserId' },
				{ field: resource, name: 'resource' },
				{ field: action, name: 'action' },
				{ field: scope, name: 'scope' },
			];

			for (const { field, name } of requiredFields) {
				if (!field || field.trim() === '')
					return next(new ErrorHandler(400, `${name} is missing`));
			}

			const targetUser = await User.findById(targetUserId);
			if (!targetUser)
				throw new ErrorHandler(404, 'Target user does not exist');

			let message: string = 'Permission granted';

			const messageResponse = await Permission.grantPermission(
				currentUser,
				targetUser,
				resource,
				action,
				scope
			);
			if (messageResponse) {
				message = messageResponse;
			}

			return res.status(200).json({
				status: 'success',
				message,
			});
		} catch (error) {
			return next(error);
		}
	}

	static async revokePermission(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const currentUser = req.user;

			const targetUserId = req.params.targetUserId;
			const { resource, action, scope } = req.body;

			const requiredFields = [
				{ field: targetUserId, name: 'targetUserId' },
				{ field: resource, name: 'resource' },
				{ field: action, name: 'action' },
				{ field: scope, name: 'scope' },
			];

			for (const { field, name } of requiredFields) {
				if (!field || field.trim() === '')
					return next(new ErrorHandler(400, `${name} is missing`));
			}

			const targetUser = await User.findById(targetUserId);
			if (!targetUser)
				throw new ErrorHandler(404, 'Target user does not exist');

			let message: string = 'Permission revoked';

			const messageResponse = await Permission.revokePermission(
				currentUser,
				targetUser,
				resource,
				action,
				scope
			);
			if (messageResponse) {
				message = messageResponse;
			}

			return res.status(200).json({
				status: 'success',
				message,
			});
		} catch (error) {
			return next(error);
		}
	}
}

export default PermissionController;
