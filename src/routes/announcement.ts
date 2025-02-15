import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { minimalRateLimiter, moderateRateLimiter, strictRateLimiter } from "../utils/limiters";
import announcementController from "../controllers/announcementController";
import { upload } from "../middleware/upload";

const announcementRouter = Router();

announcementRouter.route('/:announcementId').get(minimalRateLimiter, authMiddleware, announcementController.getAnnouncement);

announcementRouter.route('/').post(moderateRateLimiter, authMiddleware, upload.array('files', 3), announcementController.postAnnouncement);

announcementRouter.route('/:announcementId/update-caption').patch(moderateRateLimiter, authMiddleware, announcementController.updateAnnouncementCaption);

announcementRouter.route('/:announcementId').delete(minimalRateLimiter, authMiddleware, announcementController.deleteAnnouncement);

announcementRouter.route('/').get(minimalRateLimiter, authMiddleware, announcementController.paginatedGet);

export default announcementRouter;
