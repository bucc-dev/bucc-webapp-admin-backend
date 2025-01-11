import mongoose, { Types } from 'mongoose';
import {
	IPermission,
	IResourcePermissionObject,
	IPermissionModel,
} from '../interfaces/permission';
import {
	defaultPermissions,
	allPossibleResourceActions,
	validResourceActions
} from '../config/roleConfig';
import { permissionAction, permissionResource } from '../interfaces/permission';
import { ErrorHandler } from '../utils/errorHandler';
import IUser from '../interfaces/user';

const PermissionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			unique: true,
			ref: 'User',
		},
		role: {
			type: String,
			enum: ['admin', 'super_admin', 'student'],
			required: true,
		},
		permissions: {
			type: [
				{
					resource: { type: String, required: true },
					actions: {
						own: {
							type: [String],
							enum: ['read', 'update', 'delete', 'create'],
							default: ['read'],
							required: true,
						},
						others: {
							type: [String],
							enum: ['read', 'update', 'delete', 'create'],
							default: ['read'],
							required: true,
						},
					},
					_id: false
				}
			],
			required: true,
		},
	},
	{ timestamps: true }
);

PermissionSchema.pre('save', async function (next) {
	if (this.isNew) {
		this.permissions = new Types.DocumentArray(
			defaultPermissions[this.role]
		);
	}
	next();
});

function validateInput(
	currentUser: IUser,
	resource: permissionResource,
	action: permissionAction,
	scope: 'own' | 'others' = 'own',
	operation: 'grant' | 'revoke'
) {
	if (!['grant', 'revoke'].includes(operation)) {
		console.error(`You cannot ${operation} a permission`);
	}

	if (currentUser.role !== 'super_admin') {
		throw new ErrorHandler(
			403,
			`You do not have permission to ${operation} the permission.`
		);
	}

	const resourceObject: IResourcePermissionObject | undefined = validResourceActions.find((object) => object.resource === resource);
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
		throw new ErrorHandler(400, `Cannot [action: ${action}] [resource: ${resource}] on [scope: ${scope}]`);
	}
}

/**
 * Grants a specified permission to a user for a given resource, considering "own" and "others" distinctions.
 *
 * @param currentUser - The Document of the user granting the permission.
 * @param targetUser - The Document of the user to grant permissions to.
 * @param resource - The resource for which the permission is being granted.
 * @param action - The action or '*' to grant all actions for the resource.
 * @param scope - The scope of the permission, either "own", "others".
 * @returns {Promise<void>} Resolves when the permission is granted successfully.
 */
PermissionSchema.statics.grantPermission = async function (
	currentUser: IUser,
	targetUser: IUser,
	resource: permissionResource,
	action: permissionAction,
	scope: 'own' | 'others' = 'own'
): Promise<string | void> {
	const operation = 'grant';
	validateInput(currentUser, resource, action, scope, operation);

	let permissionDocument = (await this.findOne({
		userId: targetUser._id,
	})) as IPermission;
	if (!permissionDocument) {
		permissionDocument = await this.create({
			userId: targetUser._id,
			role: targetUser.role,
		});
	}

	// Locate the user's permissions for the specified resource 
	let resourcePermission: IResourcePermissionObject | undefined =
		permissionDocument.permissions.find(
			(permission) => permission.resource === resource
		);

	// locate the permissions under the validResourceActions static object
	const resourceObject: IResourcePermissionObject = validResourceActions.find((object) => object.resource === resource) as IResourcePermissionObject; 

	// if there was no permissions for that resource
	if (!resourcePermission) {
		resourcePermission = {
			resource,
			actions: { own: [], others: [] },
		};
		resourcePermission.actions[scope] = [action];
		permissionDocument.permissions.push(resourcePermission);
	}

	// if there was existing permissions for that resource
	if (action === '*') {
		if (
			resourcePermission.actions[scope].length ===
			resourceObject.actions[scope].length
		) {
			return `${targetUser.lastname} ${targetUser.firstname} already has all permissions for ${resource}`;
		}
		resourcePermission.actions[scope] = resourceObject.actions[scope];
	} else {
		if (resourcePermission.actions[scope].includes(action)) {
			return `${targetUser.lastname} ${targetUser.firstname} already has this permission`;
		}
		resourcePermission.actions[scope].push(action);
	}

	await permissionDocument.save();
};

/**
 * Revokes a specified permission to a user for a given resource, considering "own" and "others" distinctions.
 *
 * @param currentUser = The Document of the user revoking the permission.
 * @param targetUser - The Document of the user to revoke permissions to.
 * @param resource - The resource for which the permission is being revoked.
 * @param action - The action or '*' to revoke all actions for the resource.
 * @param scope - The scope of the permission, either "own", "others".
 * @returns {Promise<void>} Resolves when the permission is revoked successfully.
 */
PermissionSchema.statics.revokePermission = async function (
	currentUser: IUser,
	targetUser: IUser,
	resource: permissionResource,
	action: permissionAction,
	scope: 'own' | 'others' = 'own'
): Promise<string | void> {
	const operation = 'grant';
	validateInput(currentUser, resource, action, scope, operation);

	let permissionDocument = (await this.findOne({
		userId: targetUser._id,
	})) as IPermission;
	if (!permissionDocument) {
		permissionDocument = await this.create({
			userId: targetUser._id,
			role: targetUser.role,
		});
	}

	// Locate the permissions for the specified resource
	let resourcePermission: IResourcePermissionObject | undefined =
		permissionDocument.permissions.find(
			(permission) => permission.resource === resource
		);

	// if there was no permissions for that resource
	if (!resourcePermission) {
		return `${targetUser.lastname} ${targetUser.firstname} never had this permission`;
	}

	// if there was existing permissions for that resource
	if (action === '*') {
		resourcePermission.actions[scope] = [];
	} else {
		if (!resourcePermission.actions[scope].includes(action)) {
			return `${targetUser.lastname} ${targetUser.firstname} never had this permission`;
		}
		resourcePermission.actions[scope] = resourcePermission.actions[
			scope
		].filter((act) => act !== action);
	}

	await permissionDocument.save();
};

const Permission = mongoose.model<IPermission, IPermissionModel>(
	'Permission',
	PermissionSchema
);

export default Permission;
