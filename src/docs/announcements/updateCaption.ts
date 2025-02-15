/**
 * @openapi
 * /announcements/{announcementId}/update-caption:
 *   patch:
 *     summary: Update an announcement's caption
 *     description: >
 *       Updates the caption of the announcement.
 *       requires `update` permission on announcements
 *       Rate limited to 5 requests per minute.
 *     tags:
 *       - Announcement
 *     security:
 *       - accessTokenCookie: []
 *       - refreshTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: announcementId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the announcement to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               caption:
 *                 type: string
 *                 example: "Updated caption text"
 *             required:
 *               - caption
 *     responses:
 *       200:
 *         description: Caption has been updated successfully.
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
 *                   example: "caption has been updated"
 *                 data:
 *                   type: object
 *                   description: The updated announcement document.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67a8dd0f3002802df54a99a0"
 *                     caption:
 *                       type: string
 *                       example: "Updated caption text"
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
 *                     updatedBy:
 *                       type: string
 *                       example: "67a7fda423309670449f9517"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-09T16:51:27.899Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-09T17:00:00.000Z"
 *             examples:
 *               success:
 *                 summary: Caption updated
 *                 value:
 *                   status: "success"
 *                   message: "caption has been updated"
 *                   data:
 *                     _id: "67a8dd0f3002802df54a99a0"
 *                     caption: "Updated caption text"
 *                     owner:
 *                       _id: "67a7fda423309670449f9517"
 *                       firstname: "test"
 *                       lastname: "admin"
 *                       role: "admin"
 *                     updatedBy: "67a7fda423309670449f9517"
 *                     createdAt: "2025-02-09T16:51:27.899Z"
 *                     updatedAt: "2025-02-09T17:00:00.000Z"
 *       400:
 *         description: Bad Request – either announcementId or caption is missing, or announcementId is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             examples:
 *               missingAnnouncementId:
 *                 summary: Missing announcementId
 *                 value:
 *                   status: "fail"
 *                   message: "announcementId is missing"
 *               missingCaption:
 *                 summary: Missing caption
 *                 value:
 *                   status: "fail"
 *                   message: "caption is missing"
 *               invalidAnnouncementId:
 *                 summary: Invalid announcementId
 *                 value:
 *                   status: "fail"
 *                   message: "Invalid announcementId"
 *       403:
 *         description: Forbidden – if the user lacks permission to update announcements.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               status: "fail"
 *               message: "Access denied"
 *       429:
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
