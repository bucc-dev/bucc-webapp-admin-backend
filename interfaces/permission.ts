import mongoose, { Document } from 'mongoose';
import IUser from './user';

export type permissionResource = 'announcements' | 'course_materials' | 'notifications' | 'users';
export type permissionAction = 'view' | 'update' | 'delete' | 'create' | '*';
export type role = 'admin' | 'super_admin'

export interface IPermission extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    role: role;
    permissions: [{
        resource: permissionResource,
        actions: {
            own: permissionAction[],
            others: permissionAction[]
        }
    }];
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

export interface IResourcePermission {
	resource: permissionResource;
	actions: {
		own: permissionAction[];
		others: permissionAction[];
	};
}