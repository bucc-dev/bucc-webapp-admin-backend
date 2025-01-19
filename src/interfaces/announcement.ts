import mongoose, { Document } from 'mongoose';

interface AnnouncementImage {
  data: Buffer;
  contentType: string;
}

interface IAnnouncement extends Document {
  images: AnnouncementImage[];
  caption: string;
  user: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

export default IAnnouncement;