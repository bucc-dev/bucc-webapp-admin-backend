# bucc-webapp-admin-backend

BUCC webapp admin backend

**Define environmental variables for these**
**IMPORTANT:**

- Database
  - MONGODB_URI
- Server
  - PORT
  - JWT_SECRET

## Custom Error Handler

The custom error handler consists of two main components:

1. **ErrorHandler** class - Extends the built-in `Error` class and includes an additional `statusCode` property. This class is used to create custom error instances with a specific status code and message.

2. **handleError** function - Intercepts errors as middleware and returns a standardized error format to the client, e.g., `{"status": "fail", "message": "login required"}`.

### Usage

Use the `ErrorHandler` class to create custom errors with a status code and message.

```typescript
import { ErrorHandler } from './middleware/errorHandler';

// Example usage with throw
throw new ErrorHandler(400, 'Invalid email or password');

// Example usage with next
next(new ErrorHandler(401, 'Login required'));
