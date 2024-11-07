import { Response, Request, NextFunction, Router } from "express";
import userRouter from "./user";


const router: Router = Router();

router.use('/api/v1/users', userRouter);

router.all('*', (req: Request, res: Response) => {
    res.status(404).json({
        status: 'fail',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

export default router;