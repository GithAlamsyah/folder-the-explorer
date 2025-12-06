# Folder The Explorer - Monorepo 

A modern monorepo setup featuring a **Windows Explorer-like folder structure viewer** with Vue 3 frontend and Elysia backend, both powered by Bun. The application demonstrates Clean Architecture principles, RESTful API design, and comprehensive testing strategies. This application also implement Eden Treaty for easier integration in monorepo environment.

## 📦 Project Structure

```
.
├── packages/
│   ├── backend/          # Elysia API with Clean Architecture
│   │   ├── src/
│   │   │   ├── domain/           # Entities & Repository Interfaces
│   │   │   ├── application/      # Use Cases
│   │   │   ├── infrastructure/   # Repository Implementations
│   │   │   └── interfaces/       # Controllers & Routes
│   │   ├── Dockerfile
│   │   └── package.json
│   └── frontend/         # Vue 3 + TypeScript
│       ├── src/
│       │   ├── components/       # Vue Components
│       │   ├── composables/      # Vue Composables
│       │   ├── __tests__/        # Unit Tests
│       │   ├── api.ts            # API Service
│       │   └── types.ts          # TypeScript Interfaces
│       ├── Dockerfile
│       ├── vite.config.ts
│       └── package.json
├── docker-compose.yml
└── package.json

```

## 🚀 Tech Stack

### Backend
- **Runtime**: Bun
- **Framework**: Elysia (Fast & lightweight web framework)
- **Architecture**: Clean Architecture (Domain → Application → Infrastructure → Interface)
- **Database**: PostgreSQL with Drizzle ORM
- **Testing**: Bun:test

### Frontend
- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest + Vue Test Utils
- **Styling**: Vanilla CSS (custom-built components, no UI libraries)

### Testing
- **Unit Testing**: Bun:test (Backend), Vitest (Frontend)
- **Test Coverage**: 30+ backend tests, 20+ frontend tests

## ✨ Features

### Folder Explorer Application

The main feature is a **Windows Explorer-like interface** with:

- **Split Panel Layout** (30% / 70%)
  - Left panel: Complete folder tree structure
  - Right panel: Direct children of selected folder
  
- **Custom-Built Tree Component**
  - Recursive rendering for unlimited nesting levels
  - Expand/collapse functionality
  - Visual indentation and tree lines
  - Folder selection highlighting
  
- **RESTful API**
  - Versioned endpoints (`/api/v1/folders`)
  - Proper HTTP methods and status codes
  - Consistent response format
  
