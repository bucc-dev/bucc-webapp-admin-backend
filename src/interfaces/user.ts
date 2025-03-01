import mongoose, { Document } from 'mongoose';
import { CustomJwtPayload } from '.';
import { permissionAction, permissionResource } from './permission';

export type userRole = 'admin' | 'super_admin' | 'student'

interface IUser extends Document {
    _id: mongoose.Schema.Types.ObjectId; 
    firstname: string;
    lastname: string;
    password: string;
    role: userRole;
    email: string;
    isVerified: boolean;
    refreshTokens: string[];

    isPasswordCorrect(password: string): Promise<boolean>;
    generateRefreshToken(payload: CustomJwtPayload, oldRefreshToken?: string): Promise<string>;
    hasPermission(
        resource: permissionResource,
        action: permissionAction,
        scope: 'own' | 'others'
    ): Promise<boolean>;
}

export default IUser;
