# Task Scheduling System

## Overview

This is a full-stack task scheduling application built with React, Express, and TypeScript. The system allows users to create, manage, and schedule tasks using different scheduling algorithms. It provides visual representations through Gantt charts and performance metrics to help users understand how different algorithms affect task execution.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Storage**: Configurable storage layer with memory storage fallback
- **API**: RESTful API with comprehensive CRUD operations
- **Development**: Hot reloading with Vite integration

### Development Environment
- **Runtime**: Node.js 20
- **Package Manager**: npm
- **Development Server**: Concurrent frontend (Vite) and backend (Express) servers
- **Database Migrations**: Drizzle Kit for schema management

## Key Components

### Database Schema
- **Tasks Table**: Stores task information including name, description, priority, duration, and creation timestamp
- **Validation**: Zod schemas for type-safe data validation and transformation
- **Types**: Shared TypeScript types for tasks and scheduling algorithms

### Scheduling Algorithms
1. **Priority-based**: Executes tasks by priority level (high → medium → low)
2. **First Come First Serve (FCFS)**: Executes tasks in creation order
3. **Shortest Job First (SJF)**: Executes shortest duration tasks first
4. **Round Robin (RR)**: Time-slice based scheduling with fair distribution

### User Interface Components
- **Task Management**: Create, edit, delete, and list tasks
- **Algorithm Selection**: Interactive algorithm picker with descriptions
- **Gantt Chart**: Visual timeline representation of scheduled tasks
- **Performance Metrics**: Real-time calculation of total time, average wait time, and efficiency
- **Algorithm Comparison**: Side-by-side performance comparison across all algorithms

### Storage Layer
- **Interface**: `IStorage` interface for consistent data operations
- **Implementation**: Memory storage with PostgreSQL integration ready
- **Operations**: Full CRUD operations with proper error handling

## Data Flow

1. **Task Creation**: Users input task details via form → validated with Zod → stored in database
2. **Algorithm Selection**: User selects scheduling algorithm → triggers recalculation
3. **Schedule Calculation**: Tasks retrieved from database → processed by selected algorithm → results displayed
4. **Visualization**: Scheduled tasks rendered in Gantt chart with color-coded priorities
5. **Metrics**: Performance metrics calculated and displayed in real-time

## External Dependencies

### Core Dependencies
- **Database**: `@neondatabase/serverless` for PostgreSQL connection
- **ORM**: `drizzle-orm` and `drizzle-zod` for database operations and validation
- **UI**: Multiple `@radix-ui/*` packages for accessible components
- **Validation**: `zod` for schema validation
- **HTTP Client**: Native fetch API with TanStack Query wrapper

### Development Dependencies
- **Build Tools**: Vite, esbuild for production builds
- **TypeScript**: Full type safety across frontend and backend
- **Linting/Formatting**: ESM modules with strict TypeScript configuration

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds optimized React application to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Assets**: Static files served from build output directory

### Environment Configuration
- **Development**: Dual server setup with Vite dev server and Express API
- **Production**: Single Express server serving both API and static files
- **Database**: Environment-based DATABASE_URL configuration

### Replit Integration
- **Modules**: Node.js 20, web development, PostgreSQL 16
- **Deployment**: Autoscale deployment target with npm build/start scripts
- **Development**: Hot reloading with file watching

## Changelog
- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.