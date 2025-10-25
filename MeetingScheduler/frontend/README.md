# Meeting Scheduler - Frontend

A modern, feature-rich meeting scheduler application built with Next.js 14, React 18, and TypeScript. This application provides an intuitive interface for managing meetings, booking rooms, and scheduling events with drag-and-drop functionality.

## 🚀 Features

### 📅 Calendar Management
- **Interactive Calendar View**: Month, week, and day views with seamless navigation
- **Drag & Drop Rescheduling**: Intuitively move meetings to different dates
- **Event Creation**: Quick meeting creation with modal forms
- **Event Details**: View comprehensive meeting information
- **Edit & Delete**: Full CRUD operations for calendar events
- **Real-time Updates**: Instant UI updates with optimistic rendering

### 📋 Meetings Page
- **Complete CRUD Operations**: Create, read, update, and delete meetings
- **Advanced Search**: Search meetings by title, description, or room
- **Status Filtering**: Filter by scheduled, completed, or cancelled status
- **Inline Editing**: Edit meetings directly from the list view
- **Bulk Management**: Manage multiple meetings efficiently
- **Empty State Handling**: Clear visual feedback when no meetings match filters

### 🏢 Rooms Management
- **Room Browsing**: View all available meeting rooms with details
- **Multi-criteria Search**: Search by name, location, or equipment
- **Availability Filtering**: Filter rooms by current availability status
- **Capacity Filtering**: Filter by room size (small, medium, large)
- **Room Booking**: Book rooms with integrated booking modal
- **Dynamic Statistics**: Real-time stats showing filtered vs total rooms
- **Equipment Lists**: View available equipment for each room

### 🎨 User Experience
- **Toast Notifications**: Real-time feedback for all user actions
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile
- **Accessible Components**: Built with Radix UI primitives for accessibility
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: Graceful error messages and recovery options
- **Dark Mode Ready**: Theme-aware components (when implemented)

## 🛠️ Technology Stack

### Core Framework
- **Next.js 14**: React framework with App Router
- **React 18.2**: UI library with latest features
- **TypeScript 5.0**: Type-safe development

### State Management & Data Fetching
- **Zustand 4.4**: Lightweight state management
- **TanStack Query v5.0**: Server state management and caching

### UI & Styling
- **Tailwind CSS 3.3**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
  - Dialog, Select, Slot components
- **Lucide React**: Modern icon library
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional class utilities

### Drag & Drop
- **@dnd-kit**: Modern drag and drop toolkit
  - Core, Sortable, and Utilities packages

### Notifications
- **Sonner 2.0**: Beautiful toast notifications

### Form Management
- **React Hook Form**: Performant form handling
- **Zod**: Schema validation

### Date Handling
- **date-fns 2.30**: Modern date utility library

### Testing
- **Jest 29.0**: Unit testing framework
- **React Testing Library 13.4**: Component testing utilities
- **@testing-library/user-event 14.5**: User interaction simulation
- **Playwright**: End-to-end testing framework

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── calendar/          # Calendar page & tests
│   │   ├── meetings/          # Meetings page & tests
│   │   ├── rooms/             # Rooms page & tests
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── calendar/          # Calendar-specific components
│   │   ├── ui/                # UI primitives (shadcn)
│   │   └── layout/            # Layout components
│   ├── features/              # Feature-specific code
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and helpers
│   ├── stores/                # Zustand stores
│   └── types/                 # TypeScript type definitions
├── e2e/                       # Playwright E2E tests
├── public/                    # Static assets
├── .next/                     # Next.js build output
├── test-results/              # Playwright test results
├── playwright.config.ts       # Playwright configuration
├── jest.config.js             # Jest configuration
├── jest.setup.js              # Jest setup file
├── tailwind.config.js         # Tailwind CSS config
└── tsconfig.json              # TypeScript config
```

## � Installation

### Prerequisites
- Node.js 18+ and npm (or yarn/pnpm)
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MeetingScheduler/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Available Scripts

### Development
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Testing
```bash
# Unit Tests (Jest + React Testing Library)
npm run test              # Run all unit tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report

# E2E Tests (Playwright)
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # Run E2E tests in UI mode (interactive)
npm run test:e2e:headed   # Run E2E tests with visible browser
npm run test:e2e:report   # View HTML test report
```

## 🧪 Testing

### Unit Testing

The project uses **Jest** and **React Testing Library** for unit and component testing.

#### Test Structure
- `src/app/*/__tests__/` - Page component tests
- `src/components/*/__tests__/` - Reusable component tests

#### Running Unit Tests
```bash
# Run all tests
npm test

# Run in watch mode (recommended during development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### Test Coverage
Current coverage: **69 tests**, **91% pass rate**

