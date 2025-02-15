/**
 * @openapi
 * /users/reset-password:
 *   patch:
 *     summary: Reset the authenticated user's password
 *     description: >
 *       Resets the password for the authenticated user.
 *       Requires permission to update users (itself).
 *       Rate limited to 1 request per minute.
 *     tags:
 *       - User
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
 *               newPassword:
 *                 type: string
 *                 example: "NewPassword123!"
 *               confirmNewPassword:
 *                 type: string
 *                 example: "NewPassword123!"
 *             required:
 *               - newPassword
 *               - confirmNewPassword
 *     responses:
 *       200:
 *         description: Password has been successfully reset.
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
 *                   example: "Password has been successfully reset"
 *       400:
 *         description: Bad Request – when required password fields are missing or do not match.
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
 *               missingFields:
 *                 summary: Missing password fields
 *                 value:
 *                   status: "fail"
 *                   message: "All password fields are required"
 *               mismatch:
 *                 summary: Passwords do not match
 *                 value:
 *                   status: "fail"
 *                   message: "newPassword and confirmNewPassword do not match"
 *       403:
 *         description: Forbidden – if the authenticated user lacks permission to update users (itself).
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
 *       429:
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
