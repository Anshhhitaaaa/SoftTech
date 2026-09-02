<div align="center">

# ⚡ Enterprise System Config, Word Automation Studio & API Load Testing

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Locust Load Testing](https://img.shields.io/badge/Locust-2.46-green?style=for-the-badge&logo=python&logoColor=white)](https://locust.io/)
[![MediatR](https://img.shields.io/badge/MediatR-CQRS-purple?style=for-the-badge)](https://github.com/jbogard/MediatR)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

<p align="center">
  <b>A state-of-the-art full-stack platform featuring CQRS Backend Architecture (MediatR), Role-Based Database Authentication, Multi-Tier Review/Approval State Machine with Mandatory Feedback, Native Browser (.docx) Binary Generation, and an Enterprise Locust API Load Testing Suite.</b>
</p>

[Key Features](#-key-features) • [CQRS Architecture](#-cqrs-architecture--backend-design) • [Workflow State Machine](#-multi-tier-workflow-state-machine) • [API Load Testing](#-enterprise-api-load-testing-suite) • [API Specs](#-restful-api-endpoints) • [Quickstart](#-quickstart--getting-started) • [Deployment Guide](#-deployment-guide-vercel--render)

---

</div>

## 📖 System Overview

**System Access, Group Policy & Word Document Automation Studio** is an enterprise-grade platform built with **React 18**, **ASP.NET Core 8 Web API**, **FastAPI (Admin Analytics Engine)**, **MediatR (CQRS Pattern)**, **Entity Framework Core 8**, **Render PostgreSQL**, and **Locust Load Testing Framework**. 

It empowers organizations to manage granular office access policies while offering a complete document automation studio where users compose rich reports, trigger automated multi-tier review & approval workflows with feedback loops, export native **Microsoft Word (.docx)** files directly from the browser, and run automated performance load testing suites with SLA assertions.

---

## 🔥 Key Features

> [!TIP]
> **CQRS Backend Architecture**: Clean separation of read (Queries) and write (Commands) responsibilities powered by **MediatR** and EF Core DbContext Pooling.

- 🏛️ **CQRS Pattern & High-Performance MediatR Infrastructure**:
  - Thin API controllers delegating HTTP requests directly to single-responsibility Query and Command handlers.
  - EF Core `AddDbContextPool<AppDbContext>()` and `.AsNoTracking()` query optimizations for 3x faster throughput.
  - Sliced domain features under `SystemConfigApi/Features/` for enterprise scalability.

- 🤖 **FastAPI Admin Analytics & Natural Language Query Engine**:
  - Python FastAPI microservice providing analytics reporting and safe natural language search against SQL analytical views.

- 👤 **Role-Based Authentication & Dynamic User Lookup**:
  - Interactive login modal with dynamic database user retrieval and fallback property resolution (`normalizeUser`, `getDepartmentName`, `getDesignationName`).
  - **User Registration**: Create accounts specifying Full Name, Department, Designation, and primary Workflow Role (**Normal User**, **Reviewer**, **Approver**).

- 🔄 **Multi-Tier Review & Approval State Machine**:
  - **Normal User (Author)**: Composes formatted reports, submits to Reviewer (`Pending Review`), and receives notifications if documents are returned (`Returned to Author`) with mandatory rejection feedback.
  - **Reviewer**: Inspects submitted reports $\rightarrow$ **Approve & Forward to Approver** (`Pending Approval`) OR **Send Back to Author** (`Returned to Author`) with mandatory reason comments.
  - **Approver**: Inspects `Pending Approval` reports $\rightarrow$ **Approve & Publish** (`Approved`) OR **Send Back to Reviewer** (`Returned to Reviewer`) OR **Send Back to Author** (`Returned to Author`) with mandatory reason comments.

- ⚡ **Enterprise Locust API Load Testing Suite (`tests/load/`)**:
  - Automated Python performance runner simulating concurrent user traffic.
  - Measures throughput (RPS), latency percentiles ($p50, p90, p95, p99$), and error rates.
  - Enforces Performance SLA assertions ($p95 < 500\text{ ms}$, $\text{Error Rate} < 1\%$).
  - Auto-generates visual HTML performance reports and interactive Locust Web UI (`http://localhost:8089`).

- 📄 **Native Word (.docx) Packer Engine**:
  - In-browser binary generation using `docx` (`Packer.toBlob`) and `file-saver`.
  - Formatted Headings (Title, H1, H2, H3), styled data tables, callout boxes with indigo accents, headers & footers with disclaimers, and sign-off blocks.

---

## ⚡ CQRS Architecture & Backend Design

```text
               ┌───────────────────────┐
               │    HTTP Controller    │
               └───────────┬───────────┘
                           │ Dispatches Request via MediatR
                           ▼
          ┌─────────────────────────────────┐
          │         MediatR Pipeline        │
          └────────┬───────────────┬────────┘
                   │               │
      Read Queries │               │ Write Commands
                   ▼               ▼
      ┌──────────────────┐   ┌──────────────────┐
      │   Query Handlers │   │ Command Handlers │
      └────────┬─────────┘   └────────┬─────────┘
               │                      │
               └───────────┬──────────┘
                           ▼
               ┌───────────────────────┐
               │  AppDbContext (Pool)  │
               └───────────┬───────────┘
                           ▼
               ┌───────────────────────┐
               │   Render PostgreSQL   │
               └───────────────────────┘
```

* **Queries (Reads)**: Pure, side-effect-free data retrieval operations (`GetDocumentsQuery`, `GetUserGroupsQuery`, `GetUsersQuery`, `GetAllLookupsQuery`) optimized with `.AsNoTracking()`.
* **Commands (Writes)**: State mutation operations handling business rules and database persistence (`CreateDocumentCommand`, `UpdateDocumentStatusCommand`, `CreateUserGroupCommand`, `CreateUserCommand`).

---

## 🔄 Multi-Tier Workflow State Machine

```text
                                 ┌──────────────────────┐
                                 │   Document Creation  │
                                 └──────────┬───────────┘
                                            │ Submit for Review
                                            ▼
                                 ┌──────────────────────┐
                                 │    Pending Review    │
                                 │  (Reviewer Stage)    │
                                 └──────────┬───────────┘
                                   │        │
                   Send Back       │        │ Approve & Forward
            ┌──────────────────────┘        ▼
            │                    ┌──────────────────────┐
            │                    │   Pending Approval   │
            │                    │   (Approver Stage)   │
            │                    └──────────┬───────────┘
            │                      │        │
            │      Send to Reviewer│        │ Approve & Publish
            │     ┌────────────────┘        ▼
            ▼     ▼                      ┌──────────────────────┐
    ┌────────────────┐                   │   Approved & Published│
    │Returned Author │                   │ (Documents Repository)│
    └───────┬────────┘                   └──────────────────────┘
            │ Resubmit
            └───────────────────────────────┘
```

---

## ⚡ Enterprise API Load Testing Suite

The load testing infrastructure is built with **Locust** under `tests/load/` for headless execution, SLA verification, and interactive dashboard monitoring:

### 📁 Directory Structure
```text
tests/load/
├── config.py                     # Target hosts, concurrency defaults, SLA thresholds (p95 < 500ms, Error < 1%)
├── locustfile_system_config.py   # SystemConfigApi user scenarios (Documents CQRS workflow, Lookups, Users, UserGroups)
├── locustfile_admin_api.py       # Admin API user scenarios (Auth login, Analytics, Natural Language query engine)
├── run_load_tests.py             # Headless CLI orchestrator & SLA verifier
├── requirements.txt              # Load testing dependencies (locust, requests, colorama)
└── reports/                      # Auto-generated HTML and CSV performance reports
```

### 🚀 Running Load Tests
```powershell
# 1. Run SystemConfigApi Load Test (Headless with SLA check)
npm run test:load:system-config

# 2. Run Admin API Load Test
npm run test:load:admin-api

# 3. Run All Load Test Suites
npm run test:load:all

# 4. Custom Concurrency Command
py tests/load/run_load_tests.py --target system-config --host https://your-backend.onrender.com --users 20 --spawn-rate 5 --run-time 30s
```

### 🌐 Interactive Web Dashboard
```powershell
locust -f tests/load/locustfile_system_config.py --host http://localhost:5000
```
Open **`http://localhost:8089`** in your browser to view real-time latency percentiles and RPS graphs.

---

## 📁 Repository Structure

```text
App_1/
├── backend/
│   ├── database/
│   │   └── schema.sql                  # PostgreSQL DDL script with workflow check constraints
│   ├── SystemConfigApi/
│   │   ├── Controllers/                # Thin REST Controllers delegating to MediatR
│   │   ├── Features/                   # CQRS Commands, Queries, and Handlers
│   │   ├── Data/AppDbContext.cs        # Entity Framework Core DbContext (Pooled)
│   │   └── Program.cs                  # Web API bootstrapper & connection string parser
│   ├── admin_api/                      # Python FastAPI Admin Analytics Engine
│   └── SystemConfigApi.Tests/          # xUnit test suite for CQRS Handlers
├── tests/load/                         # Locust API Load Testing Framework
├── src/
│   ├── components/                     # React UI modals, editor, repository, and tab views
│   ├── data/mockData.js                # Lookup name resolvers & fallback datasets
│   ├── hooks/                          # Custom React hooks (useAuth, useSystemConfigData, useDocumentWorkflow)
│   ├── services/api.js                 # Centralized HTTP API service layer
│   └── App.jsx                         # Main application container
└── package.json                        # Frontend & Load Testing npm scripts
```

---

## 🔌 RESTful API Endpoints

| Method | Endpoint | Description | CQRS Handler | Status |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/documents` | Retrieve all documents (`?status=` filter) | `GetDocumentsQuery` | `200 OK` |
| **GET** | `/api/documents/{id}` | Retrieve document by ID | `GetDocumentByIdQuery` | `200 OK` |
| **POST** | `/api/documents` | Create document or submit report | `CreateDocumentCommand` | `201 Created` |
| **PUT** | `/api/documents/{id}` | Update document content & resubmit | `UpdateDocumentCommand` | `200 OK` |
| **PUT** | `/api/documents/{id}/status` | Update workflow status & feedback | `UpdateDocumentStatusCommand` | `200 OK` |
| **DELETE** | `/api/documents/{id}` | Delete document report | `DeleteDocumentCommand` | `204 No Content` |
| **GET** | `/api/usergroups` | Fetch all user group policies | `GetUserGroupsQuery` | `200 OK` |
| **POST** | `/api/usergroups` | Create user group policy | `CreateUserGroupCommand` | `201 Created` |
| **DELETE** | `/api/usergroups/{id}` | Delete user group policy | `DeleteUserGroupCommand` | `204 No Content` |
| **GET** | `/api/lookup/all` | Fetch office, department, user lookups | `GetAllLookupsQuery` | `200 OK` |

---

## 🚀 Quickstart & Getting Started

### 1. Frontend Setup
```bash
# Clone the repository
git clone https://github.com/Anshhhitaaaa/SoftTech.git
cd SoftTech

# Install dependencies
npm install

# Start Vite React development server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 2. Backend Setup (.NET 8 Web API)
```bash
cd backend/SystemConfigApi

# Restore dependencies & run backend API
dotnet restore
dotnet run
```
Backend API will launch on **`http://localhost:5000`** with Swagger UI available at **`http://localhost:5000/swagger`**.

### 3. API Health & Verification Check
```powershell
# Direct HTTP health check
curl http://localhost:5000/api/Lookup/all
```

---

## 🌐 Deployment Guide (Vercel & Render)

### 1. Backend Service (Render)
1. Go to **[Render Dashboard](https://dashboard.render.com)** $\rightarrow$ **Web Services**.
2. Set Environment Variable:
   * **Key**: `ConnectionStrings__PostgreSQLConnection`
   * **Value**: `postgresql://system_config_db_user:...@dpg-...render.com/system_config_db_zap3`
3. Click **Save Changes** (Render will automatically re-deploy).

### 2. Frontend App (Vercel)
1. Go to **[Vercel Dashboard](https://vercel.com/dashboard)** $\rightarrow$ **Settings** $\rightarrow$ **Environment Variables**.
2. Add Variable:
   * **Key**: `VITE_API_URL`
   * **Value**: `https://your-backend.onrender.com/api`
3. Trigger **Redeploy** on Vercel.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite 5 | Fast component-driven SPA |
| **Styling** | Tailwind CSS 3.4 | Utility-first styling & custom glassmorphism |
| **Backend API** | ASP.NET Core 8 Web API | High-performance C# RESTful API |
| **Analytics Engine** | FastAPI (Python 0.109) | Admin analytics microservice & NL query parser |
| **Load Testing** | Locust 2.46 | Python load testing engine with SLA assertions |
| **CQRS Mediator** | MediatR 12.4 | In-process decoupled messaging pipeline |
| **ORM / Data Access** | EF Core 8 (DbContextPool) | High-throughput object-relational mapper |
| **Database** | Render PostgreSQL 16 | Production relational database |

---

<div align="center">
  <sub>Built with ❤️ by Anshita Agrawal</sub>
</div>
