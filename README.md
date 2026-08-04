# System Access, Group Policy & Word Document Automation System

An enterprise-grade, full-stack security, document access management, and **Word Document (.docx) Automation & 3-Tier Approval Workflow** web application built with **React 18**, **ASP.NET Core 8 Web API**, **Entity Framework Core 8**, and **PostgreSQL**.

---

## 🌟 Architecture & Workflow Overview

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 React 18 Frontend Application                               │
│  - DocumentEditor.jsx: Rich Text Report Builder, Toolbar & Sample Audit Template Generator │
│  - DocxGenerator.js: Browser-side Native Word (.docx) Binary Packer (headings, tables, etc.)│
│  - WorkflowReviewModal.jsx: Reviewer & Approver Stage Inspection & Notes                     │
│  - DocumentsRepository.jsx: Published Documents Menu & Download Manager                     │
│  - HeaderTabNav.jsx: Active Persona Switcher (Normal User ➔ Reviewer ➔ Approver)            │
└───────────────────────────────┬─────────────────────────────────────────────────────────────┘
                                │ HTTP / REST API (JSON)
                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                ASP.NET Core 8 Web API Backend                               │
│  - Controllers: DocumentsController, UserGroupsController, IndividualAccessController        │
│  - DTOs: DocumentDtos, UserGroupDtos, IndividualAccessDtos                                  │
│  - Data Access: AppDbContext (EF Core 8 with Npgsql & InMemory providers)                   │
│  - Models: Document, UserGroup, GroupMember, IndividualAccess, User, Office, etc.           │
└───────────────────────────────┬─────────────────────────────────────────────────────────────┘
                                │ Entity Framework Core SQL Queries
                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                  PostgreSQL Relational DB                                   │
│  - documents: Stores document drafts, content HTML, reviewer notes & approval status         │
│  - user_groups & group_members: Policy definitions & junction member mappings                │
│  - individual_access: Direct privilege override records                                      │
│  - Lookup Tables: office_categories, offices, departments, designations, users              │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Word Document (.docx) Automation & 3-Tier Approval Workflow

### 1. User Categories / Personas
The system implements a 3-tier role-based state machine. A persona switcher is provided in the header:
1. **Normal User (Creator - Rahul Sharma)**: Composes formatted reports in the editor, loads templates, previews `.docx` formatting, and submits to Reviewer.
2. **Reviewer (Priya Patel)**: Inspects submitted reports (`Pending Review`), adds review feedback notes, and forwards to Approver.
3. **Approver (Kavita Singh)**: Performs final verification on `Pending Approval` reports and clicks **Finalize & Publish**.

### 2. Word Document (.docx) Generation & Formatting Fidelity
Built using the `docx` library (`Packer.toBlob`) and `file-saver`:
- **Headings**: Formatted Title, H1, H2, H3 with custom font sizes and indigo branding palette (`1E1B4B`, `312E81`).
- **Tables**: Styled data tables with shaded headers, borders, cell margins, and custom text colors.
- **Callout Boxes**: Shaded indigo note boxes with left accent borders for audit directives.
- **Headers & Footers**: Automatic headers with category names and footers with confidentiality disclaimers & page numbers.
- **Page Breaks**: Explicit section page breaks preceding sign-off blocks.

### 3. Published Documents Repository Menu
Once an Approver finalizes a document:
- Status transitions to `Approved`.
- The document immediately publishes to the **Documents Menu** tab.
- Users can view approval signatures (Author, Reviewer, Approver) and click **Download .docx File** to obtain a formatted Microsoft Word document.

---

## 📁 Exhaustive File-by-File Repository Index

This codebase contains **38+ source files**:

