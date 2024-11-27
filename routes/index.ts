import { Response, Request, NextFunction, Router } from "express";
import { handleError, CustomError } from "../middleware/errorHandler";
import userRouter from "./user";
import permissionRouter from "./permission";


const router: Router = Router();

router.use('/api/v1/users', userRouter);
router.use('/api/v1/users', permissionRouter);

router.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
    handleError(err, res);
});

router.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        status: 'fail',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

router.use('/api/v1/ping', (req, res) => {
    return res.status(200).end();
});

export default router;