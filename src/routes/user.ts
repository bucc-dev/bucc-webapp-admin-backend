import { Router } from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";
import { minimalRateLimiter, moderateRateLimiter, strictRateLimiter } from "../utils/limiters";
import announcementController from "../controllers/announcementController";

const userRouter = Router();

userRouter.route('/:targetUserId').get(minimalRateLimiter, authMiddleware, userController.getUser);

userRouter.route('/:targetUserId').delete(minimalRateLimiter, authMiddleware, userController.deleteUser);

userRouter.route('/:targetUserId/update/role').patch(moderateRateLimiter, authMiddleware, userController.updateUserRole);

userRouter.route('/self/update/name').patch(moderateRateLimiter, authMiddleware, userController.updateUserName);

userRouter.route('/self/update/password').patch(moderateRateLimiter, authMiddleware, userController.updateUserPassword);

userRouter.route('/forgot-password').post(strictRateLimiter, userController.forgotPassword);

userRouter.route('/reset-password').patch(moderateRateLimiter, authMiddleware, userController.resetPassword);

userRouter.route('/self/update/email-otp').post(strictRateLimiter, authMiddleware, userController.updateEmail);

userRouter.route('/self/update/set-new-email').patch(moderateRateLimiter, authMiddleware, userController.setNewEmail);

userRouter.route('/:targetUserId/announcements').get(moderateRateLimiter, authMiddleware, announcementController.paginatedGet);

userRouter.route('/:targetUserId/announcements/:announcementId').get(moderateRateLimiter, authMiddleware, announcementController.getAnnouncement);

export default userRouter;
