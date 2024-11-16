import { config } from 'dotenv';
import { createClient, RedisClientType } from 'redis';
import otpGenerator from 'otp-generator';
import { ErrorHandler } from '../middleware/errorHandler';

config();

/**
 * RedisClient class handles Redis connection, OTP generation, and validation.
 * It manages the connection status and provides methods to generate and validate OTPs.
 */
class RedisClient {
	private client: RedisClientType;
	public connected: boolean = false;

	constructor() {
		this.client = createClient({
			password: process.env.REDIS_PASS,
			socket: {
				host: process.env.REDIS_HOST,
				port: Number(process.env.REDIS_PORT),
			},
		});

		this.client.on('error', (error) => {
			console.error('Failed to connect to Redis:', error);
			this.connected = false;
		});

		this.client.on('ready', () => {
			this.connected = true;
			console.log('Redis is connected');
		});

		this.client.connect();

		setInterval(() => {
			this.client
				.ping()
				.then(() => {
					this.connected = true;
				})
				.catch((error) => {
					console.error(`Redis PING failed at ${new Date()}:`, error);
					this.connected = false;
				});
		}, 24 * 60 * 60 * 1000); // 24 hours
	}

	/**
	 * Generates and saves an OTP for the given user ID.
	 * @param userId - The user ID to associate with the OTP.
	 * @returns ErrorHandler if the cache is down.
	 */
	public async generateAndSaveOTP(
		userId: string
	): Promise<ErrorHandler | string> {
		if (!this.connected) {
			console.error(`Cache is down at ${new Date()}, cannot save OTP`);
			return new ErrorHandler(
				500,
				'This service is down, contact support.'
			);
		}

		try {
			const otp: string = otpGenerator.generate(6, {
				lowerCaseAlphabets: false,
				specialChars: false,
			});

			await this.client.set(userId, otp, { EX: 5 * 60 * 1000 }); // valid for 5 minutes

            return otp;
		} catch (error) {
			console.error(
				`otpgenerator failed for USER: ${userId} at ${new Date()}`
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
		if (!this.connected) {
			console.error(`Cache is down at ${new Date()}, cannot save OTP`);
			return new ErrorHandler(
				500,
				'This service is down, contact support.'
			);
		}

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
