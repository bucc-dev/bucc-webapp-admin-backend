import { Response, Request, NextFunction, Router } from "express";
import { handleError, CustomError } from "../middleware/errorHandler";
import userRouter from "./user";


const router: Router = Router();

router.use('/api/v1/users', userRouter);

router.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
    handleError(err, res);
});

router.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        status: 'fail',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

export default router;