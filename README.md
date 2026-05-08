# TaskFlow Pro

A production-grade, full-stack task management platform built with Node.js, Express, MySQL, and React.

---

## Tech Stack

**Backend:** Node.js · Express.js · MySQL · Sequelize ORM · JWT · bcryptjs · Swagger · Helmet · CORS · Morgan · express-rate-limit · express-validator · Winston

**Frontend:** React 18 · Vite · Tailwind CSS · Framer Motion · Axios · React Router v6 · React Hot Toast

---

## Project Structure

```
taskflow-pro/
├── backend/
│   ├── src/
│   │   ├── config/         # DB + Swagger config
│   │   ├── constants/      # App-wide enums & constants
│   │   ├── controllers/    # Route handlers
│   │   ├── docs/           # Postman collection
│   │   ├── middleware/     # Auth, error handler, validator
│   │   ├── models/         # Sequelize models (User, Task)
│   │   ├── routes/         # Express routers (v1)
│   │   ├── services/       # Business logic layer
│   │   ├── utils/          # Logger, JWT helper, API response
│   │   └── validators/     # express-validator chains
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI + task components
    │   ├── context/        # AuthContext
    │   ├── hooks/          # useTasks custom hook
    │   ├── layouts/        # AuthLayout, DashboardLayout
    │   ├── pages/          # Login, Register, Dashboard, Tasks, Admin
    │   ├── services/       # Axios service modules
    │   └── utils/          # Constants
    ├── index.html
    └── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js >= 18
- MySQL >= 8.0

### 1. Database Setup

```sql
CREATE DATABASE taskflow_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

To seed an admin user, register normally then run:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secret
npm install
npm run dev
```

Server starts at `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App starts at `http://localhost:5173`

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_NAME` | Database name | `taskflow_pro` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | — |
| `JWT_SECRET` | JWT signing secret | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | No | Register new user |
| POST | `/api/v1/auth/login` | No | Login, returns JWT |
| GET | `/api/v1/auth/me` | Yes | Get current user |

### Tasks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/tasks` | Yes | List tasks (paginated, filterable) |
| GET | `/api/v1/tasks/:id` | Yes | Get single task |
| POST | `/api/v1/tasks` | Yes | Create task |
| PUT | `/api/v1/tasks/:id` | Yes | Update task |
| DELETE | `/api/v1/tasks/:id` | Yes | Delete task |
| GET | `/api/v1/tasks/stats` | Admin | Task statistics |

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/admin/dashboard` | Admin | Dashboard stats |
| GET | `/api/v1/admin/users` | Admin | List all users |
| GET | `/api/v1/admin/users/:id` | Admin | Get user + tasks |
| DELETE | `/api/v1/admin/users/:id` | Admin | Delete user |

### Query Parameters (GET /tasks)
- `page`, `limit` — pagination
- `status` — `todo` | `in_progress` | `completed`
- `priority` — `low` | `medium` | `high`
- `search` — searches title and description
- `sortBy` — `createdAt` | `dueDate` | `priority` | `status`
- `order` — `ASC` | `DESC`

---

## Swagger API Docs

Once the backend is running, visit:
```
http://localhost:5000/api-docs
```

To import into Postman, use the raw JSON at:
```
http://localhost:5000/api-docs.json
```

Or import `backend/src/docs/postman_collection.json` directly into Postman.

---

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "message": "Tasks fetched",
  "data": [...],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

---

## Roles & Permissions

| Action | User | Admin |
|---|---|---|
| Create task | ✅ own | ✅ own |
| View tasks | ✅ own only | ✅ all |
| Update task | ✅ own | ✅ any |
| Delete task | ✅ own | ✅ any |
| View all users | ❌ | ✅ |
| Delete users | ❌ | ✅ |
| Admin dashboard | ❌ | ✅ |

---

## Scalability

This architecture is designed to scale horizontally:

**Microservices** — The service layer (authService, taskService, adminService) is already decoupled from controllers, making it straightforward to extract each into an independent microservice behind an API gateway.

**Redis Caching** — Add Redis for caching frequently-read data (task lists, user profiles, stats). The service layer is the right place to inject a cache-aside pattern.

**Docker** — Each service (API, MySQL, Redis) can be containerized. A `docker-compose.yml` can orchestrate local development and a Dockerfile can produce a production image.

**Load Balancing** — The API is stateless (JWT-based auth, no server-side sessions), so multiple instances can run behind an Nginx or AWS ALB load balancer without sticky sessions.

**Horizontal Scaling** — The Sequelize connection pool is already configured. For high traffic, use a managed MySQL cluster (e.g., AWS RDS Multi-AZ) and scale API instances independently.

**Database Migrations** — Replace `sequelize.sync()` with Sequelize migrations (`sequelize-cli`) for production schema management.

---

## Deployment

### Backend (e.g., Railway / Render / EC2)
1. Set all environment variables from `.env.example`
2. Set `NODE_ENV=production`
3. Run `npm start`

### Frontend (e.g., Vercel / Netlify)
1. Set `VITE_API_URL` to your deployed backend URL
2. Run `npm run build`
3. Deploy the `dist/` folder

---

## Screenshots

<img width="1366" height="645" alt="image" src="https://github.com/user-attachments/assets/a761154b-e7a3-4d5c-9aca-19387abb983a" />
<img width="1366" height="626" alt="image" src="https://github.com/user-attachments/assets/3266bb3e-dd1b-43f4-afd2-b9828f01028b" />
<img width="1366" height="605" alt="image" src="https://github.com/user-attachments/assets/88b6e042-b593-4d12-8aea-e46086e2a61d" />
<img width="606" height="605" alt="image" src="https://github.com/user-attachments/assets/d91ed2a8-1b08-458e-b976-a8ff1de68afb" />





---

## License

MIT
