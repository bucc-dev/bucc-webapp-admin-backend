import { Router } from "express";
import PermissionController from "../controllers/permissionController";
import authMiddleware from "../middleware/authMiddleware";
import { generalLimiter } from "../utils/limiters";

const permissionRouter = Router();

permissionRouter.route('/me/permissions/check').get(authMiddleware, generalLimiter, PermissionController.checkPermission);
permissionRouter.route('/:targetUserId/permissions/grant').patch(authMiddleware, generalLimiter, PermissionController.grantPermission);
permissionRouter.route('/:targetUserId/permissions/revoke').patch(authMiddleware, generalLimiter, PermissionController.revokePermission);

export default permissionRouter;