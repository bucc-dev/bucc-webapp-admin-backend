import { Router } from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";
import { minimalRateLimiter, moderateRateLimiter } from "../utils/limiters";
import authController from "../controllers/authController";

const userRouter = Router();

userRouter.route(['/self/profile', '/:targetUserId/profile']).get();
userRouter.route(['/self/profile', '/:targetUserId/profile']).delete();
userRouter.route(['/self/profile/update/role', '/:targetUserId/profile/update/role']).patch();
userRouter.route('/self/profile/update/name').patch();
userRouter.route('/self/profile/update/password').patch();
userRouter.route('/self/profile/update/email').post();
userRouter.route('/self/profile/update/set-new-email').patch();
userRouter.route('/self/profile/update/email/resendOtp').post(authMiddleware, authController.resendOtp);
userRouter.route('/self/profile/forgot-password').post();
userRouter.route('/self/profile/set-new-password').patch();

export default userRouter;