# Swagger API Documentation Setup Guide

Complete guide for implementing Swagger/OpenAPI documentation in the CrisisAid Backend API.

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Integration Steps](#integration-steps)
- [Accessing Documentation](#accessing-documentation)
- [Features](#features)
- [Customization](#customization)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## 🚀 Installation

### Step 1: Install Dependencies

```bash
cd backend

# Install Swagger dependencies
npm install swagger-jsdoc swagger-ui-express

# Install TypeScript types
npm install -D @types/swagger-jsdoc @types/swagger-ui-express
```

### Step 2: Update package.json

Ensure your `package.json` has a version field:

```json
{
  "name": "backend",
  "version": "1.0.0",
  ...
}
```

## ⚙️ Configuration

### Step 3: Create Swagger Configuration

Create `backend/src/config/swagger.ts`:

```typescript
import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CrisisAid API Documentation',
      version: version,
      description: 'Comprehensive API for disaster relief management',
      contact: {
        name: 'CrisisAid Support',
        url: 'https://github.com/yourusername/crisisaid',
        email: 'support@crisisaid.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
```

## 🔧 Integration Steps

### Step 4: Update app.ts

Modify `backend/src/app.ts` to include Swagger:

```typescript
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "CrisisAid API Documentation"
}));

// Swagger JSON endpoint
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Root endpoint with documentation link
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CrisisAid API",
    version: "1.0.0",
    documentation: "/api-docs"
  });
});

// ... rest of your routes
```

### Step 5: Add JSDoc Comments to Routes

Add comprehensive JSDoc comments to your route files. Example for `auth.routes.ts`:

```typescript
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
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post("/signup", validateBody(signUpSchema), signUp);
```

Copy all swagger documentation comments from the provided artifacts to their respective route files.

## 🌐 Accessing Documentation

### Development

1. Start your server:
```bash
npm run dev
```

2. Access Swagger UI:
```
http://localhost:5000/api-docs
```

3. Access OpenAPI JSON spec:
```
http://localhost:5000/api-docs.json
```

### Testing Endpoints

1. Click **"Authorize"** button in Swagger UI
2. Enter your JWT token: `Bearer <your_token>`
3. Click **"Authorize"** to save
4. Navigate to any endpoint
5. Click **"Try it out"**
6. Fill in parameters
7. Click **"Execute"**

## ✨ Features

### Available Features

- ✅ **Interactive API Documentation** - Test endpoints directly from browser
- ✅ **Authentication** - Built-in Bearer token authentication
- ✅ **Request/Response Examples** - See example payloads for all endpoints
- ✅ **Schema Validation** - View request/response schemas
- ✅ **Tag Organization** - Endpoints grouped by feature (Auth, Resources, etc.)
- ✅ **Search & Filter** - Find endpoints quickly
- ✅ **Download OpenAPI Spec** - Export as JSON for other tools
- ✅ **Multiple Server Support** - Switch between dev/staging/prod
- ✅ **Dark Mode Support** - Automatic theme detection

### Endpoint Coverage

All endpoints are documented with:
- Summary and description
- Required authentication
- Request parameters (path, query, body)
- Request/response schemas
- HTTP status codes
- Example values
- Validation rules

## 🎨 Customization

### Custom Styling

Create `backend/src/config/swagger.options.ts`:

```typescript
export const swaggerUIOptions = {
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #2563eb; }
  `,
  customSiteTitle: "CrisisAid API Docs",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    syntaxHighlight: {
      activate: true,
      theme: "monokai"
    }
  }
};
```

Update app.ts:
```typescript
import { swaggerUIOptions } from "./config/swagger.options";
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUIOptions));
```

### Environment-Specific Servers

Update `swagger.ts`:

```typescript
const servers = process.env.NODE_ENV === 'production' 
  ? [{
      url: process.env.API_URL || 'https://api.crisisaid.com',
      description: 'Production server'
    }]
  : [
      { url: 'http://localhost:5000', description: 'Development' },
      { url: 'https://staging.crisisaid.com', description: 'Staging' },
      { url: 'https://api.crisisaid.com', description: 'Production' }
    ];
```

## 🔒 Production Deployment

### Security Considerations

#### Option 1: Basic Authentication

```bash
npm install express-basic-auth
npm install -D @types/express-basic-auth
```

```typescript
import basicAuth from 'express-basic-auth';

const swaggerAuth = basicAuth({
  users: { 
    'admin': process.env.SWAGGER_PASSWORD || 'changeme' 
  },
  challenge: true
});

app.use("/api-docs", swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

#### Option 2: Disable in Production

```typescript
if (process.env.NODE_ENV !== 'production') {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
```

#### Option 3: IP Whitelist

```typescript
const allowedIPs = ['127.0.0.1', '::1', 'your-office-ip'];

app.use("/api-docs", (req, res, next) => {
  const clientIP = req.ip;
  if (allowedIPs.includes(clientIP)) {
    next();
  } else {
    res.status(403).send('Access denied');
  }
}, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Update API server URLs
- [ ] Add authentication to /api-docs (if needed)
- [ ] Enable CORS for specific domains
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Add API versioning
- [ ] Configure CDN for static assets

## 🔄 Export to Other Tools

### Postman Collection

1. Download OpenAPI spec: `http://localhost:5000/api-docs.json`
2. Open Postman → Import → Raw Text
3. Paste JSON content
4. Import as Postman Collection

### Insomnia

1. Download OpenAPI spec
2. Insomnia → Import/Export → Import Data
3. Select the JSON file

### Code Generation

Generate client SDKs using OpenAPI Generator:

```bash
# Install OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Generate TypeScript client
openapi-generator-cli generate \
  -i http://localhost:5000/api-docs.json \
  -g typescript-axios \
  -o ./client-sdk
```

## 🐛 Troubleshooting

### Issue: Swagger UI not loading

**Solution:**
```typescript
// Ensure swagger is loaded before other routes
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerSpec));
```

### Issue: JSDoc comments not appearing

**Solution:**
- Verify `apis` path in swagger.ts matches your route files
- Ensure comments use `/** @swagger */` syntax
- Check for syntax errors in YAML within comments

### Issue: Authorization not working

**Solution:**
```typescript
// Add security to individual endpoints
/**
 * @swagger
 * /api/resources:
 *   post:
 *     security:
 *       - bearerAuth: []
 */
```

### Issue: Schema not displaying correctly

**Solution:**
- Verify schema definitions in `components.schemas`
- Use `$ref` correctly: `$ref: '#/components/schemas/User'`
- Check YAML indentation

## 📚 Additional Resources

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc GitHub](https://github.com/Surnet/swagger-jsdoc)
- [OpenAPI Best Practices](https://swagger.io/blog/api-design/openapi-best-practices/)

## 🤝 Contributing

To add documentation for new endpoints:

1. Add JSDoc comment above route definition
2. Follow existing comment structure
3. Include all parameters and responses
4. Add examples for complex schemas
5. Test in Swagger UI
6. Update this README if needed

## 📝 Notes

- Swagger spec is generated at runtime from JSDoc comments
- Changes to comments require server restart in production
- Large APIs may need pagination in Swagger UI
- Consider splitting docs into multiple files for very large APIs
- Keep examples realistic and helpful

---

**Need Help?** Check the [troubleshooting section](#troubleshooting) or open an issue on GitHub.