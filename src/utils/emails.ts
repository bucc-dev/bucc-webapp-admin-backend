import nodemailer from 'nodemailer';
import cache from './cache.js';
import { ErrorHandler } from './errorHandler.js';
import IUser from '../interfaces/user.js';

/**
 * Generates OTP and Sends a verification email with the OTP to the specified user.
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


export async function sendPasswordResetEmail(user: IUser, accessToken: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset',
    html: `<p>Click the link below to reset your password:

			${process.env.FRONTEND_URL}/reset-password?token=${accessToken}</p>
	
			<p>If you didn't request this, contact support.</p>
	        <h4>DO NOT REPLY TO THIS AUTOMATED EMAIL.</h4>`,
  });
};
