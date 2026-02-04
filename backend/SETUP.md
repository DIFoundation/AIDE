# CrisisAid Backend API 🚨

A comprehensive backend API for managing disaster relief resources, emergency alerts, and community submissions during crisis situations.

## 🌟 Features

- **Resource Management**: Track shelters, food banks, medical facilities, water stations, and more
- **Emergency Alerts**: Geographic-based emergency notifications with radius targeting
- **Community Submissions**: Users can submit new resources, updates, and reports
- **User Management**: Role-based access control (Admin, Volunteer, User)
- **Location-Based Search**: Find nearby resources using coordinates
- **Admin Dashboard**: Comprehensive statistics and analytics
- **Input Validation**: Zod-based request validation
- **Row Level Security**: Supabase RLS policies for data protection

## 📋 Prerequisites

- Node.js >= 18.0.0
- Supabase account
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=5000
NODE_ENV=development
```

### 3. Database Setup

1. Go to your Supabase SQL Editor
2. Run the entire `src/supabase/schema.sql` file
3. This will create:
   - All tables (users, resources, alerts, submissions)
   - Indexes for performance
   - RLS policies for security
   - Triggers for auto-updating timestamps
   - Helper functions

### 4. Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 5. Build for Production

```bash
npm run build
npm start
```

## 📚 API Documentation

### Base URL
`http://localhost:5000/api`

### Authentication
Protected routes require a Bearer token:
```
Authorization: Bearer <supabase_jwt_token>
```

---

## 🔐 Authentication Flow

Users authenticate through Supabase Auth. After signup/login, a user profile is automatically created via database trigger.

