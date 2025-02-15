/**
 * @openapi
 * /announcements/{announcementId}:
 *   delete:
 *     summary: Delete an announcement
 *     description: >
 *       Deletes the announcement.
 *       Requires permission to `delete` announcements
 *       Rate limited to 100 requests every 5 minutes.
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
 *         description: The ID of the announcement to delete.
 *     responses:
 *       204:
 *         description: Announcement deleted successfully. No content is returned.
 *       400:
 *         description: Bad Request – when announcementId is missing or invalid.
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
 *               invalidAnnouncementId:
 *                 summary: Invalid announcementId
 *                 value:
 *                   status: "fail"
 *                   message: "Invalid announcementId"
 *       403:
 *         description: Forbidden – if the user lacks permission to delete announcements.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               status: "fail"
 *               message: "Access denied"
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
