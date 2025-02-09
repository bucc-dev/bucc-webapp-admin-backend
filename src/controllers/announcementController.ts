import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../utils/errorHandler';
import Announcement from '../models/announcements';
import { checkUserPermission } from '../utils/checkPermission';
import IUser from '../interfaces/user';
import { IAnnouncement, IAnnouncementMedia } from '../interfaces/announcement';
import { getSignedUrlForFile, r2Client } from '../config/r2Config';
import { IMulterS3File } from '../interfaces';

  
class announcementController {
    static async postAnnouncement(
		req: Request,
		res: Response,
		next: NextFunction
	) {
        if (!req.files || req.files.length === 0) {
            return next(new ErrorHandler(400, 'At least one file is required'))
        }

        try {
            await checkUserPermission(req.user, 'announcements', 'create');
            
            const media = (req.files as IMulterS3File[]).map((file) => ({
                bucketName: file.bucket,
                mimeType: file.mimetype,
                name: file.originalname,
                size: file.size.toString(),
                key: file.key,
            }));
        
            const { caption } = req.body;
        
            const announcement = (await Announcement.create({
                caption,
                owner: req.user._id,
                media: media,
            })).toObject();

            if (!announcement) {
                return next(new ErrorHandler(500, 'upload error, retry again later'));
            }
        
            announcement.media = await Promise.all(
                announcement.media.map(async (media: IAnnouncementMedia) => ({
                    ...media,
                    signedUrl: await getSignedUrlForFile(media.bucketName, media.key),
                }))
            );            

            return res.status(201).json({
                status: 'success',
                message: "Announcement uploaded successfully",
                data: announcement
            });          
        } catch (error) {
            console.error(error);
            return next(error);
        }
    }

	static async getAnnouncement(
		req: Request,
		res: Response,
		next: NextFunction
	) {
        const { announcementId } = req.params;
        if (!announcementId) {
            return next(new ErrorHandler(400, 'announcementId is missing'));
        }

        try {
            await checkUserPermission(req.user, 'announcements', 'read')

            const announcement = await Announcement.findById(announcementId).populate({ path: 'owner', select: 'role firstname _id lastname' }).lean();

            if (!announcement) {
                return next(new ErrorHandler(400, 'Invalid announcementId'));
            }
        
            announcement.media = await Promise.all(
                announcement.media.map(async (media: IAnnouncementMedia) => ({
                    ...media,
                    signedUrl: await getSignedUrlForFile(media.bucketName, media.key),
                }))
            );  

            return res.status(200).json({
            status: 'success',
            data: announcement
            });
        } catch (error) {
            return next(error);
        }
    }

    static async updateAnnouncementCaption(
		req: Request,
		res: Response,
		next: NextFunction
	) {
        const { announcementId } = req.params;
        if (!announcementId) {
            return next(new ErrorHandler(400, 'announcementId is missing'));
        }

        const { caption } = req.body;
        if (!caption) {
            return next(new ErrorHandler(400, 'caption is missing'));
        }

        try {
            const announcement = await Announcement.findById(announcementId).populate({ path: 'owner', select: 'role firstname _id lastname' });
            if (!announcement) {
                return next(new ErrorHandler(400, 'Invalid announcementId'));
            }

            const owner: IUser = announcement.owner as IUser;
            await checkUserPermission(req.user, 'announcements', 'update', owner._id);

            announcement.caption = caption;
            announcement.updatedBy = req.user._id;

            await announcement.save();

            return res.status(200).json({
                status: 'success',
                message: 'caption has been updated',
                data: announcement
            })
        } catch (error) {
            return next(error);
        }
    }

    // static async deleteAnnouncement(
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction
	// ) {
    //     const { announcementId } = req.params;
    //     if (!announcementId) {
    //         return next(new ErrorHandler(400, 'announcementId is missing'));
    //     }

    //     try {
    //         const announcement = await Announcement.findByIdAndDelete(announcementId)
    //         if (!announcement) {
    //             return next(new ErrorHandler(400, 'Invalid announcementId'));
    //         }

    //         const owner: IUser = announcement.owner as IUser;
    //         await checkUserPermission(req.user, 'announcements', 'update', owner._id);

    //         return res.status(200).json({
    //             status: 'success',
    //             message: 'caption has been updated',
    //             data: announcement
    //         })
    //     } catch (error) {
    //         return next(error);
    //     }
    // }
}

export default announcementController;
