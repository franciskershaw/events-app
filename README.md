# Organisey - Frontend

![Organisey](/public/amiresponsive.png)

Oraganisy is a calendar and event management application designed to bring clarity to your schedule. The app helps you categorise and manage your events intuitively, making it easy to see when you're actually free. Perfect for both personal use and collaboratively - sync your calendar another user to get shared visibility of your schedules, helping you plan together.

This repository is in relation to the user interface layer of the application written in React, Typescript, and Tailwind. The backend API layer is stored in [this repository](https://github.com/franciskershaw/events-api), and the live website can be found [here](https://www.organisey.co.uk/).

## 📋 Core Functionality

- Advanced event categorisation and filtering
- Mobile-optimised list view for upcoming events
- Shared calendar capabilities for viewing other consenting users' events
- Multi-view calendar interface
- Cross-device synchronisation

## 🔧 Technical Implementation

- React (v18) with TypeScript
- Component architecture using ShadCN/Radix UI primitives
- Responsive layouts with Tailwind CSS
- Form validation using React Hook Form and Zod
- Data management with TanStack Query
- Date operations with date-fns and Day.js
- Motion feedback with Framer Motion
- System notifications via Sonner
- Route management with React Router
- Unit tests with Vitest

## 🛠️ Tech Stack

- **Frontend Framework:** React 18.3
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN/Radix UI
- **Server State Management:** TanStack Query
- **Client State Management:** React Context
- **Form Management:** React Hook Form
- **Validation:** Zod
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Animation:** Framer Motion

## 🏃‍♂️ Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `VITE_API_URL` variable in `.env.local` - this should point to the localhost port your corresponding api is running on
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:ui` - Open tests in UI mode with detailed reporting

## 🌳 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── contexts/      # React context providers
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── types/         # TypeScript type definitions
├── constants/     # Application constants
└── tanstackQuery/ # Query configurations and mutations
```

## 📱 Interface Features

- Responsive grid and list views
- System-aware theme switching
- WCAG-compliant components
- Event filtering and categorization
- Real-time notifications
- Form validation
- Interactive calendar selection

## 📝 Development Guidelines

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Import sorting with @ianvs/prettier-plugin-sort-imports
- Modular component architecture
- Mobile-first responsive design

## 🔒 Environment Variables

Required environment variables for `.env.local`:

```
VITE_API_URL=your_api_url
```

## 📄 License

Private repository - All rights reserved
