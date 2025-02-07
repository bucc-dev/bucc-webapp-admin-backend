import { Router } from "express";
import PermissionController from "../controllers/permissionController";
import authMiddleware from "../middleware/authMiddleware";
import { minimalRateLimiter } from "../utils/limiters";

const permissionRouter = Router();

permissionRouter.route('/:targetUserId/get').get(authMiddleware, minimalRateLimiter, PermissionController.getPermission);

permissionRouter.route('/self/check').get(authMiddleware, minimalRateLimiter, PermissionController.checkPermission);

permissionRouter.route('/:targetUserId/grant').patch(authMiddleware, minimalRateLimiter, PermissionController.grantPermission);

permissionRouter.route('/:targetUserId/revoke').patch(authMiddleware, minimalRateLimiter, PermissionController.revokePermission);

export default permissionRouter;