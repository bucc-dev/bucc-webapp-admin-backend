import mongoose, { Document } from 'mongoose';
import { CustomJwtPayload } from '.';
import { permissionAction, permissionResource } from './permission';

interface IUser extends Document {
    _id: mongoose.Schema.Types.ObjectId; 
    firstname: string;
    lastname: string;
    password: string;
    role: 'admin' | 'super_admin';
    email: string;
    isVerified: boolean;
    refreshTokens: string[];
    creatorId: mongoose.Schema.Types.ObjectId | null;
    courseMaterials: [mongoose.Schema.Types.ObjectId];
    announcements: [mongoose.Schema.Types.ObjectId];
    notifications: [mongoose.Schema.Types.ObjectId];
    pendingRequests: [mongoose.Schema.Types.ObjectId];

    isPasswordCorrect(password: string): Promise<boolean>;
    generateRefreshToken(payload: CustomJwtPayload, oldRefreshToken?: string): Promise<string>;
    hasPermission(
        resource: permissionResource,
        action: permissionAction,
        scope: 'own' | 'others'
    ): Promise<boolean>;
}

export default IUser;
