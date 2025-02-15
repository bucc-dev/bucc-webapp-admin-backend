/**
 * @openapi
 * /users/{targetUserId}:
 *   delete:
 *     summary: Delete a user
 *     description: >
 *       Deletes the user specified by the targetUserId. 
 *       Requires permission to `delete` users.
 *       Rate limited to 5 requests every minute
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
 *         description: The ID of the user to delete. If omitted, deletes the authenticated user.
 *     responses:
 *       204:
 *         description: User deleted successfully. No content is returned.
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
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
