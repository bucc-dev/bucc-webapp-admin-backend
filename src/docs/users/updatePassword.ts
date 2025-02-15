/**
 * @openapi
 * /users/self/update/password:
 *   patch:
 *     summary: Update the authenticated user's password
 *     description: >
 *       Updates the password for the authenticated user.
 *       Rate limited to 5 requests per minute.
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
 *               oldPassword:
 *                 type: string
 *                 example: "OldPassword123!"
 *               newPassword:
 *                 type: string
 *                 example: "NewPassword123!"
 *               confirmNewPassword:
 *                 type: string
 *                 example: "NewPassword123!"
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmNewPassword
 *     responses:
 *       200:
 *         description: Password updated successfully.
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
 *                   example: "Password has been updated"
 *       400:
 *         description: Bad Request – when required password fields are missing or new passwords do not match.
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
 *             examples:
 *               missingFields:
 *                 summary: Missing password fields
 *                 value:
 *                   status: "fail"
 *                   message: "All password fields are required"
 *               mismatch:
 *                 summary: New passwords do not match
 *                 value:
 *                   status: "fail"
 *                   message: "newPassword and confirmNewPassword do not match"
 *       401:
 *         description: Unauthorized – when the old password is incorrect.
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
 *                   example: "oldPassword is incorrect"
 *       403:
 *         description: Forbidden – if the authenticated user lacks permission to update thier own profile.
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
