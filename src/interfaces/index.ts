import { JwtPayload } from "jsonwebtoken";
import mongoose from 'mongoose';
import IUser from "./user";

export interface CustomJwtPayload extends JwtPayload {
    _id: mongoose.Schema.Types.ObjectId;
    reset?: boolean;
}

declare global {
    namespace Express {
        interface Request {
            user: IUser;
        }
    }
}


export interface IMulterS3File extends Express.Multer.File {
    key: string;
    location: string;
    bucket: string;
}