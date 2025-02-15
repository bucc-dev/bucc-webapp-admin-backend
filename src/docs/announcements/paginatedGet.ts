/**
 * @openapi
 * /announcements:
 *   get:
 *     summary: Retrieve paginated announcements
 *     description: >
 *       Retrieves a paginated list of announcements. Supports query parameters `page` and `limit` for pagination.
 *       The response includes metadata (page, limit, totalAnnouncements, totalPages) and an array of announcement objects.
 *       Requires `read` permission on announcements
 *       Rate limited to 100 requests every 5 minutes.
 *     tags:
 *       - Announcement
 *     security:
 *       - accessTokenCookie: []
 *       - refreshTokenCookie: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of announcements per page.
 *     responses:
 *       200:
 *         description: Paginated announcements retrieved successfully.
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
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 2
 *                         totalAnnouncements:
 *                           type: integer
 *                           example: 49
 *                         totalPages:
 *                           type: integer
 *                           example: 25
 *                     announcements:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "67a8dd0f3002802df54a99a0"
 *                           media:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 bucketName:
 *                                   type: string
 *                                   example: "announcementmedia"
 *                                 mimeType:
 *                                   type: string
 *                                   example: "image/png"
 *                                 name:
 *                                   type: string
 *                                   example: "example.png"
 *                                 size:
 *                                   type: string
 *                                   example: "87800"
 *                                 key:
 *                                   type: string
 *                                   example: "1739119886550-example.png"
 *                                 signedUrl:
 *                                   type: string
 *                                   example: "<imageUrl>"
 *                           caption:
 *                             type: string
 *                             example: ""
 *                           owner:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "67a7fda423309670449f9517"
 *                               firstname:
 *                                 type: string
 *                                 example: "test"
 *                               lastname:
 *                                 type: string
 *                                 example: "admin"
 *                               role:
 *                                 type: string
 *                                 example: "admin"
 *                               isVerified:
 *                                 type: boolean
 *                                 example: true
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-02-09T00:58:12.102Z"
 *                               updatedAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-02-09T23:04:33.532Z"
 *                               __v:
 *                                 type: number
 *                                 example: 30
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-09T16:51:27.899Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-09T16:51:27.899Z"
 *                           __v:
 *                             type: number
 *                             example: 0
 *             examples:
 *               paginatedResponse:
 *                 summary: Paginated announcements response
 *                 value:
 *                   status: "success"
 *                   data:
 *                     metadata:
 *                       page: 1
 *                       limit: 2
 *                       totalAnnouncements: 49
 *                       totalPages: 25
 *                     announcements:
 *                       - _id: "67a8dd0f3002802df54a99a0"
 *                         media:
 *                           - bucketName: "announcementmedia"
 *                             mimeType: "image/png"
 *                             name: "example.png"
 *                             size: "87800"
 *                             key: "1739119886550-example.png"
 *                             signedUrl: "<imageUrl>"
 *                         caption: ""
 *                         owner:
 *                           _id: "67a7fda423309670449f9517"
 *                           firstname: "test"
 *                           lastname: "admin"
 *                           role: "admin"
 *                           isVerified: true
 *                           createdAt: "2025-02-09T00:58:12.102Z"
 *                           updatedAt: "2025-02-09T23:04:33.532Z"
 *                           __v: 30
 *                       - _id: "67a8dc53e375b899de2efeb2"
 *                         media:
 *                           - bucketName: "announcementmedia"
 *                             mimeType: "image/png"
 *                             name: "example.png"
 *                             size: "87800"
 *                             key: "1739119696891-example.png"
 *                             signedUrl: "<imageUrl>"
 *                         caption: ""
 *                         owner:
 *                           _id: "67a7fda423309670449f9517"
 *                           firstname: "test"
 *                           lastname: "admin"
 *                           role: "admin"
 *                           isVerified: true
 *                           createdAt: "2025-02-09T00:58:12.102Z"
 *                           updatedAt: "2025-02-09T23:04:33.532Z"
 *                           __v: 30
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
 *         description: Forbidden – if the user lacks permission to read announcements.
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
