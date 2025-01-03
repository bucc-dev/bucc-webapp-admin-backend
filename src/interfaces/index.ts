import { JwtPayload } from "jsonwebtoken";
import mongoose from 'mongoose';
import IUser from "./user";

export interface CustomJwtPayload extends JwtPayload {
    _id: mongoose.Schema.Types.ObjectId;
}

declare global {
    namespace Express {
        interface Request {
            user: IUser;
        }
    }
}
