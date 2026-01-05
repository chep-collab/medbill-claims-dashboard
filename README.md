# Medbill – Claims Dashboard

A production-ready medical claims management dashboard built with React, TypeScript, Supabase, and Vercel.

🔗 Live Demo: https://medbill-claims-dashboard.vercel.app/

## Features
- View and manage medical claims
- Filter by status (Paid, Pending, Submitted, Denied)
- Full-text search by patient name or claim number
- KPI metrics for Pending & Denied amounts
- Edit claim status and notes (persisted via Supabase)
- CSV export for reporting
- Fully typed with TypeScript
- Unit-tested business logic (Jest)

## Tech Stack
- React + TypeScript
- Vite
- Supabase (PostgreSQL)
- Recharts
- Jest
- Vercel

## Running Locally
```bash
npm install
npm run dev
Tests
npm test

Deployment

Deployed on Vercel with CI/CD from GitHub.

Why This Project

This project demonstrates real-world frontend engineering:

Data fetching & mutation

Derived state via hooks

Separation of UI and business logic

Testable utility functions

Production deployment
