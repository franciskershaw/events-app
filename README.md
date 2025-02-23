# Organisey - Frontend

A calendar and event management application built with React, TypeScript, and Vite. The application focuses on event categorization, enhanced mobile visibility, and collaborative features for shared calendars.

## 📋 Core Functionality

- Advanced event categorization and filtering
- Mobile-optimized list view for upcoming events
- Shared calendar capabilities for viewing others' events
- Multi-view calendar interface
- Cross-device synchronization

## 🔧 Technical Implementation

- React (v18) with TypeScript
- Component architecture using Radix UI primitives
- Responsive layouts with Tailwind CSS
- Form validation using React Hook Form and Zod
- Data management with TanStack Query
- Date operations with date-fns and Day.js
- Motion feedback with Framer Motion
- System notifications via Sonner
- Theme adaptation with next-themes
- Route management with React Router

## 🛠️ Tech Stack

- **Frontend Framework:** React 18.3
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **State Management:** TanStack Query
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
3. Configure environment variables in `.env.local`
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

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
