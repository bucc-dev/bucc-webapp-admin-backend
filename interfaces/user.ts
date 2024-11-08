import mongoose, { Document } from 'mongoose';

interface IUser extends Document {
    firstname: string;
    lastname: string;
    fullname?: string;
    password: string;
    role: 'admin' | 'super_admin';
    accessLevel: 1 | 2;
    email: string;
    isVerified: boolean;
    refreshToken: string;
    creatorId: string | null;
    createdAt: Date;
    updatedAt: Date;
    courseMaterials: Array<mongoose.Types.ObjectId>;
    announcements: Array<mongoose.Types.ObjectId>;
    notifications: Array<mongoose.Types.ObjectId>;
    pendingRequests: Array<mongoose.Types.ObjectId>;

    isPasswordCorrect(password: string): Promise<boolean>;
}

export default IUser;
