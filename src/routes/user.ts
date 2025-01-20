import { Router } from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";
import { minimalRateLimiter, moderateRateLimiter, strictRateLimiter } from "../utils/limiters";

const userRouter = Router();

userRouter.route(['/self/get', '/:targetUserId/get']).get(authMiddleware, minimalRateLimiter, userController.getUser);

userRouter.route(['/self/delete', '/:targetUserId/delete']).delete(authMiddleware, minimalRateLimiter, userController.deleteUser);

userRouter.route('/:targetUserId/update/role').patch(authMiddleware, moderateRateLimiter, userController.updateUserRole);

userRouter.route('/self/update/name').patch(authMiddleware, moderateRateLimiter, userController.updateUserName);

userRouter.route('/self/update/password').patch(authMiddleware, moderateRateLimiter, userController.updateUserPassword);

userRouter.route(['/self/forgot-password', '/self/forgot-password/resend-verification-link']).post(strictRateLimiter, userController.forgotPassword);

userRouter.route('/self/reset-password').patch(authMiddleware, moderateRateLimiter, userController.resetPassword);

userRouter.route(['/self/update/email', '/self/update/email/resend-otp']).post(authMiddleware, strictRateLimiter, userController.updateEmail);

userRouter.route('/self/update/set-new-email').patch(moderateRateLimiter, userController.setNewEmail);

// userRouter.route(['/self/announcements/paginated-get', '/:targetUserId/announcements/paginated-get']).get(authMiddleware, moderateRateLimiter);

export default userRouter;
