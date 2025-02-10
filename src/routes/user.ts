import { Router } from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";
import { minimalRateLimiter, moderateRateLimiter, strictRateLimiter } from "../utils/limiters";
import announcementController from "../controllers/announcementController";

const userRouter = Router();

userRouter.route('/:targetUserId').get(authMiddleware, minimalRateLimiter, userController.getUser);

userRouter.route('/:targetUserId').delete(authMiddleware, minimalRateLimiter, userController.deleteUser);

userRouter.route('/:targetUserId/update/role').patch(authMiddleware, moderateRateLimiter, userController.updateUserRole);

userRouter.route('/self/update/name').patch(authMiddleware, moderateRateLimiter, userController.updateUserName);

userRouter.route('/self/update/password').patch(authMiddleware, moderateRateLimiter, userController.updateUserPassword);

userRouter.route('/forgot-password').post(strictRateLimiter, userController.forgotPassword);

userRouter.route('/reset-password').patch(authMiddleware, moderateRateLimiter, userController.resetPassword);

userRouter.route('/self/update/email-otp').post(authMiddleware, strictRateLimiter, userController.updateEmail);

userRouter.route('/self/update/set-new-email').patch(authMiddleware, moderateRateLimiter, userController.setNewEmail);

userRouter.route('/:targetUserId/announcements').get(authMiddleware, moderateRateLimiter, announcementController.paginatedGet);

userRouter.route('/:targetUserId/announcements/:announcementId').get(authMiddleware, moderateRateLimiter, announcementController.getAnnouncement);

export default userRouter;
