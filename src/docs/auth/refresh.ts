/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: >
 *       Refreshes the access token using the refresh token provided in cookies. On success, new access and refresh tokens are set in cookies (access token valid for 15 minutes).
 *       Rate limited to 1 request per minute.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Access token refreshed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: ""
 *       401:
 *         $ref: '#/components/responses/LoginRequired'
 *       429:
 *         $ref: '#/components/responses/RateLimitStrict'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
