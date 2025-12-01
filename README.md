# Solvro Bingo

A modern web application for managing interactive bingo games with user submissions, admin verification, and real-time leaderboards. Built with Next.js 16, TypeScript, and PostgreSQL.

## Features

### For Users
- **Interactive Bingo Board**: 4x4 grid with customizable tiles
- **Submission System**: Submit images and messages for tile verification
- **Progress Tracking**: Visual progress bars showing completion status
- **Real-time Leaderboard**: Top 10 users ranked by verified tiles
- **Responsive Design**: Mobile-friendly interface with smooth animations

### For Admins
- **Review Dashboard**: Swipe-through interface for reviewing submissions
- **Quick Actions**: Approve or reject submissions with optional reasons
- **Submission Queue**: View pending submissions sorted by date
- **User Management**: Track all user activities and submissions

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)

## Prerequisites

- Node.js 22.x or higher
- PostgreSQL database
- npm/yarn/pnpm

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tomasz-trela/web-solvro-bingo.git
cd web-solvro-bingo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bingo"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 4. Set up the database

```bash
# Generate database migrations
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with sample data
npm run db:seed

# Or seed production data
npm run db:seed:prod
```

### 5. Create an admin user

```bash
npm run create:admin
```

Follow the prompts to create an admin account.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate database migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |
| `npm run db:seed` | Seed database with development data |
| `npm run db:seed:prod` | Seed database with production data |
| `npm run create:admin` | Create admin user |
| `npm run db:truncate` | Clear all database tables |

## Project Structure

```
web-solvro-bingo/
├── app/                      # Next.js app directory
│   ├── admin/               # Admin dashboard
│   ├── api/                 # API routes
│   ├── leaderboard/         # Leaderboard page
│   ├── login/               # Authentication pages
│   ├── register/
│   └── submission/          # Submission form
├── components/              # React components
│   ├── admin/              # Admin-specific components
│   ├── dashboard/          # Dashboard components
│   ├── leaderboard/        # Leaderboard components
│   ├── shared/             # Shared/reusable components
│   └── submission/         # Submission form components
├── db/                      # Database layer
│   ├── schema.ts           # Database schema
│   ├── queries.ts          # Database queries
│   ├── seed.ts             # Development seed data
│   └── migrations/         # Database migrations
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
└── types/                   # TypeScript type definitions
```

## Database Schema

### Tables

- **users**: User accounts with role-based access (user/admin)
- **bingo_set_tiles**: Template tiles for bingo boards (multiple sets)
- **bingo_items**: User-specific tile instances with status tracking
- **bingo_submissions**: User submissions with images and messages

### Tile Statuses

- `unverified`: Initial state, no submission yet
- `pending`: Submitted and awaiting admin review
- `verified`: Approved by admin
- `rejected`: Rejected by admin with optional reason

## Features in Detail

### Leaderboard Ranking

Users are ranked by:
1. Number of verified tiles (descending)
2. Date of last verified submission excluding tile at index 7 (ascending)

Maximum score: 16 verified tiles per user.

### Submission Workflow

1. User selects a tile from their bingo board
2. Uploads image (optional) and message (required)
3. Tile status changes to "pending"
4. Admin reviews submission in dashboard
5. Admin approves (verified) or rejects with reason
6. User sees updated status on their board

### Security

- Password hashing with bcryptjs
- Session-based authentication via NextAuth.js
- Role-based access control (user/admin)
- Protected API routes
- SQL injection prevention via Drizzle ORM
