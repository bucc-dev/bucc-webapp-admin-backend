import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";



export interface CustomJwtPayload extends JwtPayload {
    _id: string;
}

declare global {
    namespace Express {
        interface Request {
            user: CustomJwtPayload;
        }
    }
}
