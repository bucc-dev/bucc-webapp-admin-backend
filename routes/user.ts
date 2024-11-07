import { Router } from "express";
import UserController from "../controllers/UserController";
import authMiddleware from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.route('/login').post(UserController.login);
userRouter.route('/logout').post(authMiddleware, UserController.logout);

export default userRouter;