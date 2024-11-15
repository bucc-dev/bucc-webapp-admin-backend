import mongoose, { Document, mongo } from 'mongoose';
import { CustomJwtPayload } from '.';

interface IUser extends Document {
    _id: mongoose.Types.ObjectId; 
    firstname: string;
    lastname: string;
    fullname?: string;
    password: string;
    role: 'admin' | 'super_admin';
    accessLevel: 1 | 2;
    email: string;
    isVerified: boolean;
    refreshTokens: string[];
    creatorId: string | null;
    createdAt: Date;
    updatedAt: Date;
    courseMaterials: Array<mongoose.Types.ObjectId>;
    announcements: Array<mongoose.Types.ObjectId>;
    notifications: Array<mongoose.Types.ObjectId>;
    pendingRequests: Array<mongoose.Types.ObjectId>;

    isPasswordCorrect(password: string): Promise<boolean>;
    generateRefreshToken(payload: CustomJwtPayload): Promise<string>;
}

export default IUser;
