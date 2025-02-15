/**
 * @openapi
 * /auth/verify-account:
 *   post:
 *     summary: Verify a user's account via OTP
 *     description: >
 *       Verifies a user's account using the provided email and OTP. If the OTP is valid and the account is not yet verified,
 *       the account is marked as verified and login cookies (with an access token valid for 15 minutes) are set.
 *       If the account is already verified, a 201 status is returned.
 *       Rate limited to 5 requests per minute.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@student.babcock.edu.ng"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *             required:
 *               - email
 *               - otp
 *     responses:
 *       200:
 *         description: Account verified and user successfully logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Successfully logged in"
 *       201:
 *         description: Account is already verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Account is already verified"
 *       400:
 *         description: Missing email or OTP.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "email is missing"
 *       401:
 *         description: Unauthorized – OTP is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "otp is invalid"
 *       404:
 *         $ref: '#/components/responses/AccountDoesNotExistInvalidID'
 *       429:
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
