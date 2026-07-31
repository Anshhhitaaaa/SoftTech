# System Access & Group Policy Configuration System

A full-stack enterprise web application built with **React**, **ASP.NET Core 8 Web API**, **Entity Framework Core**, and **PostgreSQL**.

---

## 🌟 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend API**: ASP.NET Core 8 Web API, Entity Framework Core 8, Npgsql
- **Database**: PostgreSQL (Relational Schema with Foreign Key constraints, Junction Tables, and Lookup Seed Data)
- **Containerization & Deployment**: 
  - **Docker** containerized backend deployed on **Render**
  - **Vercel** for continuous React frontend hosting
  - **Render Cloud PostgreSQL** database

---

## 🏛️ System Architecture

```text
┌─────────────────┐       HTTP / REST API       ┌──────────────────┐       EF Core / Npgsql      ┌─────────────────┐
│                 │  ─────────────────────────>  │                  │  ─────────────────────────> │                 │
│ React Frontend  │                             │  .NET 8 Web API  │                             │ PostgreSQL DB   │
│  (Vite App)     │  <─────────────────────────  │    (C# Backend)  │  <───────────────────────── │ (system_config) │
└─────────────────┘        JSON Data            └──────────────────┘          SQL Queries        └─────────────────┘
```

---

## 💾 Database Schema

The database follows a normalized relational structure:

- `user_groups`: Stores group policy definitions, document access levels (`full_control`, `read_only`), and workflow roles (`reviewer`, `approver`).
- `group_members`: Junction table assigning users, office categories, offices, departments, and designations to user groups.
- `individual_access`: Stores direct user privilege overrides.
- **Lookup Entities**: `office_categories`, `offices`, `departments`, `designations`, `users`.

---

## 🔌 RESTful API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/usergroups` | Retrieve all user group policies and nested member details |
| **GET** | `/api/usergroups/{id}` | Retrieve specific user group detail by ID |
| **POST** | `/api/usergroups` | Create a new user group policy and member assignments |
| **DELETE** | `/api/usergroups/{id}` | Delete a user group policy |
| **GET** | `/api/individualaccess` | Retrieve all individual access privileges |
| **GET** | `/api/individualaccess/{id}` | Retrieve specific individual access detail |
| **POST** | `/api/individualaccess` | Create an individual privilege assignment |
| **DELETE** | `/api/individualaccess/{id}` | Delete an individual access assignment |
| **GET** | `/api/lookup/all` | Fetch all lookup dropdown options |

---

## 🚀 Local Development Setup

### 1. Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js (v18+)](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### 2. Database Setup
Create a local PostgreSQL database named `system_config_db`:
```sql
CREATE DATABASE system_config_db;
```
*(Alternatively, Entity Framework Core will automatically create tables and seed lookup data on first application start!)*

### 3. Run ASP.NET Core Backend
```bash
cd backend/SystemConfigApi
dotnet restore
dotnet run
```
The API server will start at `http://localhost:5000` (Interactive Swagger UI available at `http://localhost:5000/swagger`).

### 4. Run React Frontend
In a new terminal window at the project root:
```bash
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🧪 Automated Testing Suites

### 1. Backend API Unit Tests (xUnit)
Run xUnit unit tests for API Controllers & DbContext:
```bash
cd backend/SystemConfigApi.Tests
dotnet test
```

### 2. Frontend UI E2E Tests (Playwright)
Run end-to-end browser automation tests:
```bash
npm install -D @playwright/test
npx playwright test
```

---

## 📦 Deployment Configuration

- **Backend Docker Container**: Packaged using Docker SDK 8.0 with Linux container compatibility flags (`DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1`, `DOTNET_USE_POLLING_FILE_WATCHER=false`).
- **CORS Configuration**: Configured in `Program.cs` to allow cross-origin requests from Vercel frontend.