```text
App_1/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                   # GitHub Actions pipeline for build, test, and SonarQube quality analysis
├── backend/
│   ├── database/
│   │   └── schema.sql                  # PostgreSQL DDL script for user_groups, individual_access, and documents
│   ├── SystemConfigApi/
│   │   ├── Controllers/
│   │   │   ├── DocumentsController.cs        # REST API endpoints for document CRUD & status workflow transitions
│   │   │   ├── IndividualAccessController.cs # REST API endpoints for individual privilege overrides
│   │   │   ├── LookupController.cs           # REST API endpoint for dropdown lookup datasets
│   │   │   └── UserGroupsController.cs       # REST API endpoints for user group policies
│   │   ├── Data/
│   │   │   └── AppDbContext.cs         # EF Core DbContext mapping DbSets, relationships & seed data
│   │   ├── DTOs/
│   │   │   ├── DocumentDtos.cs         # Data Transfer Objects for document creation & workflow status updates
│   │   │   ├── IndividualAccessDtos.cs # Data Transfer Objects for individual access requests/responses
│   │   │   └── UserGroupDtos.cs        # Data Transfer Objects for group policy & member assignments
│   │   ├── Models/
│   │   │   ├── Department.cs           # Entity model for organization departments
│   │   │   ├── Designation.cs          # Entity model for job designations
│   │   │   ├── Document.cs             # Entity model for document reports & approval statuses
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
│       │   ├── DocumentsControllerTests.cs        # xUnit tests for document CRUD & approval workflows
│       │   ├── IndividualAccessControllerTests.cs # xUnit tests for individual access API logic
│       │   └── UserGroupsControllerTests.cs       # xUnit tests for user group API CRUD operations
│       └── SystemConfigApi.Tests.csproj # xUnit test project configuration with Moq & EF Core InMemory
├── src/
│   ├── components/
│   │   ├── AddIndividualAccessModal.jsx # Form modal for granting direct individual user privileges
│   │   ├── CreateGroupModal.jsx         # Form modal for creating user group policies & member rules
│   │   ├── DataTable.jsx                # Reusable data grid with status pills, actions & formatting
│   │   ├── DocumentEditor.jsx           # Word Doc Automation Editor, formatting toolbar & sample template loader
│   │   ├── DocumentsRepository.jsx      # Published Documents Menu displaying approved reports & .docx downloads
│   │   ├── EmptyState.jsx               # Visual fallback UI displayed when lists are empty
│   │   ├── HeaderTabNav.jsx             # App header with live tab counters & persona switcher bar
│   │   ├── MasterDetailModal.jsx        # Detail modal for inspecting DB records, FKs & permissions
│   │   └── WorkflowReviewModal.jsx      # Inspection & review modal for Reviewer & Approver stages
│   ├── data/
│   │   └── mockData.js                  # Pre-populated local dataset & lookup resolver helpers
│   ├── services/
│   │   ├── api.js                       # Axios/Fetch REST service layer for user groups, access, & documents
│   │   └── DocxGenerator.js             # Word .docx binary generation engine using docx and file-saver
│   ├── App.jsx                          # Main React state container, persona switcher & tab router
│   ├── index.css                        # Tailwind CSS imports & custom animation/scrollbar styles
│   └── main.jsx                         # React 18 DOM root entrypoint
├── tests/
│   └── e2e/
│       ├── individual-access.spec.js    # Playwright E2E browser tests for individual access management
│       └── user-groups.spec.js           # Playwright E2E browser tests for group policy workflows
├── Dockerfile                           # Multi-stage container build definition (.NET 8 SDK + ASP.NET runtime)
├── package.json                         # Dependencies (React 18, Vite 5, docx, file-saver, Lucide, Playwright)
├── playwright.config.js                 # Playwright E2E runner configuration & dev server launcher
├── postcss.config.js                    # PostCSS pipeline configuration (Tailwind & Autoprefixer)
├── sonar-project.properties             # SonarQube code quality scanner rules & path exclusions
├── tailwind.config.js                   # Tailwind CSS theme extension & content path setup
└── vite.config.js                       # Vite bundler setup & development server options
```

---

## 🔌 RESTful API Endpoint Reference

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/documents` | Retrieve all documents (optional `?status=` filter) | N/A | `200 OK` (Array of `DocumentResponseDto`) |
| **GET** | `/api/documents/{id}` | Retrieve single document by ID | N/A | `200 OK` / `404 Not Found` |
| **POST** | `/api/documents` | Create new document report or submit for review | `CreateDocumentDto` | `201 Created` |
| **PUT** | `/api/documents/{id}/status` | Update document workflow status (Reviewer/Approver) | `UpdateDocumentStatusDto` | `200 OK` |
| **DELETE** | `/api/documents/{id}` | Delete a document report | N/A | `204 No Content` |
| **GET** | `/api/usergroups` | Retrieve all user groups with nested members | N/A | `200 OK` |
| **GET** | `/api/individualaccess` | Retrieve all individual access privileges | N/A | `200 OK` |
| **GET** | `/api/lookup/all` | Fetch all lookup dropdown datasets | N/A | `200 OK` |

---

## 🚀 Quickstart & Local Setup Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Backend API
```bash
cd backend/SystemConfigApi
dotnet restore
dotnet run
```
- API Base URL: `http://localhost:5000`
- Interactive Swagger Documentation: `http://localhost:5000/swagger`

### 3. Run React App
In a new terminal window at the workspace root:
```bash
npm run dev
```
- Open browser at `http://localhost:5173`.

---

## 🧪 Automated Testing

### Backend Unit Tests (xUnit)
```bash
cd backend/SystemConfigApi.Tests
dotnet test
```

### End-to-End Tests (Playwright)
```bash
npx playwright test
```
