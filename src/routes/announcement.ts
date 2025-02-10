import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { minimalRateLimiter, moderateRateLimiter, strictRateLimiter } from "../utils/limiters";
import announcementController from "../controllers/announcementController";
import { upload } from "../middleware/upload";

const announcementRouter = Router();

announcementRouter.route('/:announcementId').get(authMiddleware, moderateRateLimiter, announcementController.getAnnouncement);

announcementRouter.route('/').post(authMiddleware, moderateRateLimiter, upload.array('file', 3), announcementController.postAnnouncement);

announcementRouter.route('/:announcementId/update-caption').patch(authMiddleware, moderateRateLimiter, announcementController.updateAnnouncementCaption);

announcementRouter.route('/:announcementId').delete(authMiddleware, moderateRateLimiter, announcementController.deleteAnnouncement);

announcementRouter.route('/').get(authMiddleware, moderateRateLimiter, announcementController.paginatedGet);

export default announcementRouter;
