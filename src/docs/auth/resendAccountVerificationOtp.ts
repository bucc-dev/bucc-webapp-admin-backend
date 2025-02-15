/**
 * @openapi
 * /auth/resend-account-verification-otp:
 *   post:
 *     summary: Resend account verification OTP
 *     description: >
 *       Resends the account verification OTP to the provided email.
 *       Rate limited to 1 request per minute.
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
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP has been successfully sent to the user's email.
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
 *                   example: "OTP has been successfully sent to your email."
 *       400:
 *         description: Missing email.
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
 *       404:
 *         $ref: '#/components/responses/AccountDoesNotExistInvalidID'
 *       429:
 *         $ref: '#/components/responses/RateLimitStrict'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
