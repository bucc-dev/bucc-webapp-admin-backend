import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { createClient, RedisClientType } from 'redis';
import otpGenerator from 'otp-generator';
import { ErrorHandler } from './errorHandler';
import mongoose from 'mongoose';
import { CustomJwtPayload } from '../interfaces';

config();

/**
 * RedisClient class handles Redis connection, OTP generation, and validation.
 * It manages the connection status and provides methods to generate and validate OTPs.
 */
class RedisClient {
	public client: RedisClientType;
	public connected: boolean = false;

	constructor() {
		this.client = createClient({
			password: process.env.REDIS_PASSWORD,
			socket: {
				host: process.env.REDIS_HOST,
				port: Number(process.env.REDIS_PORT)
			},
		});

		this.client.on('error', (error) => {
			console.error('Failed to connect to Redis:', error);
			this.connected = false;
		});

		this.client.on('ready', async () => {
			this.connected = true;
			console.log('Redis is connected');
		});

		this.client.connect();
	}

	private checkCacheConnection() {
		if (!this.connected) {
			console.error(`Cache is down at ${new Date()}, cannot save OTP`);
			return new ErrorHandler(
				500,
				'This service is down, contact support.'
			);
		}
	}

	/**
	 * Blacklists the given access token.
	 * @param {string} userId - The user ID.
	 * @param {string} accessToken - The access token to blacklist.
	 * @returns {Promise<ErrorHandler | void>}
	 */
	public async blacklistAccessToken(userId: mongoose.Schema.Types.ObjectId, accessToken: string): Promise<ErrorHandler | void> {
		this.checkCacheConnection();

		const decoded: CustomJwtPayload = jwt.verify(accessToken, process.env.JWT_SECRET as string) as CustomJwtPayload; 

		const jwtExp = decoded.exp as number;
		const currentTime = Math.floor(Date.now() / 1000);
		const expirationTime = jwtExp - currentTime;

		try {
			const blacklistKey = `${userId}:blacklist`;
			this.client.sAdd(blacklistKey, accessToken);

			// set the set to expire when the last token in the set has expired
			this.client.expire(blacklistKey, expirationTime);
		} catch (error) {
			return new ErrorHandler(500, 'Internal server error - Failed to blacklist access token.');
		}
	}


	/**
 * Checks if the given access token is blacklisted.
 * @param {string} userId - The user ID.
 * @param {string} accessToken - The access token to check.
 * @returns {Promise<ErrorHandler | boolean>}
 */
public async isAccessTokenBlacklisted(userId: mongoose.Schema.Types.ObjectId, accessToken: string): Promise<ErrorHandler | boolean> {
    this.checkCacheConnection();

    try {
        const blacklistKey = `${userId.toString()}:blacklist`;
        return await this.client.sIsMember(blacklistKey, accessToken);
    } catch (error) {
		return new ErrorHandler(500, 'Internal server error - Failed to blacklist access token.');
    }
}


	/**
	 * Generates and saves an OTP for the given user ID.
	 * @param userId - The user ID to associate with the OTP.
	 * @returns ErrorHandler if the cache is down.
	 */
	public async generateAndSaveOTP(
		userId: string
	): Promise<ErrorHandler | string> {
		this.checkCacheConnection();

		try {
			const otp: string = otpGenerator.generate(6, {
				lowerCaseAlphabets: false,
				specialChars: false,
			});

			await this.client.set(userId, otp, { EX: 5 * 60 * 1000 }); // valid for 5 minutes

            return otp;
		} catch (error) {
			console.error(
				error// `otpgenerator failed for USER: ${userId} at ${new Date()}`
			);
			return new ErrorHandler(500, 'Please try again');
		}
	}

	/**
	 * Validates the OTP for the given user ID.
	 * @param {string} userId - The user ID to validate the OTP for.
	 * @param {string} otp - The OTP to validate.
	 * @returns boolean indicating if the OTP is valid or not, or ErrorHandler if the service is down.
	 */
	public async isOtpValid(
		userId: string,
		otp: string
	): Promise<boolean | ErrorHandler> {
		this.checkCacheConnection();

		try {
			const userOtp = await this.client.get(userId);
			if (userOtp === otp) {
				return true;
			}
			return false;
		} catch (error) {
			console.log(error);
			return new ErrorHandler(500, 'Please try again.');
		}
	}
}

const cache = new RedisClient();
export default cache;
