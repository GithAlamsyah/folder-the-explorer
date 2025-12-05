# Folder Explorer - Monorepo Boilerplate

A modern monorepo setup featuring a **Windows Explorer-like folder structure viewer** with Vue 3 frontend and Elysia backend, both powered by Bun. The application demonstrates Clean Architecture principles, RESTful API design, and comprehensive testing strategies.

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
├── tests/e2e/            # Playwright E2E Tests
├── docker-compose.yml
├── playwright.config.ts
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
- **E2E Testing**: Playwright
- **Test Coverage**: 30+ backend tests, 20+ frontend tests, 8+ e2e scenarios

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
  
- **Mock Data**
  - 30 folders across 4 levels
  - Realistic folder hierarchy (Documents, Pictures, Work, etc.)

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
bun test
```

**Test Coverage**:
- Component tests (FolderTreeNode, FolderTree, FolderList, FolderExplorer)
- API service tests (with fetch mocking)
- Integration tests

### End-to-End Tests

**Run tests**:
```bash
# From monorepo root
bun install  # Install Playwright
bun test:e2e
```

**Run with UI**:
```bash
bun test:e2e:ui
```

**E2E Test Scenarios**:
- Initial page load and folder tree display
- Folder selection and highlighting
- Right panel update on selection
- Tree expansion and collapse
- Nested folder navigation
- Empty state handling
- State persistence

> **Note**: Playwright tests automatically start backend and frontend servers.

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

### Adding New Folders

To add more mock folders, edit:
```typescript
packages/backend/src/infrastructure/repositories/FolderRepository.ts
```

Add entries to the `folders` array following the structure:
```typescript
{
  id: 'unique_id',
  name: 'Folder Name',
  parentId: 'parent_id_or_null',
  path: '/Parent/Path',
  level: 0 // or appropriate nesting level
}
```

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

### Monorepo Root
```bash
bun test:e2e      # Run Playwright e2e tests
bun test:e2e:ui   # Run e2e tests with UI
```

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