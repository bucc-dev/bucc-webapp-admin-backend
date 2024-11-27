import mongoose, { Document } from 'mongoose';

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

export interface IResourcePermission {
	resource: permissionResource;
	actions: {
		own: permissionAction[];
		others: permissionAction[];
	};
}