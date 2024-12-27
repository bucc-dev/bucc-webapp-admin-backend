import { Request, Response, NextFunction } from 'express';
import User from '../models/users';
import Permission from '../models/permissions';
import { ErrorHandler } from '../utils/errorHandler';
import { IPermission } from '../interfaces/permission';


class PermissionController {
    static async getPermission(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await User.findById(req.user._id);
            if (!user) 
                throw new ErrorHandler(404, 'User does not exist');

            let permissionDocument = (await Permission.findOne({
                userId: user._id,
            })) as IPermission;
            if (!permissionDocument) {
                permissionDocument = await Permission.create({
                    userId: user._id,
                    role: user.role,
                });
            }

            return res.status(200).json({
                status: 'success',
                data: permissionDocument
            })
        } catch (error) {
            return next(error);
        } 
    }

	static async checkPermission(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await User.findById(req.user._id);
            if (!user) 
                throw new ErrorHandler(404, 'User does not exist');

            const { resource, action } = req.body;
            const scope: 'own' | 'others' = req.body.scope;

            const requiredFields = [
                { field: resource, name: 'resource' },
                { field: action, name: 'action' },
                { field: scope, name: 'scope' }
            ];

            for (const { field, name } of requiredFields) {
                if (!field || field.trim() === '')
                    return next(new ErrorHandler(400, `${name} is missing`));
            }

            let hasPermission: boolean = true;
            let message: string = 'User has permission';
            let statusCode: number = 200;

            if(!(await user.hasPermission(resource, action, scope))) {
                hasPermission = false;
                message = 'User does not have permission';
                statusCode = 403;
            }

            return res.status(statusCode).json({
                status: 'success',
                message,
                hasPermission
            })
        } catch (error) {
            return next(error);
        } 
    }

    static async grantPermission(req: Request, res: Response, next: NextFunction) {
        try {
            const currentUser = await User.findById(req.user._id);
            if (!currentUser) 
                throw new ErrorHandler(404, 'User does not exist');

            const targetUserId = req.params.targetUserId;
            const { resource, action, scope } = req.body;
            
            const requiredFields = [
                { field: targetUserId, name: 'targetUserId' },
                { field: resource, name: 'resource' },
                { field: action, name: 'action' },
                { field: scope, name: 'scope' },
            ];
    
            for (const { field, name } of requiredFields) {
                if (!field || field.trim() === '')
                    return next(new ErrorHandler(400, `${name} is missing`));
            }

            const targetUser = await User.findById(targetUserId);
            if (!targetUser)
                throw new ErrorHandler(404, 'Target user does not exist');

            let message: string = 'Permission granted';

            const messageResponse = await Permission.grantPermission(currentUser, targetUser, resource, action, scope);
            if (messageResponse) {
                message = messageResponse;
            }

            return res.status(200).json({
                status: 'success',
                message
            });
        } catch (error) {
            return next(error);
        } 
    }

    static async revokePermission(req: Request, res: Response, next: NextFunction) {
        try {
            const currentUser = await User.findById(req.user._id);
            if (!currentUser) 
                throw new ErrorHandler(404, 'User does not exist');

            const targetUserId = req.params.targetUserId;
            const { resource, action, scope } = req.body;
            
            const requiredFields = [
                { field: targetUserId, name: 'targetUserId' },
                { field: resource, name: 'resource' },
                { field: action, name: 'action' },
                { field: scope, name: 'scope' },
            ];
    
            for (const { field, name } of requiredFields) {
                if (!field || field.trim() === '')
                    return next(new ErrorHandler(400, `${name} is missing`));
            }

            const targetUser = await User.findById(targetUserId);
            if (!targetUser)
                throw new ErrorHandler(404, 'Target user does not exist');

            let message: string = 'Permission revoked';

            const messageResponse = await Permission.revokePermission(currentUser, targetUser, resource, action, scope);
            if (messageResponse) {
                message = messageResponse;
            }

            return res.status(200).json({
                status: 'success',
                message
            });
        } catch (error) {
            return next(error);
        } 
    }
}

export default PermissionController;
