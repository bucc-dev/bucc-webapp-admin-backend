import mongoose from 'mongoose';;
import IAnnouncement from '../interfaces/announcement';


const AnnouncementSchema = new mongoose.Schema(
	{
        images: {
            type: [
                {
                    data: Buffer,
                    contentType: String,
                }
            ],
            required: true
        },
        caption: {
            type: String,
            default: ''
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }]
	},
	{ timestamps: true }
);

AnnouncementSchema.pre('findOne', function(next) {
    const query = this.getQuery(); // Get the query object
    const announcementId = query._id;

    this.populate({
        path: 'user',
        select: 'role firstname _id lastname'
    })
    // .populate({
    //     path: 'comments',
    //     match: { announcementId },
    //     select: '',
    //     populate: {
    //         path: 'user', // Populate the 'user' field in each comment
    //         select: 'role firstname _id lastname', // Only populate the 'name' field of the user in each comment
    //     }
    // })
    next();
});

const Announcement = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);

export default Announcement;
