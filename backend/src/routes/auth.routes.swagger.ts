// backend/src/routes/auth.routes.swagger.ts
// Add these JSDoc comments to your auth.routes.ts file

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: John Doe
 *               role:
 *                 type: string
 *                 enum: [ADMIN, VOLUNTEER, USER]
 *                 default: USER
 *                 example: USER
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 session:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refresh_token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     expires_at:
 *                       type: number
 *                       example: 1704067200
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/signout:
 *   post:
 *     summary: Sign out current user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Signed out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Signed out successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *                 expires_at:
 *                   type: number
 *       401:
 *         description: Invalid refresh token
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset email sent
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /api/auth/update-password:
 *   post:
 *     summary: Update user password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

// ============================================================
// RESOURCES ROUTES
// ============================================================

/**
 * @swagger
 * /api/resources:
 *   get:
 *     summary: Get all resources with optional filtering
 *     tags: [Resources]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [SHELTER, FOOD, MEDICAL, WATER, CLOTHING, OTHER]
 *         description: Filter by resource type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, LIMITED, UNAVAILABLE, TEMPORARILY_CLOSED]
 *         description: Filter by resource status
 *       - in: query
 *         name: verified
 *         schema:
 *           type: boolean
 *         description: Filter by verification status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           maximum: 100
 *         description: Number of results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: List of resources
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Resource'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /api/resources/search:
 *   get:
 *     summary: Search resources by location
 *     tags: [Resources]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           format: double
 *         example: 6.5244
 *         description: Latitude coordinate
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           format: double
 *         example: 3.3792
 *         description: Longitude coordinate
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 10
 *           maximum: 1000
 *         description: Search radius in kilometers
 *     responses:
 *       200:
 *         description: List of nearby resources sorted by distance
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Resource'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /api/resources/{id}:
 *   get:
 *     summary: Get resource by ID
 *     tags: [Resources]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/resources:
 *   post:
 *     summary: Create a new resource
 *     tags: [Resources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: City Emergency Shelter
 *               type:
 *                 type: string
 *                 enum: [SHELTER, FOOD, MEDICAL, WATER, CLOTHING, OTHER]
 *                 example: SHELTER
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, LIMITED, UNAVAILABLE, TEMPORARILY_CLOSED]
 *                 default: AVAILABLE
 *               description:
 *                 type: string
 *                 example: 24/7 emergency shelter with capacity for 200
 *               capacity:
 *                 type: integer
 *                 example: 200
 *               current_occupancy:
 *                 type: integer
 *                 example: 45
 *               latitude:
 *                 type: number
 *                 format: double
 *                 example: 6.5244
 *               longitude:
 *                 type: number
 *                 format: double
 *                 example: 3.3792
 *               address:
 *                 type: string
 *                 example: 123 Main Street
 *               city:
 *                 type: string
 *                 example: Lagos
 *               country:
 *                 type: string
 *                 example: Nigeria
 *               phone:
 *                 type: string
 *                 example: +234 123 456 7890
 *               email:
 *                 type: string
 *                 format: email
 *                 example: shelter@example.com
 *               operating_hours:
 *                 type: string
 *                 example: 24/7
 *               notes:
 *                 type: string
 *                 example: Accepts families with children
 *     responses:
 *       201:
 *         description: Resource created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/resources/{id}:
 *   put:
 *     summary: Update resource (Admin/Volunteer only)
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [SHELTER, FOOD, MEDICAL, WATER, CLOTHING, OTHER]
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, LIMITED, UNAVAILABLE, TEMPORARILY_CLOSED]
 *               description:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               current_occupancy:
 *                 type: integer
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               operating_hours:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/resources/{id}/verify:
 *   patch:
 *     summary: Verify a resource (Admin/Volunteer only)
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Resource verified successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/resources/{id}:
 *   delete:
 *     summary: Delete a resource (Admin only)
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

// ============================================================
// ALERTS ROUTES
// ============================================================

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Get all alerts
 *     tags: [Alerts]
 *     security: []
 *     responses:
 *       200:
 *         description: List of all alerts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alert'
 */

/**
 * @swagger
 * /api/alerts/active:
 *   get:
 *     summary: Get active alerts only
 *     tags: [Alerts]
 *     security: []
 *     responses:
 *       200:
 *         description: List of active alerts sorted by severity
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alert'
 */

/**
 * @swagger
 * /api/alerts/{id}:
 *   get:
 *     summary: Get alert by ID
 *     tags: [Alerts]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Alert details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alert'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/alerts/location/check:
 *   get:
 *     summary: Check alerts affecting a specific location
 *     tags: [Alerts]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           format: double
 *         example: 6.5244
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           format: double
 *         example: 3.3792
 *     responses:
 *       200:
 *         description: List of alerts affecting this location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alert'
 */

