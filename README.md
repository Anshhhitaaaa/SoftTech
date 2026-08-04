# System Access & Group Policy Configuration System

An enterprise-grade, full-stack security and document access management web application built with **React 18**, **ASP.NET Core 8 Web API**, **Entity Framework Core 8**, and **PostgreSQL**.

---

## 🌟 Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    React Frontend UI (Vite)                                 │
│  - App.jsx (Tab Controller, Universal Omni-Search, Async API Fetch & Mock Fallback)         │
│  - Components (DataTable, HeaderTabNav, EmptyState, CreateGroupModal, AddIndividualAccess)  │
│  - Services (api.js REST integration layer) & Data (mockData.js lookup datasets)            │
└───────────────────────────────┬─────────────────────────────────────────────────────────────┘
                                │ HTTP / REST API (JSON)
                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                ASP.NET Core 8 Web API Backend                               │
│  - Controllers: UserGroupsController, IndividualAccessController, LookupController         │
│  - DTOs: UserGroupDtos, IndividualAccessDtos                                                │
│  - Data Access: AppDbContext (EF Core 8 with Npgsql & InMemory providers)                   │
│  - Models: UserGroup, GroupMember, IndividualAccess, User, Office, OfficeCategory, etc.     │
└───────────────────────────────┬─────────────────────────────────────────────────────────────┘
                                │ Entity Framework Core SQL Queries
                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                  PostgreSQL Relational DB                                   │
│  - user_groups & group_members (Policy definitions & junction member mappings)               │
│  - individual_access (Direct privilege override records)                                    │
│  - Lookup Tables: office_categories, offices, departments, designations, users              │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Exhaustive File-by-File Repository Index

This codebase contains **32+ source files** organized into modular frontend, backend, test, and infrastructure directories:

```text
App_1/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                   # GitHub Actions pipeline for build, test, and SonarQube quality analysis
├── backend/
│   ├── database/
│   │   └── schema.sql                  # PostgreSQL DDL script creating tables, constraints, sequences & seed data
│   ├── SystemConfigApi/
│   │   ├── Controllers/
│   │   │   ├── IndividualAccessController.cs # REST API endpoints for individual privilege overrides
│   │   │   ├── LookupController.cs           # REST API endpoint for dropdown lookup datasets
│   │   │   └── UserGroupsController.cs       # REST API endpoints for user group policies & member relations
│   │   ├── Data/
│   │   │   └── AppDbContext.cs         # EF Core DbContext mapping DbSets, relationships & model seed data
│   │   ├── DTOs/
│   │   │   ├── IndividualAccessDtos.cs # Data Transfer Objects for individual access requests/responses
│   │   │   └── UserGroupDtos.cs        # Data Transfer Objects for group policy & member assignments
│   │   ├── Models/
│   │   │   ├── Department.cs           # Entity model for organization departments
│   │   │   ├── Designation.cs          # Entity model for job designations
│   │   │   ├── GroupMember.cs          # Entity model mapping users to group policies
│   │   │   ├── IndividualAccess.cs     # Entity model for direct user privilege overrides
│   │   │   ├── Office.cs               # Entity model for regional/corporate offices
│   │   │   ├── OfficeCategory.cs       # Entity model for office classification levels
│   │   │   ├── User.cs                 # Entity model for system users
│   │   │   └── UserGroup.cs            # Entity model for group policies
│   │   ├── appsettings.json            # ASP.NET Core application settings & connection strings
│   │   ├── Program.cs                  # Backend entrypoint configuring CORS, Swagger, EF Core & controllers
│   │   └── SystemConfigApi.csproj      # .NET 8 project dependencies (EF Core, Npgsql, Swashbuckle)
│   └── SystemConfigApi.Tests/
│       ├── Controllers/
│       │   ├── IndividualAccessControllerTests.cs # xUnit tests for individual access API logic
│       │   └── UserGroupsControllerTests.cs       # xUnit tests for user group API CRUD operations
│       └── SystemConfigApi.Tests.csproj # xUnit test project configuration with Moq & EF Core InMemory
├── src/
│   ├── components/
│   │   ├── AddIndividualAccessModal.jsx # Form modal for granting direct individual user privileges
│   │   ├── CreateGroupModal.jsx         # Form modal for creating user group policies & member rules
│   │   ├── DataTable.jsx                # Reusable data grid with status pills, actions & formatting
│   │   ├── EmptyState.jsx               # Visual fallback UI displayed when lists are empty
│   │   ├── HeaderTabNav.jsx             # App header with live tab counters & navigation
│   │   └── MasterDetailModal.jsx        # Detail modal for inspecting DB records, FKs & permissions
│   ├── data/
│   │   └── mockData.js                  # Pre-populated local dataset & lookup resolver helpers
│   ├── services/
│   │   └── api.js                       # Axios/Fetch REST service layer with backend API integration & fallback
│   ├── App.jsx                          # Main React state container, tab router & omni-search filter
│   ├── index.css                        # Tailwind CSS imports & custom animation/scrollbar styles
│   └── main.jsx                         # React 18 DOM root entrypoint
├── tests/
│   └── e2e/
│       ├── individual-access.spec.js    # Playwright E2E browser tests for individual access management
│       └── user-groups.spec.js           # Playwright E2E browser tests for group policy workflows
├── Dockerfile                           # Multi-stage container build definition (.NET 8 SDK + ASP.NET runtime)
├── index.html                           # Root HTML page template with Google Fonts
├── package.json                         # Node dependencies (React 18, Vite 5, Tailwind 3.4, Playwright)
├── playwright.config.js                 # Playwright E2E runner configuration & dev server launcher
├── postcss.config.js                    # PostCSS pipeline configuration (Tailwind & Autoprefixer)
├── sonar-project.properties             # SonarQube code quality scanner rules & path exclusions
├── tailwind.config.js                   # Tailwind CSS theme extension & content path setup
└── vite.config.js                       # Vite bundler setup & development server options
```

