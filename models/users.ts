import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { CustomJwtPayload } from '../interfaces';
import IUser from '../interfaces/user';

config();

const UserSchema = new mongoose.Schema({
	firstname: {
		type: String,
		required: true,
		minlength: [1, 'Input a valid firstname'],
		maxlength: [25, 'Firstname is too long'],
	},
	lastname: {
		type: String,
		required: true,
		minlength: [1, 'Input a valid lastname'],
		maxlength: [25, 'Lastname is too long'],
	},
	fullname: {
		type: String,
	},
	password: {
		type: String,
		required: true,
		minlength: [6, 'Password must be at least 6 characters long'],
		match: [
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?`~\\|])[A-Za-z\d!@#$%^&*()\-_=+[\]{};:'",.<>/?`~\\|]{6,}$/,
			'Password must be at least 6 characters long, with an uppercase letter, lowercase letter, number, and special character.',
		],
	},
	role: {
		type: String,
		enum: ['admin', 'super_admin'],
		required: true,
	},
	accessLevel: {
		type: Number,
		required: true,
		enum: [1, 2], // 1 for admin/senator, 2 for super admin/SP
		default: 1,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: [
			/^[a-zA-Z0-9._%+-]+@(student|staff)\.babcock\.edu\.ng$/,
			'Please fill a valid school email address',
		],
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	refreshTokens: {
		type: [String],
		default: [],
	},
	creatorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		default: null,
	},
	courseMaterials: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'CourseMaterial',
		},
	],
	announcements: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Announcement',
		},
	],
	notifications: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Notification',
		},
	],
	pendingRequests: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Request',
		},
	],
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
	if (this.isModified(['firstname', 'lastname']) || this.isNew) {
		this.fullname = `${this.lastname} ${this.firstname}`;
	}

	if (this.isNew) {
		if (this.role === 'super_admin') this.accessLevel = 2;
	}

	if (this.isModified('password') || this.isNew) {
		this.password = await bcrypt.hash(this.password, 10);
	}

	next();
});

// methods
/**
 * Checks if the provided password matches the stored password.
 *
 * @param {string} password - The password to check.
 * @returns {Promise<boolean>} - Returns true if the password is correct, otherwise false.
 */
UserSchema.methods.isPasswordCorrect = async function (
	password: string
): Promise<boolean> {
	return await bcrypt.compare(password, this.password);
};

/**
 * Generates a new refresh token for the user and saves changes..
 *
 * @param {CustomJwtPayload} payload - The payload to include in the refresh token.
 * @returns {Promise<string>} - Returns the generated refresh token.
 */
UserSchema.methods.generateRefreshToken = async function (
	payload: CustomJwtPayload
): Promise<string> {
	const refreshToken: string = jwt.sign(
		payload,
		process.env.JWT_SECRET as string,
		{ expiresIn: '7d' }
	);

	this.refreshTokens.push(refreshToken);
	await this.save();

	return refreshToken;
};

// has access method

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
