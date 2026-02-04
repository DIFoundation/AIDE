# CrisisAid Backend API

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)

A robust, scalable backend API for CrisisAid, managing disaster relief resources, emergency alerts, and community submissions with real-time capabilities.

## Features

- **RESTful API** for managing resources, users, and alerts
- **Real-time updates** using WebSockets
- **JWT Authentication** with role-based access control
- **File uploads** for resource images and documents
- **Input validation** using Joi
- **Rate limiting** for API endpoints
- **Comprehensive error handling**
- **Documentation** with Swagger/OpenAPI

## Quick Start

### Prerequisites

- Node.js 18.0.0 or later
- npm or pnpm
- Supabase account
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/crisisaid-backend.git
   cd crisisaid-backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Supabase
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_JWT_SECRET=your_jwt_secret
   
   # API
   API_PREFIX=/api/v1
   CORS_ORIGIN=http://localhost:3000
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=15*60*1000  # 15 minutes
   RATE_LIMIT_MAX=100  # Limit each IP to 100 requests per window
   ```

4. Run database migrations:
   ```bash
   pnpm migrate:up
   ```

5. Start the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. The API will be available at `http://localhost:5000/api/v1`

## Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: [JWT](https://jwt.io/)
- **Validation**: [Joi](https://joi.dev/)
- **Testing**: [Jest](https://jestjs.io/), [Supertest](https://github.com/visionmedia/supertest)
- **Documentation**: [Swagger/OpenAPI](https://swagger.io/)

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middlewares/    # Custom middlewares
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── app.ts          # Express application
│   └── server.ts       # Server startup
├── tests/             # Test files
├── migrations/        # Database migrations
├── .env.example      # Environment variables example
├── package.json
└── tsconfig.json    # TypeScript configuration
```

## API Documentation

Once the server is running, you can access the API documentation at:

- **Swagger UI**: `http://localhost:5000/api-docs`
- **OpenAPI JSON**: `http://localhost:5000/api-docs.json`

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

## Deployment

### Prerequisites

- Docker and Docker Compose
- Production database
- Environment variables set

### Using Docker

1. Build the Docker image:
   ```bash
   docker build -t crisisaid-backend .
   ```

2. Run the container:
   ```bash
   docker run -p 5000:5000 --env-file .env crisisaid-backend
   ```

### Using PM2 (Production)

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Start the application:
   ```bash
   NODE_ENV=production pm2 start dist/server.js --name crisisaid-backend
   ```

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- All the amazing open-source projects that made this possible
- Our wonderful contributors
- The CrisisAid team for their hard work and dedication

---

Made with ❤️ by the CrisisAid Team

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Then fill in your Supabase credentials:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=5000
NODE_ENV=development
```

### 2. Database Setup

Run the SQL schema in your Supabase SQL editor:

```bash
backend/src/supabase/schema.sql
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The API will run on `http://localhost:5000`

### 5. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Resources

- `GET /api/resources` - Get all resources (supports filtering: ?type=SHELTER&status=AVAILABLE&verified=true)
- `GET /api/resources/search?latitude=X&longitude=Y&radius=10` - Search resources by location
- `GET /api/resources/:id` - Get resource by ID
- `POST /api/resources` - Create resource (auth required)
- `PUT /api/resources/:id` - Update resource (admin/volunteer only)
- `PATCH /api/resources/:id/verify` - Verify resource (admin/volunteer only)
- `DELETE /api/resources/:id` - Delete resource (admin only)

### Alerts

- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/active` - Get active alerts only
- `GET /api/alerts/:id` - Get alert by ID
- `POST /api/alerts` - Create alert (admin only)
- `PUT /api/alerts/:id` - Update alert (admin only)
- `PATCH /api/alerts/:id/deactivate` - Deactivate alert (admin only)
- `DELETE /api/alerts/:id` - Delete alert (admin only)

### Submissions

- `GET /api/submissions` - Get all submissions (admin/volunteer only)
- `GET /api/submissions/pending` - Get pending submissions (admin/volunteer only)
- `GET /api/submissions/my-submissions` - Get current user's submissions (auth required)
- `POST /api/submissions` - Create submission (auth required)
- `PATCH /api/submissions/:id/approve` - Approve submission (admin/volunteer only)
- `PATCH /api/submissions/:id/reject` - Reject submission (admin/volunteer only)

### Users

- `GET /api/users/me` - Get current user profile (auth required)
- `PUT /api/users/me` - Update current user (auth required)
- `GET /api/users` - Get all users (admin only)
- `PATCH /api/users/:id/role` - Update user role (admin only)
- `PATCH /api/users/:id/verify` - Verify user (admin only)

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_supabase_token>
```

You can get this token from Supabase Auth (sign up/login flow).

## User Roles

- `USER` - Default role, can view resources and create submissions
- `VOLUNTEER` - Can verify resources and approve submissions
- `ADMIN` - Full access to all operations

## Next Steps

1. Set up Supabase Auth for user registration/login
2. Configure Row Level Security (RLS) policies in Supabase
3. Add input validation using libraries like `zod` or `joi`
4. Implement rate limiting
5. Add logging (Winston/Morgan)
6. Set up testing (Jest/Supertest)
7. Add API documentation (Swagger/OpenAPI)

## Notes

- The location search uses a simplified distance calculation. For production, consider using PostGIS or a dedicated geospatial service.
- Make sure to enable CORS for your frontend domain in production.
- Consider adding pagination for list endpoints in production.