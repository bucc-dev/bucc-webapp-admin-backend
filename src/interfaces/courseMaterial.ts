import mongoose, { Document } from 'mongoose';

// CM = courseMaterial
export type CMLevel = 100 | 200 | 300 | 400;
export type CMCourse = 'CS' | 'CIT' | 'IT' | 'SE' | 'CT' | 'CIS';
export type CMtype = 'course_list' | 'course_materials';
export type CMsubType = 'first_semester' | 'second_Semester';

export interface ICourseMaterial extends Document {
    _id: mongoose.Schema.Types.ObjectId; 
    level: CMLevel;
    course: CMCourse;
    type: CMtype;
    materialSubType: CMsubType;
    courseCode: String;
    courseTitle: String;
    data: Buffer;
    contentType: String;
    fileName: String;
    uploadedBy: {
        email: String;
        fullName: String;
        userId: mongoose.Schema.Types.ObjectId
    }
}