**Covered areas:**
- ✅ Calendar page rendering and interactions
- ✅ Meeting CRUD operations
- ✅ Search and filter functionality
- ✅ Room browsing and filtering
- ✅ Modal components (Create, Edit, Details)
- ✅ Form validation
- ✅ Toast notifications
- ✅ Empty states

### End-to-End Testing

The project uses **Playwright** for E2E testing across multiple browsers.

#### Test Configuration
Tests run on:
- **Desktop Browsers**: Chromium, Firefox, WebKit
- **Mobile Devices**: Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12)

#### Running E2E Tests
```bash
# First-time setup - install browsers
npx playwright install

# Run all E2E tests
npm run test:e2e

# Interactive mode (recommended for development)
npm run test:e2e:ui

# Run with visible browser (debugging)
npm run test:e2e:headed

# Run specific test file
npx playwright test calendar.spec.ts

# Run specific browser
npx playwright test --project=chromium

# View test report
npm run test:e2e:report
```

#### E2E Test Coverage
**Total Tests**: 235 (across all browsers)
**Current Pass Rate**: ~62.5%

**Test Suites:**
1. **Calendar Tests** (`e2e/calendar.spec.ts`) - 9 tests
   - Page display, event CRUD, drag & drop, modals
2. **Meetings Tests** (`e2e/meetings.spec.ts`) - 17 tests
   - Search, filtering, CRUD operations, form validation
3. **Rooms Tests** (`e2e/rooms.spec.ts`) - 27 tests
   - Search, filtering, booking, accessibility

For detailed E2E testing documentation, see [e2e/README.md](./e2e/README.md)

#### Debugging Failed Tests
```bash
# View trace for failed test
npx playwright show-trace test-results/[test-name]/trace.zip

# Debug specific test
npx playwright test --debug calendar.spec.ts
```

## 🎨 Component Library

The project uses a customized implementation of [shadcn/ui](https://ui.shadcn.com/) components built on top of Radix UI primitives.

### Available Components
- **Button**: Primary, secondary, and variant buttons
- **Dialog/Modal**: Accessible modal dialogs
- **Select**: Custom dropdown selects
- **Toast**: Notification system (Sonner)
- **Card**: Content containers
- **Badge**: Status indicators
- **Form Elements**: Input, Textarea, Label

### Adding New Components
```bash
npx shadcn-ui@latest add [component-name]
```

## 🔧 Configuration Files

### `next.config.js`
Next.js configuration for build and runtime settings

### `tailwind.config.js`
Tailwind CSS customization (colors, spacing, typography)

### `tsconfig.json`
TypeScript compiler options and path aliases

### `playwright.config.ts`
Playwright test configuration with browser settings

### `jest.config.js`
Jest test runner configuration

## 🌐 Environment Variables

Create a `.env.local` file with:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=false
```

## 🚧 Development Guidelines

### Code Style
- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict mode enabled

### Best Practices
1. **Type Safety**: Use TypeScript types for all props and state
2. **Component Organization**: Keep components small and focused
3. **Custom Hooks**: Extract reusable logic into hooks
4. **Error Boundaries**: Wrap components with error handling
5. **Loading States**: Always provide loading feedback
6. **Accessibility**: Use semantic HTML and ARIA labels

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm test
npm run test:e2e

# Commit changes
git add .
git commit -m "feat: description of changes"

# Push and create PR
git push origin feature/your-feature-name
```

## 🐛 Troubleshooting

### Common Issues

**Issue: Port 3000 already in use**
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

**Issue: Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: TypeScript errors**
```bash
# Run type check
npm run type-check

# Clear Next.js cache
rm -rf .next
npm run dev
```

**Issue: Playwright tests failing**
```bash
# Reinstall browsers
npx playwright install --with-deps

# Check if dev server is running
npm run dev  # In separate terminal
```

## 📊 Performance Optimization

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: `npm run build` shows bundle sizes
- **React Query Caching**: Intelligent data caching and refetching
- **Memoization**: Used in filtered lists for performance

## 🔐 Security

- **Input Validation**: Zod schemas for form validation
- **XSS Prevention**: React's built-in escaping
- **Environment Variables**: Sensitive data in `.env.local` (not committed)
- **API Security**: CORS configured in backend

## 📈 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication and authorization
- [ ] Real-time updates with WebSockets
- [ ] Email notifications
- [ ] Calendar export (iCal format)
- [ ] Recurring meetings
- [ ] Meeting reminders
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)
- [ ] Advanced analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Development Team

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ using Next.js, React, and TypeScript**  
**Last Updated**: October 25, 2025  
**Version**: 0.1.0  
**Status**: Active Development