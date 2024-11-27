import { JwtPayload } from "jsonwebtoken";
import mongoose from 'mongoose';

export interface CustomJwtPayload extends JwtPayload {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
    isVerified: boolean
}

declare global {
    namespace Express {
        interface Request {
            user: CustomJwtPayload;
        }
    }
}
