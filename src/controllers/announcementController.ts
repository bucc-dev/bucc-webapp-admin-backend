import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../utils/errorHandler';
import Announcement from '../models/announcements';
import { checkUserPermission } from '../utils/checkPermission';
import IUser from '../interfaces/user';
import { IAnnouncement, IAnnouncementMedia } from '../interfaces/announcement';
import { deleteBucketObject, getSignedUrlForFile, r2Client } from '../config/r2Config';
import { IMulterS3File } from '../interfaces';
import mongoose from 'mongoose';

  
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

        const targetUserId = req.params?.targetUserId;

        try {
            await checkUserPermission(req.user, 'announcements', 'read')

            let query: { _id: string | mongoose.Schema.Types.ObjectId, owner?: string | mongoose.Schema.Types.ObjectId };
            if (targetUserId) {
                query = {
                    _id: announcementId,
                    owner: targetUserId
                }
            } else {
                query = { _id: announcementId };
            }

            const announcement = await Announcement.findOne(query).populate({ path: 'owner', select: 'role firstname _id lastname' }).lean();

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

    static async deleteAnnouncement(
		req: Request,
		res: Response,
		next: NextFunction
	) {
        const { announcementId } = req.params;
        if (!announcementId) {
            return next(new ErrorHandler(400, 'announcementId is missing'));
        }

        try {
            const announcement = await Announcement.findById(announcementId);
            if (!announcement) {
                return next(new ErrorHandler(400, 'Invalid announcementId'));
            }

            const owner = announcement.owner as mongoose.Schema.Types.ObjectId;
            await checkUserPermission(req.user, 'announcements', 'delete', owner);

            await Promise.all(
                announcement.media.map(async (media) => {
                    await deleteBucketObject(media.bucketName, media.key);
                })
            );

            await announcement.deleteOne();

            return res.sendStatus(204);
        } catch (error) {
            return next(error);
        }
    }

    static async paginatedGet(req: Request, res: Response, next: NextFunction) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
    
        const targetUserId = req.params?.targetUserId;
    
        try {
            // Build the aggregation pipeline dynamically.
            const pipeline: any[] = [];
    
            // If a targetUserId is provided, add a $match stage at the beginning of the pipeline
            if (targetUserId) {
                pipeline.push({
                    $match: {
                        owner: new mongoose.Types.ObjectId(targetUserId)
                    }
                });
            }
    
            pipeline.push(
                {
                    $sort: {
                        updatedAt: -1,
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                    },
                },
                {
                    $unwind: {
                        path: "$owner"
                    },
                },
                {
                    $project: {
                        "owner.refreshTokens": 0,
                        "owner.email": 0,
                        "owner.password": 0
                    }
                },
                {
                    $facet: {
                        metadata: [{ $count: "totalAnnouncements" }],
                        announcements: [{ $skip: skip }, { $limit: limit }],
                    },
                }
            );
    
            const result = await Announcement.aggregate(pipeline);
    
            // Extract announcements from the aggregation result
            const announcements = result[0]?.announcements || [];
    
            // Process each announcement's media field to add signed URLs in parallel
            await Promise.all(
                announcements.map(async (announcement: IAnnouncement) => {
                    announcement.media = await Promise.all(
                        announcement.media.map(async (media) => ({
                            ...media,
                            signedUrl: await getSignedUrlForFile(media.bucketName, media.key),
                        }))
                    );
                })
            );
    
            const totalAnnouncements = result[0]?.metadata[0]?.totalAnnouncements ?? 0;
    
            return res.status(200).json({
                status: "success",
                data: {
                    metadata: {
                        page,
                        limit,
                        totalAnnouncements,
                        totalPages: Math.ceil(totalAnnouncements / limit)
                    },
                    announcements,
                },
            });
        } catch (error) {
            return next(error);
        }
    }      
}

export default announcementController;
