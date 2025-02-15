/**
 * @openapi
 * /users/self/permission/check:
 *   get:
 *     summary: Check the authenticated user's permission
 *     description: >
 *       Checks whether the authenticated user has the required permission for a specified resource, action, and scope.
 *       Returns a boolean flag and a message indicating if the user has permission.
 *       Rate limited to 100 requests every 5 minutes
 *     tags:
 *       - Permission
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
 *               resource:
 *                 type: string
 *                 example: "announcements"
 *               action:
 *                 type: string
 *                 example: "create"
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
 *         description: User has permission.
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
 *                   example: "User has permission"
 *                 hasPermission:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad Request – one or more required fields are missing.
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
 *                   example: "resource is missing"
 *       403:
 *         description: User does not have permission.
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
 *                   example: "User does not have permission"
 *                 hasPermission:
 *                   type: boolean
 *                   example: false
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
