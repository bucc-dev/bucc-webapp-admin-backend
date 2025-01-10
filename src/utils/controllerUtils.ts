import mongoose from 'mongoose';
import { permissionAction, permissionResource } from '../interfaces/permission';
import IUser from '../interfaces/user';
import { ErrorHandler } from './errorHandler';

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
	scope: 'own' | 'others',
	targetUserId?: string | mongoose.Schema.Types.ObjectId
) {
	if (user.role === 'student' && action !== 'view') {
	}
	// if theres no target user then the scope is the current authenticated user i.e "self".
	if (!targetUserId) scope = 'own';

	try {
		if (
			(
                user.role === 'student' && action !== 'view') ||
			    !(await user.hasPermission(resource, action, scope)
            )
		) {
			throw new ErrorHandler(403, 'User does not have permission');
		}
	} catch (error) {
		return error;
	}
}