**Signup Example (Frontend):**
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      name: 'John Doe',
      role: 'USER'
    }
  }
})
```

---

## 📍 Resources API

### `GET /api/resources`
Get all resources with optional filtering

**Query Parameters:**
- `type`: SHELTER | FOOD | MEDICAL | WATER | CLOTHING | OTHER
- `status`: AVAILABLE | LIMITED | UNAVAILABLE | TEMPORARILY_CLOSED
- `verified`: true | false
- `limit`: number (max 100)
- `offset`: number

**Example:**
```bash
GET /api/resources?type=SHELTER&status=AVAILABLE&verified=true&limit=20
```

### `GET /api/resources/search`
Search resources by location

**Query Parameters (required):**
- `latitude`: number
- `longitude`: number
- `radius`: number (km, default: 10)

**Example:**
```bash
GET /api/resources/search?latitude=6.5244&longitude=3.3792&radius=5
```

### `GET /api/resources/:id`
Get specific resource details

### `POST /api/resources` 🔒
Create new resource (authenticated users)

**Request Body:**
```json
{
  "name": "City Emergency Shelter",
  "type": "SHELTER",
  "status": "AVAILABLE",
  "description": "24/7 emergency shelter",
  "capacity": 200,
  "current_occupancy": 45,
  "latitude": 6.5244,
  "longitude": 3.3792,
  "address": "123 Main Street, Lagos",
  "city": "Lagos",
  "country": "Nigeria",
  "phone": "+234 123 456 7890",
  "email": "shelter@example.com",
  "operating_hours": "24/7",
  "notes": "Accepts families"
}
```

### `PUT /api/resources/:id` 🔒
Update resource (admin/volunteer only)

### `PATCH /api/resources/:id/verify` 🔒
Verify resource (admin/volunteer only)

### `DELETE /api/resources/:id` 🔒
Delete resource (admin only)

---

## 🚨 Alerts API

### `GET /api/alerts`
Get all alerts

### `GET /api/alerts/active`
Get only active alerts

### `GET /api/alerts/:id`
Get specific alert

### `GET /api/alerts/location/check`
Check alerts affecting a location

**Query Parameters:**
- `latitude`: number
- `longitude`: number

### `POST /api/alerts` 🔒
Create alert (admin/volunteer only)

**Request Body:**
```json
{
  "title": "Flood Warning",
  "message": "Heavy rainfall expected. Avoid low-lying areas.",
  "severity": "WARNING",
  "latitude": 6.5244,
  "longitude": 3.3792,
  "radius_km": 15,
  "address": "Lagos Island",
  "affected_areas": ["Victoria Island", "Ikoyi", "Lagos Island"],
  "instructions": "Move to higher ground. Emergency shelters open.",
  "start_time": "2025-01-20T08:00:00Z",
  "end_time": "2025-01-20T20:00:00Z"
}
```

**Severity Levels:**
- `INFO`: General information
- `WARNING`: Potential danger
- `DANGER`: Immediate threat
- `CRITICAL`: Severe emergency

### `PUT /api/alerts/:id` 🔒
Update alert (admin/volunteer only)

### `PATCH /api/alerts/:id/deactivate` 🔒
Deactivate alert (admin/volunteer only)

### `DELETE /api/alerts/:id` 🔒
Delete alert (admin only)

---

## 📝 Submissions API

### `GET /api/submissions/my-submissions` 🔒
Get current user's submissions

### `POST /api/submissions` 🔒
Create submission (authenticated users)

**Request Body:**
```json
{
  "type": "NEW_RESOURCE",
  "data": {
    "name": "Community Food Bank",
    "type": "FOOD",
    "latitude": 6.5244,
    "longitude": 3.3792,
    "address": "456 Relief Road"
  }
}
```

**Submission Types:**
- `NEW_RESOURCE`: Submit new resource
- `RESOURCE_UPDATE`: Update existing resource
- `REPORT`: Report issue/information

### `GET /api/submissions` 🔒
Get all submissions (admin/volunteer only)

### `GET /api/submissions/pending` 🔒
Get pending submissions (admin/volunteer only)

### `PATCH /api/submissions/:id/approve` 🔒
Approve submission (admin/volunteer only)

### `PATCH /api/submissions/:id/reject` 🔒
Reject submission (admin/volunteer only)

**Request Body (optional):**
```json
{
  "review_notes": "Reason for rejection"
}
```

---

## 👥 Users API

### `GET /api/users/me` 🔒
Get current user profile

### `PUT /api/users/me` 🔒
Update current user profile

**Request Body:**
```json
{
  "name": "John Doe",
  "organization": "Red Cross",
  "phone": "+234 123 456 7890"
}
```

### `GET /api/users` 🔒
Get all users (admin only)

### `GET /api/users/stats` 🔒
Get user statistics (admin only)

### `PATCH /api/users/:id/role` 🔒
Update user role (admin only)

**Request Body:**
```json
{
  "role": "VOLUNTEER"
}
```

**Roles:**
- `USER`: Default role
- `VOLUNTEER`: Can verify resources and approve submissions
- `ADMIN`: Full access

### `PATCH /api/users/:id/verify` 🔒
Verify user (admin only)

---

## 📊 Dashboard API

### `GET /api/dashboard/stats` 🔒
Get comprehensive statistics (admin/volunteer only)

**Response:**
```json
{
  "resources": {
    "total": 150,
    "verified": 120,
    "available": 100,
    "pendingVerification": 30
  },
  "alerts": {
    "total": 25,
    "active": 5,
    "critical": 1
  },
  "submissions": {
    "total": 200,
    "pending": 15,
    "approved": 170
  },
  "users": {
    "total": 500,
    "verified": 350
  },
  "recentActivity": {
    "submissions": [...],
    "resources": [...]
  }
}
```

### `GET /api/dashboard/resources/distribution` 🔒
Get resource type distribution (admin/volunteer only)

---

## 🔒 User Roles & Permissions

### USER (Default)
- ✅ View verified resources
- ✅ Search resources by location
- ✅ Create submissions
- ✅ View own submissions
- ✅ Update own profile

### VOLUNTEER
- ✅ All USER permissions
- ✅ Create and manage alerts
- ✅ Verify resources
- ✅ Approve/reject submissions
- ✅ View dashboard statistics

### ADMIN
- ✅ All VOLUNTEER permissions
- ✅ Manage users (roles, verification)
- ✅ Delete resources
- ✅ Delete alerts
- ✅ Full system access

---

## 🛡️ Security Features

1. **Row Level Security (RLS)**: Database-level access control
2. **JWT Authentication**: Supabase Auth tokens
3. **Role-Based Authorization**: Middleware-enforced permissions
4. **Input Validation**: Zod schema validation
5. **SQL Injection Protection**: Supabase parameterized queries

---

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.ts         # Supabase client setup
│   ├── controllers/
│   │   ├── alert.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── resource.controller.ts
│   │   ├── submission.controller.ts
│   │   └── user.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/
│   │   ├── alert.routes.ts
│   │   ├── dashboard.routes.ts
│   │   ├── resource.routes.ts
│   │   ├── submission.routes.ts
│   │   └── user.routes.ts
│   ├── services/
│   │   ├── alert.service.ts
│   │   ├── resource.service.ts
│   │   ├── submission.service.ts
│   │   └── user.service.ts
│   ├── supabase/
│   │   └── schema.sql           # Database schema
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   ├── validation/
│   │   └── schemas.ts           # Zod validation schemas
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧪 Testing API Endpoints

Use tools like:
- **Postman** or **Insomnia** for API testing
- **Thunder Client** (VS Code extension)
- **cURL** for command-line testing

**Example cURL:**
```bash
# Get all shelters
curl http://localhost:5000/api/resources?type=SHELTER

# Create resource (with auth)
curl -X POST http://localhost:5000/api/resources \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Shelter","type":"SHELTER"}'
```

---

## 🚀 Deployment Recommendations

1. **Environment Variables**: Never commit `.env` file
2. **Database**: Use Supabase production environment
3. **Hosting**: Deploy on platforms like:
   - Railway
   - Render
   - Heroku
   - AWS/GCP/Azure
4. **CORS**: Configure for your frontend domain
5. **Rate Limiting**: Add rate limiting middleware
6. **Logging**: Implement Winston or similar
7. **Monitoring**: Use Sentry or similar service

---

## 📝 Next Steps

- [ ] Add pagination to all list endpoints
- [ ] Implement rate limiting
- [ ] Add comprehensive logging
- [ ] Write unit and integration tests
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement caching (Redis)
- [ ] Add file upload for resource images
- [ ] Set up CI/CD pipeline
- [ ] Add email notifications for alerts
- [ ] Implement real-time updates (WebSocket)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📄 License

ISC

---

## 💬 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ for disaster relief and emergency response**