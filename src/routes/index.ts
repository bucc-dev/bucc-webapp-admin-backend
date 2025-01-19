import { Response, Request, NextFunction, Router } from "express";
import { handleError, CustomError } from "../utils/errorHandler";
import userRouter from "./user";
import authRouter from "./auth";
import permissionRouter from "./permission";
import cache from "../utils/cache";
import courseMaterialRouter from "./courseMaterial";
import announcementRouter from "./announcement";


const router: Router = Router();

router.use('/api/v1/users', userRouter);
router.use('/api/v1/users', permissionRouter);
router.use('/api/v1/auth', authRouter);
router.use('/api/v1/announcements', announcementRouter);
router.use('/api/v1/course-materials', courseMaterialRouter);

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
    cache.connected
    return res.status(200).end();
});

export default router;