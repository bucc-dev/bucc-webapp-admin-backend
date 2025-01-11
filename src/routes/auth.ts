import { Router } from "express";
import authController from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";
import { moderateRateLimiter, minimalRateLimiter, strictRateLimiter } from "../utils/limiters";

const authRouter = Router();

authRouter.route('/register').post(moderateRateLimiter, authController.register);

authRouter.route('/login').post(moderateRateLimiter, authController.login);

authRouter.route('/logout').post(authMiddleware, minimalRateLimiter, authController.logout);

authRouter.route('/verify-account').post(authMiddleware, moderateRateLimiter, authController.verifyAccountToLogin);

authRouter.route('/resend-account-verification-otp').post(strictRateLimiter, authController.resendOtp);

authRouter.route('/refresh').post(minimalRateLimiter, authController.refreshAccessToken);

export default authRouter;