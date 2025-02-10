bucc-webapp-admin-backend

## Index

- [Index](#index)
- [Custom Error Handler](#custom-error-handler)
  - [Handler Usage](#handler-usage)
- [Permission System](#permission-system)
  - [Check permission function usage](#check-permission-function-usage)
- [Authentication Middleware (authMiddleware)](#authentication-middleware-authmiddleware)
  - [Key Features](#key-features)
  - [Usage Example](#usage-example)
  - [Flow Overview](#flow-overview)
- [File Upload Middleware (upload)](#file-upload-middleware-upload)
  - [Key Feature](#key-feature)
  - [Upload Usage Example](#upload-usage-example)
  - [Configuration Details](#configuration-details)
- [What is left?](#what-is-left)

## Custom Error Handler

The custom error handler consists of two main components:

1. **ErrorHandler** class - Extends the built-in `Error` class and includes an additional `statusCode` property. This class is used to create custom error instances with a specific status code and message.

2. **handleError** function - Intercepts errors as middleware and returns a standardized error format to the client, e.g., `{"status": "fail", "message": "login required"}`.

### Handler Usage

Use the `ErrorHandler` class to create custom errors with a status code and message.

```Typescript
import { ErrorHandler } from './middleware/errorHandler';

// Example usage with throw
throw new ErrorHandler(400, 'Invalid email or password');

// Example usage with next
next(new ErrorHandler(401, 'Login required'));
```

## Permission System

[config file](./src/config/roleConfig.ts)
The system makes use of Attribute Based Access Control (ABAC), which is a model that grants access based on attributes (or characteristics) of the user. it is also mixed with Role Based Access control as it also sets default permissions depending on your role.

For the current code, the attributes include:

- **User Role:** `student, admin, super_admin`

- **Resource:** `announcements, users, course_materials`

- **Actions:** `read, update, delete, create`

- **Scope:** `own, others`

The permissions are defined based on these attributes, allowing for fine-grained control over what actions a user can perform on specific resources. For now, only CRUD actions are specified.

**IMPORTANT**: for every **CRUD** operation for the **API - Controller** should use the `checkUserPermission` function in the [Utils folder](./src/utils/controllerUtils.ts) - to ensure the current user has sufficient permission to complete that action.

### Check permission function usage

```Typescript
import { checkUserPermission } from '../utils/controllerUtils';

/**
 * checks if the user has the specified permission and does nothing it he/she has it.
 * It is used for controller functions
 *
 * @param {IUser} user - The user object.
 * @param {string} resource - The resource to check permissions for.
 * @param {string} action - The action to check permissions for.
 * @param {string | mongoose.Schema.Types.ObjectId} [resourceOwnerId] - The ID of the resource owner (optional).
 *
 * @throws {ErrorHandler} If the user does not have the required permission.
 */

// setting resourceOwnerId implies: scope = 'others' - implying the authenticated user does not own the target resource for CRUD operations
await checkUserPermission(req.user, 'users', 'read', targetUserId);

// scope = 'own'
await checkUserPermission(req.user, 'users', 'read');

```

## Authentication Middleware (authMiddleware)

The [authMiddleware](./src/middleware/authMiddleware.ts) is a secure authentication layer that verifies JWT tokens and attaches authenticated user data to the request object. It integrates with Redis caching for performance optimization and token blacklisting.

### Key Features

- **JWT Verification:** Validates access tokens using environment-secured secret

- **Redis Caching:** Stores user data in Redis for quick retrieval of the same user

- **Token Blacklisting:** Checks for revoked tokens

- **Account Verification:** Ensures accounts are verified before access

- **Error Handling:** Provides clear error messages for various auth failures

### Usage Example

```Typescript
import { authMiddleware } from './middleware/auth';

router.route('/protected')
  .get(
    authMiddleware,  // Verify authentication
    controller.handler // Protected route handler
  );
```

### Flow Overview

Extracts access token from cookies

Verifies token signature and expiration

Checks Redis cache for user data

if not found in cache, Falls back to database and stores in cache upon successful retreival

Attaches user data to Request object i.e `req.user`

returns `next` to move forward

Handles various error scenarios

## File Upload Middleware (upload)

The upload middleware handles direct streaming of files to Cloudflare R2 storage using multer-S3. It enforces validation checks before allowing file uploads to proceed.

### Key Feature

**Direct Stream to Bucket:** Files are streamed directly to R2 storage without intermediate local disk or in-memory storage because of limited server resources.

[**Custom File Upload Restrictions:**](./src/middleware/upload.ts)

- Only allows image/video files (MIME types starting with image/ or video/) for announcements
- Requires valid bucketName in request body
- Requires valid resource type in request body
- Verifies user has `create` permissions for the specified resource
- At least one file is required

Add reestrictions as needed

### Upload Usage Example

```Typescript
import { upload } from './middleware/upload';

announcementRouter.route('/')
  .post(
    authMiddleware,          // First authenticate user
    moderateRateLimiter,     // Apply rate limiting as needed
    upload.array('file', 3), // Process up to 3 files in 'file' field, i think it can be set to infinity.
    announcementController.postAnnouncement // Handle business logic
  );
```

### Configuration Details

- **Storage:** Uses Cloudflare R2 via AWS S3 SDK

- **Access Control List (ACL):** All files uploaded as private <!-- url need to be signed before it can be viewed. -->

- **Naming:** Auto-generates unique filenames using `Date.now()-file.originalname`

- **Content Type:** Preserves original MIME type detection

## What is left?

- add guard to scan files for virus before any upload
- Controller and routes for course_materials
- setup of web socket for real-time (if necessary), for notifications
- Testing
- API Documentation using swagger
- Email for the bucc web app

and many more.
