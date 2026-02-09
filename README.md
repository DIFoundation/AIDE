# 🌍 AIDE - Emergency Resource Management Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

AIDE is a real-time, location-based platform that helps people quickly find verified emergency resources—shelters, food, medical aid, water, and power—during crises.

## 🌟 Features

### 🗺️ Interactive Map
- Real-time visualization of emergency resources
- Filter by resource type (shelter, food, medical, etc.)
- Location-based search and navigation

### 🚨 Emergency Alerts
- Real-time notifications for critical situations
- Severity-based alert system
- Location-aware alert distribution

### 📱 Mobile-First Design
- Responsive interface for all devices
- Offline capabilities for low-connectivity scenarios
- Fast, app-like experience

### 🔒 Secure & Reliable
- JWT authentication
- Role-based access control
- Data encryption in transit and at rest

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or later
- npm or pnpm
- Git
- Supabase account (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DIFoundation/AIDE.git
   cd AIDE
   ```

2. **Set up the backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your Supabase credentials
   pnpm install
   pnpm migrate:up
   pnpm dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   cp .env.example .env
   # Update API endpoints in .env
   pnpm install
   pnpm dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/v1
   - API Docs: http://localhost:5000/api-docs

## 🏗️ Project Structure

```
AIDE/
├── backend/           # Backend API server
│   ├── src/           # Source code
│   ├── tests/         # Backend tests
│   └── migrations/    # Database migrations
├── frontend/          # Next.js frontend
│   ├── public/        # Static files
│   ├── src/           # Source code
│   └── tests/         # Frontend tests
└── docs/              # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet with React-Leaflet
- **State Management**: React Context + Zustand
- **UI Components**: shadcn/ui
- **Testing**: Jest, React Testing Library

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest

## 🌐 API Documentation

Once the backend is running, access the interactive API documentation at:

- **Swagger UI**: `http://localhost:5000/api-docs`
- **OpenAPI JSON**: `http://localhost:5000/api-docs.json`

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
pnpm test
```

### Backend Tests
```bash
cd backend
pnpm test
```

## 🚀 Deployment

### Prerequisites
- Docker and Docker Compose
- Production database
- Configured environment variables

### Using Docker Compose (Recommended)

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   # Update with production values
   ```

2. Start the services:
   ```bash
   docker-compose up -d --build
   ```

3. Access the application:
   - Frontend: http://your-domain.com
   - Backend API: http://your-domain.com/api/v1

### Manual Deployment

See individual READMEs for detailed deployment instructions:
- [Frontend Deployment](/frontend/README.md#deployment)
- [Backend Deployment](/backend/README.md#deployment)

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- All the amazing open-source projects that made this possible
- Our wonderful contributors and community
- First responders and humanitarian workers worldwide

---

🌍 Made with Empathy by the AIDE Team  
🚀 Building technology for a safer tomorrow