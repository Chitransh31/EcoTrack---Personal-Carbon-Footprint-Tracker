# EcoTrack — Personal Carbon Footprint Tracker

A full-stack web application for tracking daily carbon emissions from transport, energy, and food activities. Built with Next.js, NextAuth.js, Drizzle ORM, SQLite, and Tailwind CSS.

## Features

- **Activity Logging** — Log daily activities across three categories: Transport (car, bus, train, flight, bike, walk), Energy (electricity, natural gas, heating oil), and Food (meat, dairy, vegetables, vegan meals)
- **CO2 Calculation** — Each activity is matched to scientifically-sourced emission factors (DEFRA, EPA, IPCC) and automatically converted to CO2 equivalent
- **Interactive Dashboard** — Visualize emissions with a category breakdown donut chart and a time-series trend chart, filterable by week/month/year
- **Multi-Provider Auth** — Sign in with Google OAuth or email/password credentials via NextAuth.js v5
- **Security Hardened** — Protection against OWASP Top 10 including XSS, SQL injection, IDOR, CSRF, with CSP headers and server-side Zod validation
- **CI/CD Pipeline** — GitHub Actions workflow for type checking, linting, formatting, and build verification on every PR

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Auth | NextAuth.js v5 (Auth.js) |
| ORM | Drizzle ORM |
| Database | SQLite (better-sqlite3, WAL mode) |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Validation | Zod |
| CI/CD | GitHub Actions + Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ecotrack.git
cd ecotrack

# Install dependencies
npm install
```

### Environment Setup

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=           # Generate: openssl rand -base64 32
GOOGLE_CLIENT_ID=          # From Google Cloud Console (optional)
GOOGLE_CLIENT_SECRET=      # From Google Cloud Console (optional)
```

> **Note:** Google OAuth credentials are optional. You can use email/password authentication without them. To set up Google OAuth, create credentials in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) with `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.

### Database Setup

```bash
# Create tables
npm run db:push

# Seed emission factors
npm run db:seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                          # Next.js App Router pages & API routes
│   ├── (auth)/                   # Login & Register pages
│   ├── dashboard/                # Dashboard, activity log, history
│   └── api/                      # REST API endpoints
│       ├── auth/                 # NextAuth + registration
│       └── activities/           # Activity CRUD
├── lib/                          # Server-side business logic
│   ├── auth.ts                   # NextAuth configuration
│   ├── db/                       # Drizzle schema, client, seed
│   ├── emissions.ts              # CO2 calculation
│   └── validations.ts            # Zod schemas
├── components/                   # React components
│   ├── ui/                       # Generic (Button, Input, Card, Select)
│   └── charts/                   # Recharts visualizations
├── middleware.ts                  # Route protection
└── types/                        # Shared TypeScript types
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth handlers |
| GET | `/api/activities` | List user's activities (supports `?from=&to=&category=` filters) |
| POST | `/api/activities` | Log a new activity |
| GET | `/api/activities/[id]` | Get a single activity |
| PUT | `/api/activities/[id]` | Update an activity |
| DELETE | `/api/activities/[id]` | Delete an activity |

All `/api/activities` endpoints require authentication and enforce ownership checks.

## Emission Factors

| Category | Activity | g CO2e / unit | Unit |
|---|---|---|---|
| Transport | Car | 170 | km |
| Transport | Bus | 89 | km |
| Transport | Train | 41 | km |
| Transport | Flight | 255 | km |
| Transport | Bike / Walk | 0 | km |
| Energy | Electricity | 420 | kWh |
| Energy | Natural Gas | 205 | kWh |
| Energy | Heating Oil | 270 | kWh |
| Food | Meat | 3,000 | serving |
| Food | Dairy | 1,200 | serving |
| Food | Vegetables | 500 | serving |
| Food | Vegan | 400 | serving |

Sources: DEFRA 2023, EPA, IPCC

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check formatting
npm run type-check   # TypeScript type checking
npm run db:push      # Push schema to database
npm run db:seed      # Seed emission factors
npm run db:studio    # Open Drizzle Studio (DB viewer)
```

## Security

This application implements protections against the OWASP Top 10:

- **SQL Injection** — Drizzle ORM parameterized queries (no raw SQL)
- **XSS** — React auto-escaping + Content Security Policy headers
- **IDOR** — Server-side ownership verification on every resource access
- **CSRF** — Built-in NextAuth v5 CSRF tokens
- **Broken Authentication** — bcrypt password hashing (cost 12), JWT httpOnly cookies
- **Security Misconfiguration** — CSP, X-Frame-Options, X-Content-Type-Options, Permissions-Policy headers
- **Input Validation** — Zod schemas on all API inputs, server-side

## License

MIT
