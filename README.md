bucc-webapp-admin-backend

## Index

- [Index](#index)
- [Custom Error Handler](#custom-error-handler)
  - [Handler Usage](#handler-usage)
- [Permission System](#permission-system)
  - [Check permission function usage](#check-permission-function-usage)
- [What is left?](#what-is-left)

**Define environmental variables for these**
**IMPORTANT:**

- Database
  - MONGODB_URI
- Redis
  - REDIS_HOST
  - REDIS_PORT
  - REDIS_PASSWORD
- Email
  - EMAIL_USER
  - EMAIL_PASS
- Server
  - PORT
  - JWT_SECRET

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
The system makes use of Attribute Based Access Control - ABAC, which is a model that grants access based on attributes (or characteristics) of the user, the resource, and the environment.

For the current code, the attributes include:

- **User Role:** `admin, super_admin`

- **Resource:** `announcements, users, course_materials, notifications`

- **Actions:** `view, update, delete, create`

- **Scope:** `own, others`

The permissions are defined based on these attributes, allowing for fine-grained control over what actions a user can perform on specific resources. For now, only CRUD actions are specified (view represents read).

**IMPORTANT**: for every **CRUD** operation for the **API - Controller** should use the `checkUserPermission` function in the [Utils folder](./src/utils/controllerUtils.ts) - to ensure the current user has sufficient permission to complete that action.

### Check permission function usage

```Typescript

/**
 * checks if the user has the specified permission and does nothing it he/she has it.
 * 
 * @param {IUser} user - The user object.
 * @param {string} resource - The resource to check permissions for.
 * @param {string} action - The action to check permissions for.
 * @param {'own' | 'others'} scope - The scope of the action (own or others).
 * @param {string | mongoose.Schema.Types.ObjectId} [targetUserId] - The target user ID (optional).
 * 
 * @throws {ErrorHandler} If the user does not have the required permission.
 */
await checkUserPermission(req.user, 'users', 'view', scope, targetUserId);

```
## What is left?

- Controller and routes for course_materials
- Controller and routes for announcements
- Controller, routes and setup of web socket for real-time (if necessary), for notifications
- Testing
- API Documentation using swagger
- Email for the bucc web app
- create/deploy on production server

and many more