## 📋 Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0
- [Docker](https://www.docker.com/) & Docker Compose (for containerized setup)
- [PostgreSQL](https://www.postgresql.org/) (for local development)

## 🛠️ Getting Started

### Quick Start (Development)

1. **Install dependencies for all packages**:

   ```bash
   bun install
   ```

2. **Start the Backend**:

   ```bash
   cd packages/backend
   bun run dev
   ```

   Backend will be available at `http://localhost:3000`

3. **Start the Frontend** (in a new terminal):

   ```bash
   cd packages/frontend
   bun install  # Install Vue and dependencies
   bun run dev
   ```

   Frontend will be available at `http://localhost:5173`

4. **Open your browser** and navigate to `http://localhost:5173`

### Database Setup

The application uses **PostgreSQL** with **Drizzle ORM** for database management.

#### Prerequisites

Ensure PostgreSQL is running locally or via Docker:

```bash
# Using Docker (recommended)
docker run -d \
  --name postgres-dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=monorepo_db \
  -p 5432:5432 \
  postgres:latest
```

#### Environment Variables

Set your database connection in the backend package:

```bash
# packages/backend/.env (optional, defaults to localhost)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/monorepo_db
```

#### Database Migration

1. **Generate migration files** (after modifying schemas in `src/infrastructure/database/schemas/`):

   ```bash
   cd packages/backend
   bun run db:generate
   ```

   This creates SQL migration files in `packages/backend/drizzle/` based on your schema definitions.

2. **Run migrations** (apply schema changes to database):

   ```bash
   cd packages/backend
   bun run db:migrate
   ```

   This executes all pending migrations and updates your database schema.

#### Database Seeding

Populate the database with initial folder data:

```bash
cd packages/backend
bun run db:seed 
#or
bun run db:seed --force
```

**Seeding Options**:

- **First-time seeding**: Automatically inserts data if database is empty
- **Re-seeding**: Force re-seed by modifying `seed.ts` to use `{ force: true }`
- **Production safety**: Seeds are skipped in production unless explicitly forced

**Seed Data**: The seeder creates 30 folders across 4 levels mimicking a realistic folder structure (Documents, Pictures, Work, etc.)

#### Drizzle Studio (Optional)

Explore your database with Drizzle's GUI:

```bash
cd packages/backend
bun run db:studio
```

Open `https://local.drizzle.studio` in your browser.

#### Complete Database Setup Workflow

For a fresh database setup, run these commands in order:

```bash
cd packages/backend

# 1. Generate migrations (if schema changes exist)
bun run db:generate

# 2. Apply migrations
bun run db:migrate

# 3. Seed initial data
bun run db:seed
```

### Docker Setup

1. **Build and start all services**:
   ```bash
   docker-compose up --build
   ```

2. **Access the services**:
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:3000`
   - Database: `localhost:5432`

3. **Stop all services**:
   ```bash
   docker-compose down
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints

#### 1. Get All Folders
```http
GET /api/v1/folders
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Documents",
      "parentId": null,
      "path": "/Documents",
      "level": 0
    },
    // ... more folders
  ]
}
```

#### 2. Get Folder By ID
```http
GET /api/v1/folders/:id
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Documents",
    "parentId": null,
    "path": "/Documents",
    "level": 0
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "data": null,
  "message": "Folder with id 999 not found"
}
```

#### 3. Get Folder Children
```http
GET /api/v1/folders/:id/children
```

**Special Case - Root Folders**:
```http
GET /api/v1/folders/root/children
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "6",
      "name": "Work",
      "parentId": "1",
      "path": "/Documents/Work",
      "level": 1
    },
    // ... more children
  ]
}
```

### Example API Calls

```bash
# Get all folders
curl http://localhost:3000/api/v1/folders

# Get specific folder
curl http://localhost:3000/api/v1/folders/1

# Get children of Documents folder
curl http://localhost:3000/api/v1/folders/1/children

# Get root-level folders
curl http://localhost:3000/api/v1/folders/root/children
```

## 🧪 Running Tests

### Backend Unit Tests
```bash
cd packages/backend
bun test
```

**Test Coverage**:
- Use case tests (GetAllFolders, GetFolderById, GetFolderChildren)
- Repository tests (data integrity, relationships)
- Controller tests (API endpoints, validation, error handling)

### Frontend Unit Tests
```bash
cd packages/frontend
bun install  # If not already installed
bun test:unit
```
**Note**
There is some issue regarding Vitest with Bun, so you need to run `bun test:unit` that provided in `package.json` to run **bun x vitest** in order to bypasses the need for complex custom loaders within the native `bun test` runner and leverages a highly compatible ecosystem.  

**Test Coverage**:
- Component tests (FolderTreeNode, FolderTree, FolderList, FolderExplorer)
- API service tests (with fetch mocking)
- Integration tests



## 🏗️ Architecture

### Backend - Clean Architecture

The backend follows Clean Architecture principles with clear separation of concerns:

```
src/
├── domain/              # Enterprise Business Rules
│   ├── entities/        # Folder entity
│   └── repositories/    # IFolderRepository interface
│
├── application/         # Application Business Rules
│   └── usecases/        # GetAllFolders, GetFolderById, GetFolderChildren
│
├── infrastructure/      # Frameworks & Drivers
│   └── repositories/    # FolderRepository implementation (in-memory)
│
└── interfaces/          # Interface Adapters
    └── controllers/     # FolderController (REST API)
```

**SOLID Principles**:
- **Single Responsibility**: Each class/module has one reason to change
- **Open/Closed**: Extensible through interfaces
- **Liskov Substitution**: Repository implementations are interchangeable
- **Interface Segregation**: Focused interfaces (IFolderRepository)
- **Dependency Inversion**: High-level modules depend on abstractions

### Frontend - Component Architecture

The frontend uses Vue 3 Composition API with:

- **Composables**: Reusable stateful logic (`useFolders`)
- **Components**: Modular, single-responsibility components
- **Services**: API communication layer
- **Types**: TypeScript interfaces for type safety

**Component Hierarchy**:
```
FolderExplorer (Main Container)
├── FolderTree (Left Panel)
│   └── FolderTreeNode (Recursive)
│       └── FolderTreeNode (Children)
│           └── ...
└── FolderList (Right Panel)
```

## 🎨 UI/UX Features

- **Responsive Design**: Adapts to different screen sizes
- **Visual Feedback**: Hover effects, selection highlighting
- **Tree Navigation**: Intuitive expand/collapse icons
- **Grid Layout**: Children displayed in responsive grid
- **Empty States**: Clear messaging when no data
- **Error Handling**: User-friendly error messages

## 📝 Development Notes

### REST API Standards

The API follows these conventions:
- **Versioning**: `/api/v1/...`
- **Naming**: Plural nouns for resources (`/folders`)
- **Methods**: GET for retrieval
- **Status Codes**: 200 (OK), 404 (Not Found), 500 (Server Error)
- **Response Format**: Consistent `{ success, data, message? }`

### Frontend State Management

The `useFolders` composable manages:
- Folder data fetching
- Tree structure building
- Selection state
- Children loading
- Error handling

## 🔧 Scripts Reference



### Backend
```bash
bun run dev       # Start development server with watch mode
bun run start     # Start production server
bun run build     # Build for production
bun test          # Run unit tests
```

### Frontend
```bash
bun run dev       # Start development server
bun run build     # Build for production
bun run preview   # Preview production build
bun test          # Run unit tests
```

## 🐳 Docker Commands

```bash
# Build and start
docker-compose up --build

# Start (after initial build)
docker-compose up

# Stop services
docker-compose down

# Clean up (remove volumes)
docker-compose down -v

# View logs
docker-compose logs -f
```