import { Router } from "express";
import PermissionController from "../controllers/permissionController";
import authMiddleware from "../middleware/authMiddleware";
import { minimalRateLimiter } from "../utils/limiters";

const permissionRouter = Router();

permissionRouter.route('/:targetUserId/permissions/get').get(minimalRateLimiter, authMiddleware, PermissionController.getPermission);

permissionRouter.route('/self/permission/check').get(minimalRateLimiter, authMiddleware, PermissionController.checkPermission);

permissionRouter.route('/:targetUserId/permission/grant').patch(minimalRateLimiter, authMiddleware, PermissionController.grantPermission);

permissionRouter.route('/:targetUserId/permission/revoke').patch(minimalRateLimiter, authMiddleware, PermissionController.revokePermission);

export default permissionRouter;