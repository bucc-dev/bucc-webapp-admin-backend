/**
 * @openapi
 * /users/{targetUserId}/announcements/{announcementId}:
 *   get:
 *     summary: Retrieve a single user announcement
 *     description: >
 *       Retrieves a specific announcement for the given targetUserId. 
 *       Requires permission to `read` announcements.
 *       Rate limited to 100 requests every 5 minutes
 *     tags:
 *       - Announcement
 *     security:
 *       - accessTokenCookie: []
 *       - refreshTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user who owns the announcement.
 *       - in: path
 *         name: announcementId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the announcement.
 *     responses:
 *       200:
 *         description: Announcement retrieved successfully.
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
 *                       example: "67a8dd0f3002802df54a99a0"
 *                     media:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           bucketName:
 *                             type: string
 *                             example: "announcementmedia"
 *                           mimeType:
 *                             type: string
 *                             example: "image/png"
 *                           name:
 *                             type: string
 *                             example: "home1.png"
 *                           size:
 *                             type: string
 *                             example: "87800"
 *                           key:
 *                             type: string
 *                             example: "1739119886550-home1.png"
 *                           signedUrl:
 *                             type: string
 *                             example: "<imageUrl>"
 *                     caption:
 *                       type: string
 *                       example: ""
 *                     owner:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "67a7fda423309670449f9517"
 *                         firstname:
 *                           type: string
 *                           example: "test"
 *                         lastname:
 *                           type: string
 *                           example: "admin"
 *                         role:
 *                           type: string
 *                           example: "admin"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-09T16:51:27.899Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-09T16:51:27.899Z"
 *                     __v:
 *                       type: number
 *                       example: 0
 *       400:
 *         description: Bad Request – either announcementId is missing or the provided announcementId is invalid.
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
 *               missingAnnouncementId:
 *                 summary: Missing announcementId
 *                 value:
 *                   status: "fail"
 *                   message: "announcementId is missing"
 *               invalidAnnouncementId:
 *                 summary: Invalid announcementId
 *                 value:
 *                   status: "fail"
 *                   message: "Invalid announcementId"
 *       403:
 *         description: Forbidden – if the user lacks permission to read announcements.
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
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
