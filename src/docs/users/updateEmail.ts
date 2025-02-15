/**
 * @openapi
 * /users/self/update/email:
 *   post:
 *     summary: Initiate email update for the authenticated user
 *     description: >
 *       Initiates the email update process by sending a verification OTP to the new email provided in the request body.
 *       Rate limited to 1 request per minute.
 *     tags:
 *       - User
 *     security:
 *       - accessTokenCookie: []
 *       - refreshTokenCookie: []
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
 *                 example: "new.email@student.babcock.edu.ng"
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP has been sent to the new email.
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
 *                   example: "A OTP has been sent to your new email"
 *       400:
 *         description: Bad Request – when the email field is missing.
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
 *       409:
 *         description: Conflict – when the provided email is already in use.
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
 *                   example: "Email has already been used"
 *       429:
 *         $ref: '#/components/responses/RateLimitStrict'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
