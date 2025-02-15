/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: >
 *       Registers a new user with the required fields. If registration is successful, an OTP is sent to the provided email.
 *       Rate limited to 5 requests per minute.
 *     tags:
 *       - Auth
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
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@student.babcock.edu.ng"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *               role:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - super_admin
 *                   - student
 *                 example: "student"
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *               - role
 *     responses:
 *       201:
 *         description: User registered successfully and OTP sent.
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
 *                   example: "An OTP has been sent to your email"
 *       400:
 *         description: Missing required fields or invalid role.
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
 *                   example: "firstname is missing"
 *       409:
 *         description: Email has already been used.
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
 *                   example: "Email has already been used"
 *       429:
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
