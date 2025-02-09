import mongoose from 'mongoose';
import { IAnnouncementMedia, IAnnouncement } from '../interfaces/announcement';

// Media Subdocument Schema
const AnnouncementMediaSchema = new mongoose.Schema<IAnnouncementMedia>(
  {
    bucketName: { type: String, default: 'announcementmedia' },
    mimeType: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: String, required: true },
    key: { type: String, required: true }
  },
  { _id: false }
);

const AnnouncementSchema = new mongoose.Schema<IAnnouncement>(
  {
    media: {
        type: [AnnouncementMediaSchema],
        validate: {
            validator: (value: any[]) => value.length <= 3,
            message: 'An announcement can have at most 3 media files.'
        }
    },
    caption: { type: String, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Announcement = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
export default Announcement;
