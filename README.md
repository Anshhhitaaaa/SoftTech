<div align="center">

# ⚡ Enterprise System Config & Word Document Automation Studio

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![MediatR](https://img.shields.io/badge/MediatR-CQRS-purple?style=for-the-badge)](https://github.com/jbogard/MediatR)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Build Status](https://img.shields.io/badge/Build-Passing-2EA44F?style=for-the-badge&logo=github-actions&logoColor=white)](#)

<p align="center">
  <b>A state-of-the-art full-stack platform featuring CQRS Backend Architecture (MediatR), Role-Based Database Authentication, Multi-Tier Review/Approval State Machine with Mandatory Feedback, and Native Browser (.docx) Binary Generation.</b>
</p>

[Key Features](#-key-features) • [CQRS Architecture](#-cqrs-architecture--backend-design) • [Workflow Architecture](#-multi-tier-workflow-state-machine) • [API Specs](#-restful-api-endpoints) • [Quickstart](#-quickstart--getting-started) • [Tech Stack](#-technology-stack)

---

</div>

## 📖 Short Description

> **System Access, Group Policy & Word Document Automation Studio** is an enterprise-grade web application built using **React 18**, **ASP.NET Core 8 Web API**, **MediatR (CQRS Pattern)**, **Entity Framework Core 8**, and **PostgreSQL**. It empowers organizations to manage granular office access policies while offering a complete document automation studio where users compose rich reports, trigger automated multi-tier review & approval workflows with feedback loops, and export native **Microsoft Word (.docx)** files directly from the browser.

---

## 🔥 Key Features

> [!TIP]
> **CQRS Backend Architecture**: Clean separation of read (Queries) and write (Commands) responsibilities powered by **MediatR**.

- 🏛️ **CQRS Pattern & MediatR Infrastructure**:
  - Decoupled API controllers delegating HTTP requests directly to single-responsibility Query and Command handlers.
  - Sliced domain features under `SystemConfigApi/Features/` for high maintainability, testability, and enterprise scalability.

- 👤 **Role-Based Authentication & User Sign-Up**:
  - Interactive login modal with dynamic database user retrieval.
  - **User Registration (Sign-Up)**: Create new user accounts specifying Full Name, Department, Designation, and primary Workflow Role (**Normal User**, **Reviewer**, **Approver**).
  - Initials-based circular avatar rendering and clean sequential user IDs (`#13`, `#14`, etc.).

- 🔄 **Multi-Tier Review & Approval State Machine**:
  - **Normal User (Author)**: Composes formatted reports, submits to Reviewer (`Pending Review`), and receives notifications if documents are returned (`Returned to Author`) with mandatory rejection feedback.
  - **Reviewer**: Inspects submitted reports $\rightarrow$ **Approve & Forward to Approver** (`Pending Approval`) OR **Send Back to Author** (`Returned to Author`) with mandatory reason comments.
  - **Approver**: Inspects `Pending Approval` reports $\rightarrow$ **Approve & Publish** (`Approved`) OR **Send Back to Reviewer** (`Returned to Reviewer`) OR **Send Back to Author** (`Returned to Author`) with mandatory reason comments.

- 📄 **Native Word (.docx) Packer Engine**:
  - In-browser binary generation using `docx` (`Packer.toBlob`) and `file-saver`.
  - Formatted Headings (Title, H1, H2, H3), styled data tables, callout boxes with indigo accents, headers & footers with disclaimers, and sign-off blocks.

- 🛡️ **Granular Policy & Access Management**:
  - User Group policies (`full_control`, `read_only`) categorized across Corporate, Zonal, Regional, Branch, and Site offices.
  - Individual access override records for direct user privilege management.

---

## ⚡ CQRS Architecture & Backend Design

The backend API employs **Command Query Responsibility Segregation (CQRS)** to decouple data reads from data mutations:

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
               │    AppDbContext (EF)  │
               └───────────────────────┘
```

* **Queries (Reads)**: Pure, side-effect-free data retrieval operations (`GetDocumentsQuery`, `GetUserGroupsQuery`, `GetUsersQuery`, `GetAllLookupsQuery`).
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

| User Role | Accessible Queue | Available Workflow Actions |
| :--- | :--- | :--- |
| 🧑‍💻 **Normal User** | Drafts & Returned Documents | Create reports, view return comments, edit content, & resubmit for review (`Pending Review`). |
| 🔎 **Reviewer** | Review Queue (`Pending Review`) | Approve & Forward to Approver (`Pending Approval`) OR Send Back to Author (`Returned to Author`) with mandatory comment. |
| 👑 **Approver** | Approval Queue (`Pending Approval`) | Approve & Publish (`Approved`) OR Send Back to Reviewer (`Returned to Reviewer`) OR Send Back to Author (`Returned to Author`) with mandatory comment. |

---

## 📁 Repository Structure

```text
App_1/
├── backend/
│   ├── database/
│   │   └── schema.sql                  # PostgreSQL DDL script with workflow check constraints
│   ├── SystemConfigApi/
│   │   ├── Controllers/                # Thin REST Controllers delegating to MediatR
│   │   │   ├── DocumentsController.cs
│   │   │   ├── IndividualAccessController.cs
│   │   │   ├── LookupController.cs
│   │   │   ├── UserGroupsController.cs
│   │   │   └── UsersController.cs
│   │   ├── Features/                   # CQRS Commands, Queries, and Handlers
│   │   │   ├── Documents/              # Document queries & workflow status commands
│   │   │   ├── IndividualAccess/       # Individual access queries & commands
│   │   │   ├── Lookups/                # System lookup metadata queries
│   │   │   ├── UserGroups/             # User group queries & commands
│   │   │   └── Users/                  # User queries & creation commands
│   │   ├── Data/AppDbContext.cs              # Entity Framework Core DbContext
│   │   ├── DTOs/                             # Data Transfer Objects
│   │   └── Models/                           # Entity Domain Models
│   └── SystemConfigApi.Tests/                # xUnit unit test suite for CQRS Handlers
├── src/
│   ├── components/
│   │   ├── AddIndividualAccessModal.jsx      # Modal for individual access overrides
│   │   ├── CreateGroupModal.jsx              # Modal for group policy creation
│   │   ├── DocumentEditor.jsx                # Word Doc Studio, toolbar & feedback banner
│   │   ├── DocumentsRepository.jsx           # Published Documents Repository & downloader
│   │   ├── HeaderTabNav.jsx                  # Header with user profile card & Sign In / Sign Up trigger
│   │   ├── LoginModal.jsx                    # Database Role Authentication & User Sign-Up Modal
│   │   ├── MasterDetailModal.jsx             # Detailed record inspector modal
│   │   └── WorkflowReviewModal.jsx           # Multi-stage review inspection & send-back modal
│   ├── data/mockData.js                      # Fallback user datasets & lookup helpers
│   ├── services/
│   │   ├── api.js                            # Fetch API service layer
│   │   └── DocxGenerator.js                  # Native browser .docx binary packer
│   └── App.jsx                               # Main application container & state router
```

---

## 🔌 RESTful API Endpoints

| Method | Endpoint | Description | Request Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/documents` | Retrieve all documents (optional `?status=` filter) | `GetDocumentsQuery` | `200 OK` |
| **GET** | `/api/documents/{id}` | Retrieve document details by ID | `GetDocumentByIdQuery` | `200 OK` |
| **POST** | `/api/documents` | Create new document report or submit for review | `CreateDocumentCommand` | `201 Created` |
| **PUT** | `/api/documents/{id}` | Update document content & resubmit returned document | `UpdateDocumentCommand` | `200 OK` |
| **PUT** | `/api/documents/{id}/status` | Update document workflow status & feedback notes | `UpdateDocumentStatusCommand` | `200 OK` |
| **DELETE** | `/api/documents/{id}` | Delete a document report | `DeleteDocumentCommand` | `204 No Content` |
| **GET** | `/api/usergroups` | Fetch all user group policies | `GetUserGroupsQuery` | `200 OK` |
| **POST** | `/api/usergroups` | Create a new user group policy | `CreateUserGroupCommand` | `201 Created` |
| **DELETE** | `/api/usergroups/{id}` | Delete a user group policy | `DeleteUserGroupCommand` | `204 No Content` |
| **GET** | `/api/lookup/all` | Fetch all user dropdown lookups | `GetAllLookupsQuery` | `200 OK` |

---

## 🚀 Quickstart & Getting Started

> [!IMPORTANT]
> Make sure **Node.js 18+** and **.NET 8 SDK** are installed on your machine.

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

### 3. Run Backend Unit Tests
```bash
# From the project root directory
dotnet test backend/SystemConfigApi.Tests/SystemConfigApi.Tests.csproj
```

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite 5 | Fast component-driven single page application |
| **Styling** | Tailwind CSS 3.4 | Modern utility-first responsive styling & custom dark themes |
| **Icons & UI** | Lucide React | Clean, modern vector icon set |
| **Doc Packer** | `docx` + `file-saver` | Browser-side Microsoft Word binary document compiler |
| **Backend API** | ASP.NET Core 8 Web API | High-performance C# RESTful backend API |
| **CQRS Mediator** | MediatR 12.4.1 | In-process messaging pipeline decoupling Commands & Queries |
| **ORM / Data Access** | Entity Framework Core 8 | Object-relational mapping with PostgreSQL Npgsql provider |
| **Database** | PostgreSQL 16 | Relational database engine |
| **Testing** | xUnit + EF InMemory | Unit test framework verifying CQRS Handlers |

---

<div align="center">
  <sub>Built with ❤️ by Anshita Agrawal</sub>
</div>
