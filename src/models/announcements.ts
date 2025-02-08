import mongoose from 'mongoose';
import { IAnnouncementMedia, IAnnouncement } from '../interfaces/announcement';

// Media Subdocument Schema
const AnnouncementMediaSchema = new mongoose.Schema<IAnnouncementMedia>(
  {
    bucketName: { type: String, default: 'announcementmedia' },
    mimeType: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
  },
  { _id: true }
);

const AnnouncementSchema = new mongoose.Schema<IAnnouncement>(
  {
    media: [AnnouncementMediaSchema],
    caption: { type: String, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Announcement = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
export default Announcement;
