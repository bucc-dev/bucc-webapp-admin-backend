import mongoose, { Document } from 'mongoose';

// Define the interface for the user document
interface IUser extends Document {
    firstname: string; // First name of the user
    lastname: string;  // Last name of the user
    fullname?: string; // Full name of the user (optional)
    password: string;  // Hashed password of the user
    role: 'admin' | 'super_admin'; // Role of the user
    accessLevel: 1 | 2; // Access level: 1 for admin/senator, 2 for super admin/SP
    email: string; // Email address of the user
    isVerified: boolean; // Verification status of the user
    refreshToken: string; // Refresh token for the user
    creatorId: string | null; // Reference to the creator user, if applicable
    createdAt: Date; // Date when the user was created
    updatedAt: Date; // Date when the user was last updated
    courseMaterials: Array<mongoose.Types.ObjectId>; // Array of course material IDs
    announcements: Array<mongoose.Types.ObjectId>; // Array of announcement IDs
    notifications: Array<mongoose.Types.ObjectId>; // Array of notification IDs
    pendingRequests: Array<mongoose.Types.ObjectId>; // Array of pending request IDs

    isPasswordCorrect(password: string): Promise<boolean>;
}

export default IUser;
