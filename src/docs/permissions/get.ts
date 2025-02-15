/**
 * @openapi
 * /users/{targetUserId}/permissions/get:
 *   get:
 *     summary: Retrieve a user's permission document
 *     description: >
 *       Retrieves the permission document for the user specified by `targetUserId`. 
 *       Students cannot view permissions and admins can only view their own permissions; only super_admin can view any user's permissions.
 *       Rate limited to 100 requests every 5 minutes
 * 
 *       **Note:** students can't view permissions and admins can only view their own permissions, while super_admin can view anybody's own.
 *     tags:
 *       - Permission
 *     security:
 *       - accessTokenCookie: []
 *       - refreshTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose permissions are requested.
 *     responses:
 *       200:
 *         description: Permission document retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67a9cf9048e5e1d68e0b2a0f"
 *                     userId:
 *                       type: string
 *                       example: "67a9cf9048e5e1d68e0b2a0c"
 *                     role:
 *                       type: string
 *                       example: "student"
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           resource:
 *                             type: string
 *                             example: "announcements"
 *                           actions:
 *                             type: object
 *                             properties:
 *                               own:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                                 example: ["read"]
 *                               others:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                                 example: ["read"]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-10T10:06:08.906Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-10T10:06:08.906Z"
 *                     __v:
 *                       type: number
 *                       example: 0
 *       400:
 *         description: Bad Request – targetUserId is missing.
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
 *                   example: "targetUserId is missing"
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
 *         $ref: '#/components/responses/AccountDoesNotExistInvalidID'
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
