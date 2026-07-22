
# TicketSystem
A hospital IT support ticket management system with backend (Node.js/Express/PostgreSQL/Prisma) and frontend (React/Vite).

## Prerequisites
- Node.js (v20+ recommended)
- PostgreSQL database (local or remote)
- npm or yarn

## Project Structure
```
TicketSystem/
├── backend/          # Backend API
├── frontend/         # React Frontend
└── README.md
```

## Setup Instructions

### 1. Clone the repository
```bash
git clone &lt;repo-url&gt;
cd TicketSystem
```

### 2. Backend Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in `backend/` directory with the following content:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
# Optional: Cloudinary config if using file uploads
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

**Note**: Replace the DATABASE_URL with your actual PostgreSQL connection details.

4. Set up database:
```bash
# Run migrations to create tables
npx prisma migrate dev

# (Optional) Seed departments
node scripts/seedDepartments.js

# (Optional) Create admin user
node scripts/createAdmin.js
```

5. Generate Prisma Client (if not already done):
```bash
npx prisma generate
```

6. Start backend server:
```bash
npm run dev
```
Backend server runs on http://localhost:5000

### 3. Frontend Setup
1. Navigate to frontend directory (new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend dev server:
```bash
npm run dev
```
Frontend typically runs on http://localhost:5173

## Features
- **User authentication (login, password change)**:
  - Supports role-based redirects upon successful login: `IT_ADMIN` is automatically routed to `/dashboard`, and `STAFF` is routed to the `/my-tickets` portal.
  - Active session state (`accessToken` and user object) is stored securely in the client's `localStorage`.
- **Ticket creation, viewing, updating, deletion**:
  - **Role-Based Ticket Visibility**: Standard staff only see the tickets they raised, while IT Administrators see all tickets in the IT Command Center.
  - **Read-Only Staff Dashboard**: Staff members have a clean, read-only interface where they can track their ticket statuses and view resolution notes from the admin.
  - **Admin Actions & Status Transitioning**: IT Admins can easily choose an open ticket and transition its status (e.g., `OPEN`, `IN_PROGRESS`, `RESOLVED`) and document resolution update notes.
- **Department management**:
  - Links users and tickets to respective hospital departments.
- **User Administration CRUD Console**:
  - Exposes a dedicated `/manage-users` route for administrators to view a complete roster of hospital users, edit user profiles (name, email, department), change role flags (`STAFF` vs `IT_ADMIN`), set new passwords safely, and delete user profiles.
- **Robust Security Middlewares**:
  - Secured all sensitive backend routes (including user administration and ticket modifications) using `authenticateToken` (JWT verification) and `isAdmin` middleware.
  - Sensitive `passwordHash` fields are explicitly selected out from database queries on user lists to avoid any over-the-wire credentials leakage.
- **Axios Request Interceptor**:
  - Integrates an Axios interceptor in `main.jsx` that automatically attaches the user's `Bearer` session token in the authorization header for all outgoing REST API requests.
- **File attachments with Cloudinary (optional)**

## Tech Stack
### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT (authentication)
- bcrypt (password hashing)
- Joi (validation)

### Frontend
- React
- Vite
- React Router DOM
- Formik + Yup (form handling/validation)
- Sonner (toast notifications)
- Lucide React (icons)
- React Spinners (loading indicators)

## Troubleshooting
- If backend server won't start, make sure PostgreSQL is running and DATABASE_URL is correct.
- If you get a "port already in use" error, kill the process using that port (e.g., `taskkill /F /PID &lt;pid&gt;` on Windows or `kill -9 &lt;pid&gt;` on macOS/Linux).
- If the Prisma Client isn't found, run `npx prisma generate` in the backend directory.
