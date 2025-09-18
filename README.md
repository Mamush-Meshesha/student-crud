# Student Registration CRUD

## Requirements
- Node 18+
- PostgreSQL
- npm

## Setup (backend)
1. `cd backend`
2. copy `.env.example` to `.env` and set `DATABASE_URL` (Postgres).
3. `npm install`
4. `npx prisma migrate dev --name init`
5. `npm run dev` (starts server on 4000)

## Setup (frontend)
1. `cd frontend`
2. `npm install`
3. set `.env.local`:


4. `npm run dev` — Next runs on 3000

## API
- `GET /api/students` — list
- `GET /api/students/:id`
- `POST /api/students` — fields: firstName, lastName, email, age, picture (multipart/form-data)
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

