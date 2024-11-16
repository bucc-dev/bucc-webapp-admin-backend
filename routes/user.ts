import { Router } from "express";
import UserController from "../controllers/UserController";
import authMiddleware from "../middleware/authMiddleware";
import { authLimiter, generalLimiter } from "../utils/limiters";

const userRouter = Router();

userRouter.route('/register').post(UserController.register);
userRouter.route('/login').post(authLimiter, UserController.login);
userRouter.route('/logout').post(authMiddleware, generalLimiter, UserController.logout);
userRouter.route('/logout-all-devices').post(authMiddleware, generalLimiter, UserController.logoutAllDevices);

export default userRouter;