# CrisisAid Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A real-time, location-based web platform that helps people quickly find verified emergency resources—shelters, food, medical aid, water, and power—during crises.

## 🌟 Features

- **Interactive Map**: Real-time visualization of emergency resources
- **Resource Categories**: Filter by shelter, food, medical aid, water, and more
- **Verified Information**: All resources are verified by trusted organizations
- **Mobile-First Design**: Works seamlessly on all devices
- **Dark/Light Mode**: Built-in theme support
- **Accessibility**: WCAG compliant components

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or later
- npm or pnpm
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/crisisaid-frontend.git
   cd crisisaid-frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Update the environment variables in .env.local
   ```

4. Run the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Maps**: [Leaflet](https://leafletjs.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Testing**: [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/)

## 📁 Project Structure

```
frontend/
├── public/             # Static files
├── src/
│   ├── app/            # App router pages
│   ├── components/     # Reusable components
│   ├── lib/            # Utility functions
│   ├── styles/         # Global styles
│   └── types/          # TypeScript type definitions
├── .eslintrc.json      # ESLint config
├── .gitignore
├── next.config.js      # Next.js config
├── package.json
└── tsconfig.json      # TypeScript config
```

## 🌐 API Integration

The frontend communicates with the CrisisAid backend API. Make sure the backend service is running and properly configured in your environment variables.

## 🧪 Testing

Run the test suite:

```bash
pnpm test
# or
npm test
```

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fcrisisaid-frontend)

1. Push your code to a GitHub repository
2. Import the repository on Vercel
3. Add your environment variables
4. Deploy!

### Other Platforms

You can also deploy to other platforms like Netlify, AWS Amplify, or any static hosting service that supports Next.js.

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
- Our wonderful contributors
- The CrisisAid team for their hard work and dedication

---

Made with ❤️ by the CrisisAid Team

One-line pitch

A real-time, location-based web platform that helps people quickly find verified emergency resources—shelters, food, medical aid, water, and power—during crises.

1️⃣ Core Problem (What judges must instantly get)

During emergencies (floods, protests, blackouts, disasters), people:

Don’t know where to find help

Can’t verify which resources are available

Waste critical time searching unreliable information

CrisisAid solves this by centralizing verified, location-based emergency resources in one fast, mobile-friendly map.
