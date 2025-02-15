/**
 * @openapi
 * /users/{targetUserId}/update/role:
 *   patch:
 *     summary: Update a user's role
 *     description: >
 *       Updates the role of the user specified by targetUserId.
 *       The authenticated user cannot update their own role.
 *       Requires permission to `update` users (others).
 *       Rate limited to 5 requests every minute.
 *     tags:
 *       - User
 *     security:
 *       - accessTokenCookie: []
 *       - refreshTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose role is being updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newRole:
 *                 type: string
 *                 example: "admin"
 *             required:
 *               - newRole
 *     responses:
 *       200:
 *         description: User role updated successfully.
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
 *                     firstname:
 *                       type: string
 *                       example: "John"
 *                     lastname:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@school.edu"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-10T10:06:08.906Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-10T10:06:08.906Z"
 *             examples:
 *               updated:
 *                 summary: Role updated successfully
 *                 value:
 *                   status: "success"
 *                   data:
 *                     _id: "67a9cf9048e5e1d68e0b2a0f"
 *                     firstname: "John"
 *                     lastname: "Doe"
 *                     email: "john.doe@school.edu"
 *                     role: "admin"
 *                     isVerified: true
 *                     createdAt: "2025-02-10T10:06:08.906Z"
 *                     updatedAt: "2025-02-10T10:06:08.906Z"
 *       400:
 *         description: Bad Request – either required fields are missing, the new role is the same as the current role, or the new role is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             examples:
 *               alreadyHasRole:
 *                 summary: User already has the specified role
 *                 value:
 *                   status: "fail"
 *                   message: "User already has the admin role"
 *               invalidRole:
 *                 summary: Invalid role provided
 *                 value:
 *                   status: "fail"
 *                   message: "Invalid role"
 *       403:
 *         description: Forbidden – either the authenticated user is trying to update their own role or lacks permission.
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
 *                   example: "User cannot update their own role"
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
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
