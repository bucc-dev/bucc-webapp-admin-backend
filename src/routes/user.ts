import { Router } from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";
import { minimalRateLimiter, moderateRateLimiter } from "../utils/limiters";

const userRouter = Router();

userRouter.route('/profile').post();
userRouter.route('/:targetUserId/profile').post();

export default userRouter;