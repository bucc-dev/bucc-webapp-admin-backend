/**
 * @openapi
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: accessToken
 *   responses:
 *     RateLimitMinimal:
 *       description: Too many requests – rate limit exceeded (100 requests every 5 minutes).
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "fail"
 *               message:
 *                 type: string
 *                 example: "Too many requests, please try again after 5 minutes"
 *     RateLimitModerate:
 *       description: Too many requests – rate limit exceeded (5 requests per minute).
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "fail"
 *               message:
 *                 type: string
 *                 example: "Too many requests, please try again after 1 minute"
 *     RateLimitStrict:
 *       description: Too many requests – rate limit exceeded (1 request per minute).
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "fail"
 *               message:
 *                 type: string
 *                 example: "Too many requests, please try again after 1 minute"
 *     InternalError:
 *       description: Internal server error.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "fail"
 *               message:
 *                 type: string
 *                 example: "Internal server error"
 *     LoginRequired:
 *       description: Authentication is required.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "fail"
 *               message:
 *                 type: string
 *                 example: "Login required"
 *     AccountNotVerified:
 *       description: The account is not verified.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "fail"
 *               message:
 *                 type: string
 *                 example: "Account is not verified"
 *     AccountDoesNotExistInvalidID:
 *       description: "The account does not exist: Invalid ID."
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "fail"
 *               message:
 *                 type: string
 *                 example: "Account does not exist: Invalid ID"
 */
