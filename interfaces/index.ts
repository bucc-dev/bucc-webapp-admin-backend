import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export interface CustomJwtPayload extends JwtPayload {
    _id: mongoose.Types.ObjectId;
    email: string;
    accessLevel: number;
}

declare global {
    namespace Express {
        interface Request {
            user: CustomJwtPayload;
        }
    }
}
