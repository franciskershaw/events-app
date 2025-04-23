# Organisey - Frontend

![Organisey](/public/amiresponsive.png)

Organisey is a calendar and event management application designed to bring clarity to your schedule. The app helps you categorise and manage your events intuitively, making it easy to see when you're actually free. Perfect for both personal use and collaboratively - sync your calendar with another user to get shared visibility of your schedules, helping you plan together.

This repository contains the user interface layer of the application written in React, TypeScript, and Tailwind. The backend API layer is stored in [this repository](https://github.com/franciskershaw/events-api), and the live website can be found [here](https://www.organisey.co.uk/).

## ✨ Key Features

- **Smart Event Management**: Create, edit, copy, and delete events with an intuitive interface
- **Event Categorisation**: Organise events by type (Work, Holiday, Birthday, Dinner, etc.) with visual icon indicators
- **Free Time Visibility**: Easily identify when you're available with clear visual indicators
- **Connection System**: Connect with partners or friends to share and view each other's calendars
- **Multi-View Calendar**: Toggle between different calendar views to suit your planning style
- **Event Sharing**: Share event details with others via your preferred messaging apps
- **Authentication Options**: Log in with Google or use email/password authentication
- **Responsive Design**: Optimised for both desktop and mobile devices with specialised views
- **Accessibility**: WCAG-compliant components for an inclusive user experience
- **Real-Time Notifications**: Immediate feedback on actions with Sonner toast notifications

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
- Event filtering and categorisation
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

## 📱 Screenshots

![mobile](/public/screenshot1.png)
![mobile with filters](/public/screenshot2.png)
![desktop](/public/screenshot3.png)

## 🚀 Deployment

The application is deployed using [your deployment platform] and follows a CI/CD pipeline with [any relevant details]. The production version can be accessed at [https://www.organisey.co.uk/](https://www.organisey.co.uk/).

## 🔄 Future Enhancements

- Bug fixes
- Recurring events
- Notifications / reminders
- Access to past events data

## 🎨 Colour

...