---

## 📄 File Details & Functional Matrix

### 1. Root & Infrastructure Configurations
- **`Dockerfile`**: Multi-stage dockerization using `mcr.microsoft.com/dotnet/sdk:8.0` for building C# binaries and `mcr.microsoft.com/dotnet/aspnet:8.0` for runtime execution on port `8080`.
- **`package.json`**: Manages frontend dependencies including React 18, Vite 5, Lucide Icons, Tailwind CSS 3.4, and Playwright 1.62.
- **`playwright.config.js`**: Configures Playwright end-to-end testing, browser contexts, failure screenshot triggers, and auto-spawns `npm run dev`.
- **`sonar-project.properties`**: Defines SonarQube project metadata (`SoftTech-app`), source targets (`src,backend`), and exclusion patterns (`node_modules`, `dist`, `bin`, `obj`).
- **`.github/workflows/ci-cd.yml`**: CI/CD pipeline executing Node 20 UI builds, .NET 8 API compilation, restore verification, and SonarQube code analysis on push/PR to `main`/`master`/`develop`.

### 2. Backend Web API (`backend/SystemConfigApi/`)
- **`Program.cs`**: ASP.NET Core 8 Web API entrypoint. Configures CORS (`AllowReactApp`), Swagger OpenAPI documentation UI at `/swagger`, PostgreSQL connection string parsing (supporting cloud `postgres://` URLs), and calls `EnsureCreated()` for DB initialization.
- **`Data/AppDbContext.cs`**: EF Core 8 `DbContext` mapping 8 entity sets, cascading deletes on `GroupMember -> UserGroup`, and seed data for lookups (offices, departments, designations, users).
- **`Controllers/UserGroupsController.cs`**: Implements REST API endpoints:
  - `GET /api/usergroups`: Fetches group policies with eager loading (`Include`/`ThenInclude`) for members and lookups.
  - `GET /api/usergroups/{id}`: Fetches specific group details.
  - `POST /api/usergroups`: Validates lookup IDs and creates new group policies with member associations.
  - `DELETE /api/usergroups/{id}`: Deletes a user group policy.
- **`Controllers/IndividualAccessController.cs`**: Implements REST API endpoints:
  - `GET /api/individualaccess`: Fetches individual privilege overrides with populated navigation properties.
  - `POST /api/individualaccess`: Creates direct user privilege overrides.
  - `DELETE /api/individualaccess/{id}`: Deletes an individual privilege override rule.
- **`Controllers/LookupController.cs`**: Endpoint `GET /api/lookup/all` delivering office categories, offices, departments, designations, and users in a single payload.

### 3. Frontend Web Application (`src/`)
- **`src/App.jsx`**: Top-level React state manager. Manages active tab state (`user-groups` vs `individual-access`), asynchronous API data fetching with mock fallback, universal omni-search filtering, and modal dialog states.
- **`src/services/api.js`**: Central REST API client. Handles endpoint resolution (`http://localhost:5000/api` or environment variable `VITE_API_URL`), request payload formatting, response transformation, and error recovery.
- **`src/data/mockData.js`**: Contains local mock arrays (`officeCategories`, `offices`, `departments`, `designations`, `users`) and lookup resolver functions (`getOfficeName`, `getDepartmentName`, etc.).
- **`src/components/DataTable.jsx`**: Render grid featuring status badges for `dms_access_level` (`full_control` / `read_only`), `workflow_role` (`reviewer` / `approver`), formatted timestamps, avatar stacks, and action buttons (`Master Detail`, `Delete`).
- **`src/components/CreateGroupModal.jsx`**: Form modal enabling creation of group policies, selecting DMS access levels, workflow roles, and assigning multiple users filtered by office, department, and designation.
- **`src/components/AddIndividualAccessModal.jsx`**: Form modal granting direct document access and workflow roles to individual target users.
- **`src/components/MasterDetailModal.jsx`**: Modal view displaying record metadata, PostgreSQL foreign key relationships, DMS access matrices, and member lists.

