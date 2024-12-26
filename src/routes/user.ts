import { Router } from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";
import { authLimiter, generalLimiter } from "../utils/limiters";

const userRouter = Router();

userRouter.route('/register').post(userController.register);
userRouter.route('/login').post(authLimiter, userController.login);
userRouter.route('/logout').post(authMiddleware, generalLimiter, userController.logout);
userRouter.route('/logout-all-devices').post(authMiddleware, generalLimiter, userController.logoutAllDevices);
userRouter.route('/verify-otp').post(generalLimiter, userController.verifyOtp);
userRouter.route('/resend-otp').post(generalLimiter, userController.resendOtp);

export default userRouter;