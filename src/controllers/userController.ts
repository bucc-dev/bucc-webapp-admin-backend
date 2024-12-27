import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/users';
import { ErrorHandler } from '../utils/errorHandler';
import { config } from 'dotenv';
import { CustomJwtPayload } from '../interfaces';
import { sendVerificationMail } from '../utils/emails';
import cache from '../utils/cache';

config();

class UserController {
	
}

export default UserController;
