# Matemática Divertida - Math Learning Game

## Overview

This is an educational math game application designed for children to practice basic arithmetic operations (addition, subtraction, multiplication, division). The app presents 10 questions per session, tracks scores, and stores results history in a PostgreSQL database. Built with a React frontend and Express backend, it features playful animations, confetti celebrations for achievements, and a Portuguese language interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Animations**: Framer Motion for smooth transitions and canvas-confetti for celebrations
- **Build Tool**: Vite with React plugin

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/`
- Reusable components in `client/src/components/`
- Custom hooks in `client/src/hooks/`
- UI primitives in `client/src/components/ui/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts`
- **Validation**: Zod schemas for request/response validation
- **Storage Layer**: Abstracted through `IStorage` interface in `server/storage.ts`

The backend uses a layered approach:
- Routes defined in `server/routes.ts`
- Business logic in storage layer
- Database connection in `server/db.ts`
- Shared types/schemas in `shared/` directory

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Drizzle table definitions and Zod schemas
- `routes.ts`: API contract definitions with paths, methods, and response schemas

This ensures type safety across the full stack.

### Database Schema
Single table design:
- `results`: Stores game session results with operation type, score, total questions, and timestamp

### Development vs Production
- Development: Vite dev server with HMR, proxied through Express
- Production: Vite builds static files to `dist/public`, served by Express

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database queries and migrations
- **connect-pg-simple**: PostgreSQL session store (available but not currently used)

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **framer-motion**: Animation library for UI transitions
- **canvas-confetti**: Celebration effects on high scores
- **lucide-react**: Icon library
- **Radix UI**: Headless UI component primitives (via shadcn/ui)

### Build & Development
- **Vite**: Frontend build tool and dev server
- **esbuild**: Server-side bundling for production
- **tsx**: TypeScript execution for development

### Fonts
- Google Fonts: Fredoka (display) and Nunito (body) for child-friendly typography