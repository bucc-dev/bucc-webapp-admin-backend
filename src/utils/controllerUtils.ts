import mongoose from 'mongoose';
import {
	IResourcePermissionObject,
	permissionAction,
	permissionResource,
} from '../interfaces/permission';
import IUser from '../interfaces/user';
import { ErrorHandler } from './errorHandler';
import {
	allPossibleResourceActions,
	validResourceActions,
} from '../config/roleConfig';

/**
 * checks if the user has the specified permission and does nothing it he/she has it.
 * It is used for controller functions
 *
 * @param {IUser} user - The user object.
 * @param {string} resource - The resource to check permissions for.
 * @param {string} action - The action to check permissions for.
 * @param {'own' | 'others'} scope - The scope of the action (own or others).
 * @param {string | mongoose.Schema.Types.ObjectId} [targetUserId] - The target user ID (optional).
 *
 * @throws {ErrorHandler} If the user does not have the required permission.
 */
export async function checkUserPermission(
	user: IUser,
	resource: permissionResource,
	action: permissionAction,
	targetUserId?: string | mongoose.Schema.Types.ObjectId
) {
	let scope: 'own' | 'others' = 'own';
	if (targetUserId && user._id !== targetUserId) scope = 'others';

	const resourceObject: IResourcePermissionObject | undefined =
		validResourceActions.find((object) => object.resource === resource);
	if (!resourceObject) {
		throw new ErrorHandler(400, `Invalid resource: ${resource}`);
	}

	if (!allPossibleResourceActions.includes(action) && action !== '*') {
		throw new ErrorHandler(400, `Invalid action: ${action}`);
	}

	if (!['own', 'others'].includes(scope)) {
		throw new ErrorHandler(400, `Invalid scope: ${scope}`);
	}

	if (!resourceObject.actions[scope].includes(action)) {
		throw new ErrorHandler(
			400,
			`Cannot [action: ${action}] [resource: ${resource}] on [scope: ${scope}]`
		);
	}

	try {
		if (
			(user.role === 'student' && action !== 'read') ||
			!(await user.hasPermission(resource, action, scope))
		) {
			throw new ErrorHandler(403, 'User does not have permission');
		}
	} catch (error) {
		return error;
	}
}
