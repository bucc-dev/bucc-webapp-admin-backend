import mongoose from "mongoose";
import { ICourseMaterial } from "../interfaces/courseMaterial";


const courseMaterialSchema = new mongoose.Schema<ICourseMaterial>({
	level: {
		type: Number,
		enum: [100, 200, 300, 400],
		required: true,
	},
	course: {
		type: String,
		enum: ['CS', 'CIT', 'IT', 'SE', 'CT', 'CIS'],
		required: true,
	},
	type: {
		type: String,
		enum: ['course_list', 'course_materials'],
		required: true
	},
	materialSubType: { // check this in presave hook
		type: String,
		enum: ['first_semester', 'second_semester'],
		required: function() {
			return this.type === 'course_materials'
		}
	},
	courseCode: {
		type: String,
		required: function() {
			return this.type === 'course_materials'
		}
	},
	courseTitle: {
		type: String,
		required: function() {
			return this.type === 'course_materials'
		}
	},
	data: {
		type: Buffer,
		required: true
	},
	contentType: {
		type: String,
		required: true
	},
	fileName: {
		type: String,
		required: true,
	},
	uploadedBy : {
		email: {
			type: String,
			required: true
		},
		fullName: {
			type: String,
			required: true
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		}
	}
},
{ timestamps: true }
);

const CourseMaterial = mongoose.model('CourseMaterial', courseMaterialSchema);

export default CourseMaterial;

static async uploadFile(req: Request, res: Response, next: NextFunction) {}
