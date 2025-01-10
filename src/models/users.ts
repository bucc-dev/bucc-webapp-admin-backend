import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { CustomJwtPayload } from '../interfaces';
import IUser from '../interfaces/user';
import Permission from './permissions';
import {
	IPermission,
	IResourcePermissionObject,
	permissionAction,
	permissionResource,
} from '../interfaces/permission';
import {
	allPossibleResourceActions,
	defaultPermissions,
	validResourceActions,
} from '../config/roleConfig';
import { ErrorHandler } from '../utils/errorHandler';
import { Console } from 'console';

config();

const UserSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			required: true,
			minlength: [1, 'Input a valid firstname'],
			maxlength: [25, 'Firstname is too long'],
		},
		lastname: {
			type: String,
			required: true,
			minlength: [1, 'Input a valid lastname'],
			maxlength: [25, 'Lastname is too long'],
		},
		password: {
			type: String,
			required: true,
			minlength: [6, 'Password must be at least 6 characters long'],
			match: [
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?`~\\|])[A-Za-z\d!@#$%^&*()\-_=+[\]{};:'",.<>/?`~\\|]{6,}$/,
				'Password must be at least 6 characters long, with an uppercase letter, lowercase letter, number, and special character.',
			],
		},
		role: {
			type: String,
			enum: ['admin', 'super_admin', 'student'],
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: [
				/^[a-zA-Z0-9._%+-]+@(student|staff)\.babcock\.edu\.ng$/,
				'Please input a valid school email address',
			],
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		refreshTokens: {
			type: [String],
			default: [],
		}
	},
	{ timestamps: true }
);

UserSchema.pre('save', async function (next) {
	if (this.isModified('password') || this.isNew) {
		this.password = await bcrypt.hash(this.password, 10);
	}

	next();
});

UserSchema.post('save', async function (doc, next) {
	const permission_doc = await Permission.findOne({ userId: doc._id });
	if (!permission_doc) {
		await Permission.create({
			userId: doc._id,
			role: doc.role,
		});
	}
	next();
});

// methods
/**
 * Checks if the provided password matches the stored password.
 *
 * @param {string} password - The password to check.
 * @returns {Promise<boolean>} - Returns true if the password is correct, otherwise false.
 */
UserSchema.methods.isPasswordCorrect = async function (
	password: string
): Promise<boolean> {
	return await bcrypt.compare(password, this.password);
};

/**
 * Generates a new refresh token for the user and saves changes..
 *
 * @param {CustomJwtPayload} payload - The payload to include in the refresh token.
 * @returns {Promise<string>} - Returns the generated refresh token.
 */
UserSchema.methods.generateRefreshToken = async function (
	payload: CustomJwtPayload,
	oldRefreshToken?: string
): Promise<string> {
	const newRefreshToken: string = jwt.sign(
		payload,
		process.env.JWT_SECRET as string,
		{ expiresIn: '7d' }
	);

	this.refreshTokens.push(newRefreshToken);
	this.refreshTokens = this.refreshTokens.filter((token: string) => token !== oldRefreshToken);
	await this.save();

	return newRefreshToken;
};

/**
 * Checks if the user has the specified permission for a given resource and action,
 * considering ownership (own vs. others).
 *
 * @param resource - The resource for which the permission is being checked.
 * @param action - The action (e.g., 'view', 'update', 'delete', 'create') for the resource.
 * @param resourceOwnerId - The ID of the resource's owner.
 * @returns A boolean indicating whether the user has the specified permission.
 */
UserSchema.methods.hasPermission = async function (
	resource: permissionResource,
	action: permissionAction,
	scope: 'own' | 'others'
): Promise<boolean> {
	const resourceObject: IResourcePermissionObject | undefined =
		validResourceActions.find((object) => object.resource === resource);
	if (!resourceObject) {
		throw new ErrorHandler(400, `Invalid resource: ${resource}`);
	}

	if (!allPossibleResourceActions.includes(action)) {
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

	// Fetch the user's permission document
	let permissionDocument = (await Permission.findOne({
		userId: this._id,
	})) as IPermission;

	if (!permissionDocument) {
		permissionDocument = await Permission.create({
			userId: this._id,
			role: this.role,
		});
	}

	// Locate the permission object for the specified resource
	const resourcePermission = permissionDocument.permissions.find(
		(permission) => permission.resource === resource
	);

	if (!resourcePermission) {
		return false; // No permissions for this resource
	}

	return resourcePermission.actions[scope].includes(action);
};


/**
 * Changes the role of a user.
 *
 * @param currentUser - The Document of the user changing the role.
 * @param targetUser - The Document of the user whose role is being changed.
 * @param newRole - The new role to assign to the user, either 'admin' or 'super_admin'.
 * @returns {Promise<void>} Resolves when the role is changed successfully.
 */
UserSchema.statics.changeUserRole = async function (
	currentUser: IUser,
	targetUser: IUser,
	newRole: 'admin' | 'super_admin'
): Promise<void | string> {
	if (currentUser.role !== 'super_admin') {
		throw new ErrorHandler(
			403,
			`You do not have permission to change the role.`
		);
	}

	if (!['admin', 'super_admin', 'student'].includes(newRole)) {
		throw new ErrorHandler(400, `Invalid role: ${newRole}`);
	}

	if (targetUser.role === newRole) {
		return `User is alread a/an ${newRole}`;
	}
	targetUser.role = newRole;
	await targetUser.save();

	// Update permissions based on the new role
	let permissionDocument = (await this.findOne({
		userId: targetUser._id,
	})) as IPermission;
	if (!permissionDocument) {
		console.error(`${targetUser._id}: ${targetUser._id} does not have a permission document.`);
		throw new ErrorHandler(500, 'Internal server error');
	}
	permissionDocument.role = newRole;
	permissionDocument.permissions = defaultPermissions[newRole];
	await permissionDocument.save();
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
