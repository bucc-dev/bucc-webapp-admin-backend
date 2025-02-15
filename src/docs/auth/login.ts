/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: >
 *       Logs in a user by validating email and password. On success, sets an access token and refresh token in cookies.
 *       The access token expires after 15 minutes.
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
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully logged in.
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
 *       400:
 *         description: Missing email or password.
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
 *                   example: "Email is missing"
 *       401:
 *         description: Invalid email or password.
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
 *                   example: "Invalid email or password"
 *       403:
 *         description: Account is not verified.
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
 *                   example: "Account is not verified"
 *       404:
 *         $ref: '#/components/responses/AccountDoesNotExistInvalidID'
 *       429:
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
