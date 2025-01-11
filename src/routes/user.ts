import { Router } from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";
import { minimalRateLimiter, moderateRateLimiter, strictRateLimiter } from "../utils/limiters";
import authController from "../controllers/authController";

const userRouter = Router();

userRouter.route(['/self/profile', '/:targetUserId/profile']).get(authMiddleware, minimalRateLimiter, userController.getUser);

userRouter.route(['/self/profile/delete', '/:targetUserId/profile/delete']).delete(authMiddleware, minimalRateLimiter, userController.deleteUser);

userRouter.route('/:targetUserId/profile/update/role').patch(authMiddleware, moderateRateLimiter, userController.updateUserRole);

userRouter.route('/self/profile/update/name').patch(authMiddleware, moderateRateLimiter, userController.updateUserName);

userRouter.route('/self/profile/update/password').patch(authMiddleware, moderateRateLimiter, userController.updateUserPassword);

userRouter.route(['/self/profile/forgot-password', '/self/profile/forgot-password/resend-verification-link']).post(strictRateLimiter, userController.forgotPassword);

userRouter.route('/self/profile/reset-password').patch(authMiddleware, moderateRateLimiter, userController.resetPassword);

userRouter.route(['/self/profile/update/email', '/self/profile/update/email/resend-otp']).post(authMiddleware, strictRateLimiter, userController.updateEmail);

userRouter.route('/self/profile/update/set-new-email').patch(moderateRateLimiter, userController.setNewEmail);

export default userRouter;
