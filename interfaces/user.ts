import mongoose, { Document } from 'mongoose';
import { CustomJwtPayload } from '.';
import { permissionAction, permissionResource } from './permission';

interface IUser extends Document {
    _id: mongoose.Schema.Types.ObjectId; 
    firstname: string;
    lastname: string;
    fullname?: string;
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
    generateRefreshToken(payload: CustomJwtPayload): Promise<string>;
    hasPermission(
        resource: permissionResource,
        action: permissionAction,
        resourceOwnerId: mongoose.Types.ObjectId
    ): Promise<boolean>;
}

export default IUser;
