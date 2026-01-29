# Aprendizado Divertido - Educational Learning Platform

## Overview

This is a comprehensive educational platform in Portuguese (Brazil) designed for children to practice across 5 subjects:
- **Matemática** (Math): Basic arithmetic operations (addition, subtraction, multiplication, division)
- **Pré-alfabetização** (Pre-literacy): Letter recognition, word completion, syllables, and sound matching
- **Português** (Portuguese): Grammar, spelling, agreement, semantics, and punctuation exercises
- **Geografia** (Geography): Brazilian state capitals, world capitals, and continents
- **História** (History): Brazilian history, world history, and important dates

Each subject features 10-question game sessions with score tracking, detailed statistics showing weak areas, and the ability to clear stats per subject or globally. Built with a React frontend and Express backend, it features playful animations, confetti celebrations for achievements, and a fully Portuguese language interface.

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
- Pages in `client/src/pages/` - Home, MathPage, PreLiteracyPage, PortuguesePage, GeographyPage, HistoryPage, StatsPage
- Reusable components in `client/src/components/` - Each subject has a Menu and Game component
- Custom hooks in `client/src/hooks/` - useResults, useResultsBySubject, useCreateResult, useClearResults, useClearResultsBySubject
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
- `schema.ts`: Drizzle table definitions, Zod schemas, and type definitions for subjects/topics
- `routes.ts`: API contract definitions with paths, methods, and response schemas

This ensures type safety across the full stack.

### Database Schema
Single table design:
- `results`: Stores game session results with subject, topic (optional), score, total questions, and timestamp

### API Endpoints
- `GET /api/results` - Get all results (limited to 50)
- `GET /api/results/:subject` - Get results by subject (limited to 10)
- `POST /api/results` - Create a new result
- `DELETE /api/results` - Clear all results
- `DELETE /api/results/:subject` - Clear results for a specific subject

### Development vs Production
- Development: Vite dev server with HMR, proxied through Express
- Production: Vite builds static files to `dist/public`, served by Express

## Subject Details

### Matemática (Math)
- Topics: Adição, Subtração, Multiplicação, Divisão
- Question format: Math problems with numerical input
- Color theme: Blue

### Pré-alfabetização (Pre-literacy)
- Topics: Primeira Letra, Complete a Palavra, Som Inicial, Sílaba Inicial
- Question format: Multiple choice with word/letter options
- Color theme: Yellow

### Português (Portuguese)
- Topics: Gramática, Ortografia, Concordância, Semântica, Pontuação, Aleatório
- Question format: Correct/Incorrect sentence identification
- Color theme: Green

### Geografia (Geography)
- Topics: Capitais do Brasil, Capitais do Mundo, Continentes, Aleatório
- Question format: Multiple choice
- Color theme: Cyan

### História (History)
- Topics: Brasil, Mundial, Datas, Aleatório
- Question format: True/False statements with explanations
- Color theme: Orange

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

## Recent Changes

### January 2026
- Expanded from math-only game to comprehensive 5-subject educational platform
- Added subjects: Pré-alfabetização, Português, Geografia, História
- Updated database schema to support subject and topic tracking
- Added detailed statistics page with weak areas identification
- Added per-subject statistics clearing functionality
- Full Portuguese (Brazil) localization for all UI elements
