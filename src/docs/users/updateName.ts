/**
 * @openapi
 * /users/self/update/name:
 *   patch:
 *     summary: Update the authenticated user's name
 *     description: >
 *       Updates the authenticated user's first and/or last name. At least one field (firstname or lastname) is required.
 *       Requires permission to update users (itself).
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
 *               firstname:
 *                 type: string
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 example: "Doe"
 *             description: At least one of the fields must be provided.
 *     responses:
 *       200:
 *         description: User name updated successfully.
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
 *       400:
 *         description: Bad Request – when neither firstname nor lastname is provided.
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
 *                   example: "At least one field is required"
 *       403:
 *         description: Forbidden – if the authenticated user lacks permission to update users.
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
