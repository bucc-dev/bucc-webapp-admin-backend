import nodemailer from 'nodemailer';
import cache from './cache.js';
import { ErrorHandler } from './errorHandler.js';

/**
 * Sends a verification email with an OTP to the specified user.
 * 
 * @param {string} userId - The ID of the user.
 * @param {string} email - The email address of the user.
 * @returns {void | ErrorHandler} - Returns an error handler if an error occurs.
 */
export async function sendVerificationMail(userId: string, email: string): Promise<void | ErrorHandler> {
	try {
		const otp = await cache.generateAndSaveOTP(userId);

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: 'findtamilore@gmail.com',
			subject: 'OTP code',
			html: `<h2>OTP for verification</h2>
	             <p>Enter the following otp on the site:</p>
	             <h2>${otp}</h2>
	             <p>If you didn't request this, contact support.</p>
	             <h4>DO NOT REPLY TO THIS AUTOMATED EMAIL.</h4>`,
		});
	} catch (error) {
		console.error(error);
		return new ErrorHandler(500, 'Request a new email');
	}
}