/**
 * @swagger
 * /api/alerts:
 *   post:
 *     summary: Create a new alert (Admin/Volunteer only)
 *     tags: [Alerts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *               - severity
 *             properties:
 *               title:
 *                 type: string
 *                 example: Flood Warning
 *               message:
 *                 type: string
 *                 example: Heavy rainfall expected. Avoid low-lying areas.
 *               severity:
 *                 type: string
 *                 enum: [INFO, WARNING, DANGER, CRITICAL]
 *                 example: WARNING
 *               latitude:
 *                 type: number
 *                 format: double
 *                 example: 6.5244
 *               longitude:
 *                 type: number
 *                 format: double
 *                 example: 3.3792
 *               radius_km:
 *                 type: number
 *                 default: 10
 *                 example: 15
 *               address:
 *                 type: string
 *                 example: Lagos Island
 *               affected_areas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Victoria Island, Ikoyi, Lagos Island]
 *               instructions:
 *                 type: string
 *                 example: Move to higher ground. Emergency shelters are open.
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Alert created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/alerts/{id}:
 *   put:
 *     summary: Update an alert (Admin/Volunteer only)
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               severity:
 *                 type: string
 *                 enum: [INFO, WARNING, DANGER, CRITICAL]
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               radius_km:
 *                 type: number
 *               address:
 *                 type: string
 *               affected_areas:
 *                 type: array
 *                 items:
 *                   type: string
 *               instructions:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Alert updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/alerts/{id}/deactivate:
 *   patch:
 *     summary: Deactivate an alert (Admin/Volunteer only)
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Alert deactivated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/alerts/{id}:
 *   delete:
 *     summary: Delete an alert (Admin only)
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Alert deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

// ============================================================
// SUBMISSIONS ROUTES
// ============================================================

/**
 * @swagger
 * /api/submissions/my-submissions:
 *   get:
 *     summary: Get current user's submissions
 *     tags: [Submissions]
 *     responses:
 *       200:
 *         description: List of user's submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Submission'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/submissions:
 *   get:
 *     summary: Get all submissions (Admin/Volunteer only)
 *     tags: [Submissions]
 *     responses:
 *       200:
 *         description: List of all submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Submission'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/submissions/pending:
 *   get:
 *     summary: Get pending submissions (Admin/Volunteer only)
 *     tags: [Submissions]
 *     responses:
 *       200:
 *         description: List of pending submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Submission'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/submissions:
 *   post:
 *     summary: Create a new submission
 *     tags: [Submissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - data
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [NEW_RESOURCE, RESOURCE_UPDATE, REPORT]
 *                 example: NEW_RESOURCE
 *               resource_id:
 *                 type: string
 *                 format: uuid
 *                 description: Required for RESOURCE_UPDATE type
 *               data:
 *                 type: object
 *                 description: Flexible JSON data for the submission
 *                 example:
 *                   name: Community Food Bank
 *                   type: FOOD
 *                   latitude: 6.5244
 *                   longitude: 3.3792
 *                   address: 456 Relief Road
 *     responses:
 *       201:
 *         description: Submission created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/submissions/{id}/approve:
 *   patch:
 *     summary: Approve a submission (Admin/Volunteer only)
 *     tags: [Submissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Submission approved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/submissions/{id}/reject:
 *   patch:
 *     summary: Reject a submission (Admin/Volunteer only)
 *     tags: [Submissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               review_notes:
 *                 type: string
 *                 example: Incomplete information provided
 *     responses:
 *       200:
 *         description: Submission rejected successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

// ============================================================
// USERS ROUTES
// ============================================================

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               organization:
 *                 type: string
 *                 example: Red Cross
 *               phone:
 *                 type: string
 *                 example: +234 123 456 7890
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Get user statistics (Admin only)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 500
 *                 verified:
 *                   type: integer
 *                   example: 350
 *                 admins:
 *                   type: integer
 *                   example: 5
 *                 volunteers:
 *                   type: integer
 *                   example: 50
 *                 users:
 *                   type: integer
 *                   example: 445
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Update user role (Admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, VOLUNTEER, USER]
 *                 example: VOLUNTEER
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/users/{id}/verify:
 *   patch:
 *     summary: Verify a user (Admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User verified successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

// ============================================================
// DASHBOARD ROUTES
// ============================================================

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get comprehensive dashboard statistics (Admin/Volunteer only)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resources:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 150
 *                     verified:
 *                       type: integer
 *                       example: 120
 *                     available:
 *                       type: integer
 *                       example: 100
 *                     pendingVerification:
 *                       type: integer
 *                       example: 30
 *                 alerts:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     active:
 *                       type: integer
 *                       example: 5
 *                     critical:
 *                       type: integer
 *                       example: 1
 *                 submissions:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 200
 *                     pending:
 *                       type: integer
 *                       example: 15
 *                     approved:
 *                       type: integer
 *                       example: 170
 *                 users:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 500
 *                     verified:
 *                       type: integer
 *                       example: 350
 *                 recentActivity:
 *                   type: object
 *                   properties:
 *                     submissions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Submission'
 *                     resources:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Resource'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/dashboard/resources/distribution:
 *   get:
 *     summary: Get resource type distribution (Admin/Volunteer only)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Resource distribution by type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: integer
 *               example:
 *                 SHELTER: 50
 *                 FOOD: 40
 *                 MEDICAL: 30
 *                 WATER: 20
 *                 CLOTHING: 10
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */