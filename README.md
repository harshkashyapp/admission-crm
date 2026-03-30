# Admission Management & CRM

A web-based Admission Management system built for colleges to configure programs, manage applicants, allocate seats with quota validation, and track documents and fees.

Built as part of the **edumerge Junior Software Developer Assignment**.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (via Docker)
- **Auth:** JWT (jsonwebtoken) + bcrypt
- **Validation:** Joi
- **DB Client:** node-postgres (pg)

---

## AI Disclosure

This project was built with assistance from **Claude (Anthropic)**. AI was used for:
- Boilerplate scaffolding (route/controller/service/repository structure)
- SQL migration file generation
- Joi validation schemas

All business logic, system rules, and architectural decisions were reviewed and understood by the author.

---

## Project Structure

```
admission-crm/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   └── modules/
│       ├── auth/
│       ├── master/
│       ├── seat-matrix/
│       ├── applicant/
│       ├── admission/
│       └── dashboard/
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_masters.sql
│   ├── 003_create_seat_matrix.sql
│   ├── 004_create_applicants.sql
│   └── 005_create_admissions.sql
├── migrate.js
├── server.js
├── .env.example
└── package.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/)
- [Postman](https://www.postman.com/) (for testing)

---

## Setup & Run

### 1. Clone the repository

```bash
git clone https://github.com/your-username/admission-crm.git
cd admission-crm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start PostgreSQL via Docker

```bash
docker run --name admission-crm-db \
  -e POSTGRES_USER=admissionuser \
  -e POSTGRES_PASSWORD=admission123 \
  -e POSTGRES_DB=admission_crm \
  -p 5433:5432 \
  -d postgres
```

> If port 5432 is already in use on your machine, use 5433 as shown above.

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_USER=admissionuser
DB_PASSWORD=admission123
DB_NAME=admission_crm
JWT_SECRET=supersecretkey123
JWT_EXPIRES_IN=7d
```

### 5. Run database migrations

```bash
npm run migrate
```

This creates all 9 tables: `users`, `institutions`, `campuses`, `departments`, `programs`, `seat_matrix`, `quota_counters`, `applicants`, `admissions`.

### 6. Start the server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3000`

---

## API Reference

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a user |
| POST | `/auth/login` | Public | Login and get JWT token |

**Register payload:**
```json
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin"
}
```
> `role` must be one of: `admin`, `officer`, `management`

**Login payload:**
```json
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

---

### Master Setup *(Admin only)*

| Method | Endpoint | Description |
|---|---|---|
| POST | `/master/institutions` | Create institution |
| GET | `/master/institutions` | List institutions |
| POST | `/master/campuses` | Create campus |
| GET | `/master/campuses` | List campuses |
| POST | `/master/departments` | Create department |
| GET | `/master/departments` | List departments |
| POST | `/master/programs` | Create program |
| GET | `/master/programs` | List programs |

**Create Program payload:**
```json
{
  "department_id": 1,
  "name": "Computer Science Engineering",
  "code": "CSE",
  "course_type": "UG",
  "entry_type": "Regular",
  "admission_mode": "Government",
  "academic_year": "2026-27"
}
```

---

### Seat Matrix *(Admin: write, Officer: read)*

| Method | Endpoint | Description |
|---|---|---|
| POST | `/seat-matrix` | Define intake and quota split |
| GET | `/seat-matrix/:programId` | View seat availability for a program |

**Create Seat Matrix payload:**
```json
{
  "program_id": 1,
  "total_intake": 60,
  "kcet_seats": 30,
  "comedk_seats": 20,
  "management_seats": 10,
  "supernumerary_seats": 5
}
```
> `kcet_seats + comedk_seats + management_seats` must equal `total_intake`

---

### Applicants *(Officer only)*

| Method | Endpoint | Description |
|---|---|---|
| POST | `/applicants` | Create applicant |
| GET | `/applicants` | List all applicants |
| GET | `/applicants/:id` | Get applicant by ID |
| PATCH | `/applicants/:id/doc-status` | Update document status |
| PATCH | `/applicants/:id/fee-status` | Update fee status |

**Create Applicant payload:**
```json
{
  "first_name": "Rahul",
  "last_name": "Sharma",
  "email": "rahul@test.com",
  "phone": "9876543210",
  "dob": "2005-06-15",
  "gender": "Male",
  "category": "GM",
  "entry_type": "Regular",
  "quota_type": "KCET",
  "allotment_number": "KCET2026001",
  "program_id": 1,
  "marks": 95.5,
  "qualifying_exam": "PUC"
}
```

**Update doc status:**
```json
{ "doc_status": "Verified" }
```
> Values: `Pending`, `Submitted`, `Verified`

**Update fee status:**
```json
{ "fee_status": "Paid" }
```
> Values: `Pending`, `Paid`

---

### Admissions *(Officer only)*

| Method | Endpoint | Description |
|---|---|---|
| POST | `/admissions/allocate` | Allocate seat (checks quota availability) |
| POST | `/admissions/confirm/:applicantId` | Confirm admission and generate admission number |

**Allocate seat payload:**
```json
{
  "applicant_id": 1,
  "seat_matrix_id": 1
}
```

> System uses the applicant's `quota_type` to check availability. Returns `409` if quota is full.

**Confirm admission:**
- No body required
- Fee must be `Paid` before confirming
- Generates immutable admission number in format: `RVCE/2026/UG/CSE/KCET/0001`

---

### Dashboard *(All roles)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | View seat filling status, quota counters, pending docs and fees |

---

## User Roles

| Role | Permissions |
|---|---|
| `admin` | Master setup, seat matrix configuration |
| `officer` | Create applicants, allocate seats, verify docs, confirm admissions |
| `management` | View dashboard only |

---

## Key System Rules

1. Quota seats sum must equal total intake
2. Seat allocation is blocked if quota is full (returns `409 Conflict`)
3. Admission number is generated only once and is immutable
4. Admission can only be confirmed after fee is marked `Paid`
5. Seat counters use `SELECT FOR UPDATE` to prevent race conditions

---

## Recommended Test Flow

1. Register users for all 3 roles
2. Login as `admin` → create institution → campus → department → program
3. Login as `admin` → create seat matrix for the program
4. Login as `officer` → create applicant
5. Login as `officer` → allocate seat (`/admissions/allocate`)
6. Login as `officer` → mark fee as paid (`PATCH /applicants/:id/fee-status`)
7. Login as `officer` → confirm admission (`/admissions/confirm/:applicantId`)
8. Login as any role → view dashboard