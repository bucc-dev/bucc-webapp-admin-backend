/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     description: >
 *       Logs out an authenticated user.
 *       Requires authentication.
 *       Rate limited to 5 requests per minute.
 *     tags:
 *       - Auth
 *     security:
 *       - accessTokenCookie: []
 *       - refreshTokenCookie: []
 *     responses:
 *       200:
 *         description: Logged out successfully.
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
 *                   example: "Logged out successfully"
 *       401:
 *         description: Either login is required or the account does not exist (Invalid ID).
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
 *                   example: "Login required"
 *       429:
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