---

## 💾 Database Schema & Entity Relationships

The relational schema is built in PostgreSQL (defined in `backend/database/schema.sql` and mapped via EF Core):

```sql
-- User Groups Table
CREATE TABLE user_groups (
    id SERIAL PRIMARY KEY,
    group_name VARCHAR(200) NOT NULL,
    dms_access_level VARCHAR(50) NOT NULL CHECK (dms_access_level IN ('full_control', 'read_only')),
    workflow_role VARCHAR(50) NOT NULL CHECK (workflow_role IN ('reviewer', 'approver')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Group Members Junction Table
CREATE TABLE group_members (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES user_groups(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    office_category_id INT NOT NULL REFERENCES office_categories(id) ON DELETE CASCADE,
    office_id INT NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    designation_id INT NOT NULL REFERENCES designations(id) ON DELETE CASCADE
);

-- Individual Access Table
CREATE TABLE individual_access (
    id SERIAL PRIMARY KEY,
    office_category_id INT NOT NULL REFERENCES office_categories(id) ON DELETE CASCADE,
    office_id INT NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    designation_id INT NOT NULL REFERENCES designations(id) ON DELETE CASCADE,
    target_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dms_access_level VARCHAR(50) NOT NULL CHECK (dms_access_level IN ('full_control', 'read_only')),
    workflow_role VARCHAR(50) NOT NULL CHECK (workflow_role IN ('reviewer', 'approver')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 RESTful API Endpoint Reference

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/usergroups` | Retrieve all user groups with nested members | N/A | `200 OK` (Array of `UserGroupResponseDto`) |
| **GET** | `/api/usergroups/{id}` | Retrieve single user group by ID | N/A | `200 OK` / `404 Not Found` |
| **POST** | `/api/usergroups` | Create new user group policy | `CreateUserGroupDto` | `201 Created` |
| **DELETE** | `/api/usergroups/{id}` | Delete a user group policy | N/A | `204 No Content` |
| **GET** | `/api/individualaccess` | Retrieve all individual access privileges | N/A | `200 OK` (Array of `IndividualAccessResponseDto`) |
| **GET** | `/api/individualaccess/{id}` | Retrieve single individual access rule | N/A | `200 OK` / `404 Not Found` |
| **POST** | `/api/individualaccess` | Create direct individual privilege override | `CreateIndividualAccessDto` | `201 Created` |
| **DELETE** | `/api/individualaccess/{id}` | Delete individual privilege override | N/A | `204 No Content` |
| **GET** | `/api/lookup/all` | Fetch all lookup datasets | N/A | `200 OK` (Categories, Offices, Depts, Desigs, Users) |

---

## 🚀 Quickstart & Local Setup Guide

### 1. Requirements
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js (v18+)](https://nodejs.org/) & npm
- [PostgreSQL](https://www.postgresql.org/) (Optional: EF Core automatically falls back or seeds databases)

### 2. Run Backend API
```bash
cd backend/SystemConfigApi
dotnet restore
dotnet run
```
- API Base URL: `http://localhost:5000`
- Interactive Swagger Documentation: `http://localhost:5000/swagger`

### 3. Run Frontend UI
In a separate terminal window at the workspace root:
```bash
npm install
npm run dev
```
- Local Web Application: `http://localhost:5173`

---

## 🧪 Automated Testing Instructions

### Backend Unit Tests (xUnit)
Runs isolated API Controller unit tests against an EF Core In-Memory database:
```bash
cd backend/SystemConfigApi.Tests
dotnet test
```

### End-to-End Tests (Playwright)
Executes UI workflow automation tests across tab navigation, modal forms, search filters, and detail views:
```bash
npx playwright test
```
To view the visual test report:
```bash
npx playwright show-report
```

---

## 📦 Containerization & CI/CD Pipeline

### Docker Container Build
```bash
docker build -t softtech-system-config-api .
docker run -p 8080:8080 softtech-system-config-api
```

### GitHub Actions Pipeline
The pipeline (`.github/workflows/ci-cd.yml`) automatically triggers on push and pull requests:
1. **Node 20 UI Step**: Restores npm dependencies and executes Vite production build (`npm run build`).
2. **.NET 8 API Step**: Restores NuGet dependencies and compiles the ASP.NET Core project in Release mode.
3. **SonarQube Analysis Step**: Performs code quality and security scanning via `sonarqube-scan-action`.
