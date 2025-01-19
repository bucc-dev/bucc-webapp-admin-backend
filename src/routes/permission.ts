import { Router } from "express";
import PermissionController from "../controllers/permissionController";
import authMiddleware from "../middleware/authMiddleware";
import { minimalRateLimiter } from "../utils/limiters";

const permissionRouter = Router();

permissionRouter.route('/self/permissions/get').get(authMiddleware, minimalRateLimiter, PermissionController.getPermission);

permissionRouter.route('/self/permissions/check').get(authMiddleware, minimalRateLimiter, PermissionController.checkPermission);

permissionRouter.route('/:targetUserId/permissions/grant').patch(authMiddleware, minimalRateLimiter, PermissionController.grantPermission);

permissionRouter.route('/:targetUserId/permissions/revoke').patch(authMiddleware, minimalRateLimiter, PermissionController.revokePermission);

export default permissionRouter;