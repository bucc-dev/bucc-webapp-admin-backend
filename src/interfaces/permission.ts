import mongoose, { Document } from 'mongoose';
import IUser, { userRole } from './user';

export type permissionResource = 'announcements' | 'course_materials' | 'users';
export type permissionAction = 'read' | 'update' | 'delete' | 'create' | '*';

export interface IResourcePermissionObject {
	resource: permissionResource;
	actions: {
		own: permissionAction[];
		others: permissionAction[];
	};
}

export interface IPermission extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    role: userRole;
    permissions: IResourcePermissionObject[];
}

// Extend the interface to include static methods
export interface IPermissionModel extends mongoose.Model<IPermission> {
    grantPermission(
        currentUser: IUser,
        targetUser: IUser,
        resource: string,
        action: string,
        scope: 'own' | 'others'
    ): Promise<string | void>;

    revokePermission(
        currentUser: IUser,
        targetUser: IUser,
        resource: string,
        action: string,
        scope: 'own' | 'others'
    ): Promise<string | void>;
}
