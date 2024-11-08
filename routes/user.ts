import { Router } from "express";
import UserController from "../controllers/UserController";
import authMiddleware from "../middleware/authMiddleware";
import { authLimiter, generalLimiter } from "../utils/limiters";

const userRouter = Router();

userRouter.route('/login').post(authLimiter, UserController.login);
userRouter.route('/logout').post(authMiddleware, UserController.logout);

export default userRouter;