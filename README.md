# SurgeVector Hackathon 2026

Phase 1 MVP foundation for an internal AI Hackathon Management Platform serving SurgeVector and Taxilla teams.

## Scope

This repository is currently scoped to the Phase 1 hackathon registration MVP:
- Landing page foundation
- Participant idea submission
- Approved team registration foundation
- Volunteer registration foundation
- Mentor management foundation
- Admin dashboard foundation
- Registration editing foundation
- Basic analytics architecture
- Simple gamification architecture

Future-phase systems such as microservices, Kubernetes, Redis, GraphQL, vector databases, AI copilots, realtime collaboration, and advanced judging are intentionally out of scope.

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in Supabase values in `.env.local`.

4. Start development:

   ```bash
   npm run dev
   ```

## Documentation

- Architecture, routes, setup, dependencies, UI primitives, and implementation order: `docs/ARCHITECTURE.md`
- Supabase schema: `supabase/migrations/`
