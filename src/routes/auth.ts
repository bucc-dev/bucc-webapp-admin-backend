import { Router } from "express";
import authController from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";
import { moderateRateLimiter, minimalRateLimiter, strictRateLimiter } from "../utils/limiters";

const authRouter = Router();

authRouter.route('/register').post(moderateRateLimiter, authController.register);

authRouter.route('/login').post(moderateRateLimiter, authController.login);

authRouter.route('/logout').post(moderateRateLimiter, authMiddleware, authController.logout);

authRouter.route('/verify-account').post(moderateRateLimiter, authController.verifyAccountToLogin);

authRouter.route('/resend-account-verification-otp').post(strictRateLimiter, authController.resendOtp);

authRouter.route('/refresh').post(strictRateLimiter, authController.refreshAccessToken);

export default authRouter;