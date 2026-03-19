# LMS for AI Finance CA Students

A Learning Management System (LMS) built for students attending the AI Finance CA course. It provides a complete student portal, tutor portal, and admin portal with role-based access.

## Features

- **Authentication**: Email/password login with 3-attempt lockout and password reset flow
- **Student Portal**: Dashboard, profile, class schedule, attendance calendar, notices, resources (PDFs/links), learning modules progress, practice tests with timer and scored results
- **Tutor Portal**: Create quizzes/exams, post notices, share resources, view student rankings leaderboard
- **Admin Portal**: Upload student data from CSV with validation, manage students and tutors, unlock locked accounts

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | student1@test.com | password123 |
| Student | student2@test.com | password123 |
| Tutor | tutor1@test.com | password123 |
| Admin | admin@test.com | admin123 |

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- In-memory mock data (no external database required)

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
