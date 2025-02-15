/**
 * @openapi
 * /announcements:
 *   post:
 *     summary: Create a new announcement
 *     description: >
 *       Creates a new announcement by uploading files and saving announcement details. The request must be sent as multipart/form-data:
 *       Requires permission to `create` announcements.
 *       Rate limited to 5 requests per minute.
 *     tags:
 *       - Announcement
 *     security:
 *       - accessTokenCookie: []
 *       - refreshTokenCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "Files to upload (at least one file required, maximum 3 files)."
 *               bucketName:
 *                 type: string
 *                 example: "announcementmedia"
 *                 description: "The bucket name where the files will be stored."
 *               resource:
 *                 type: string
 *                 example: "announcements"
 *                 description: "The resource type; must be valid."
 *               caption:
 *                 type: string
 *                 example: "This is a test announcement"
 *                 description: "Optional caption for the announcement."
 *             required:
 *               - files
 *               - bucketName
 *               - resource
 *     responses:
 *       201:
 *         description: Announcement uploaded successfully.
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
 *                   example: "Announcement uploaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67a8dd0f3002802df54a99a0"
 *                     caption:
 *                       type: string
 *                       example: "This is a test announcement"
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
 *         description: Bad Request – when required fields are missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             examples:
 *               noFiles:
 *                 summary: No files provided
 *                 value:
 *                   status: "fail"
 *                   message: "At least one file is required"
 *               invalidBucketName:
 *                 summary: Missing or invalid bucketName
 *                 value:
 *                   status: "fail"
 *                   message: "A valid bucketName is required"
 *               invalidResource:
 *                 summary: Missing or invalid resource
 *                 value:
 *                   status: "fail"
 *                   message: "A valid resource is required"
 *               invalidFileType:
 *                 summary: Invalid file type
 *                 value:
 *                   status: "fail"
 *                   message: "Only image and video files are allowed"
 *       429:
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
