import mongoose, { Document } from 'mongoose';
import IUser from './user';

export interface IAnnouncementMedia {
    bucketName: 'announcementmedia';
    mimeType: string;
    name: string;
    size: string;
    key: string;
}

export interface IAnnouncement extends Document {
    media: IAnnouncementMedia[];
    caption?: string;
    updatedBy?: mongoose.Schema.Types.ObjectId | IUser;
    owner: mongoose.Schema.Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
    _id: mongoose.Schema.Types.ObjectId
}