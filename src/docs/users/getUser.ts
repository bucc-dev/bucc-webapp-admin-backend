/**
 * @openapi
 * /users/{targetUserId}:
 *   get:
 *     summary: Retrieve a user
 *     description: >
 *       Retrieves the user specified by the targetUserId
 *       Requires permission to `read` users.
 *       Rate limited to 100 requests every 5 minutes
 *     tags:
 *       - User
 *     security:
 *       - accessTokenCookie: []
 *       - refreshTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: false
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve. If omitted, the authenticated user's details are returned.
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "succcess"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67a9cf9048e5e1d68e0b2a0f"
 *                     firstname:
 *                       type: string
 *                       example: "John"
 *                     lastname:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@student.babcock.edu.ng"
 *                     role:
 *                       type: string
 *                       example: "student"
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-10T10:06:08.906Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-10T10:06:08.906Z"
 *       403:
 *         description: Access denied.
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
 *                   example: "Access denied"
 *       404:
 *         description: User does not exist.
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
 *                   example: "User does not exist"
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
