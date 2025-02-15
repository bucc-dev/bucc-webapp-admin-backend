/**
 * @openapi
 * /users/{targetUserId}/permission/grant:
 *   patch:
 *     summary: Grant a specified permission to a user
 *     description: >
 *       Grants a specified permission to the target user for a given resource. Only a user with super_admin role is authorized to grant permissions. Rate limited to 100 requests every 5 minutes
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
 *         description: The ID of the target user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resource:
 *                 type: string
 *                 example: "announcements"
 *               action:
 *                 type: string
 *                 example: "read"
 *               scope:
 *                 type: string
 *                 enum: [own, others]
 *                 example: "own"
 *             required:
 *               - resource
 *               - action
 *               - scope
 *     responses:
 *       200:
 *         description: Permission granted successfully.
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
 *               alreadyGranted:
 *                 summary: Already has permission
 *                 value:
 *                   status: "success"
 *                   message: "John Doe already has this permission"
 *               newlyGranted:
 *                 summary: Newly granted permission
 *                 value:
 *                   status: "success"
 *                   message: "Permission granted"
 *       400:
 *         description: Bad Request – Missing required fields or invalid input.
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
 *         description: Forbidden – Access denied.
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
 *         description: Target user does not exist.
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
 *                   example: "Target user does not exist"
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
