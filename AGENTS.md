# AGENTS.md

# SurgeVector Hackathon 2026

This document defines strict engineering and scope rules for AI coding agents working on this repository.

========================================
PROJECT PURPOSE
========================================

Build an enterprise-grade internal AI Hackathon Management Platform for:

- SurgeVector Teams
- Taxilla Teams

The platform should support:
- registrations
- mentor allocation
- volunteer coordination
- dashboards
- hackathon operations

The application must feel modern, scalable, and enterprise-ready.

========================================
IMPORTANT: PHASED DEVELOPMENT
========================================

The platform will be developed in multiple phases.

AI agents MUST ONLY implement the current active phase.

Do NOT generate future-phase features unless explicitly requested.

========================================
CURRENT ACTIVE PHASE
========================================

PHASE 1 — MVP REGISTRATION PLATFORM

Only build:

1. Landing page
2. Team registration
3. Volunteer registration
4. Mentor management
5. Admin dashboard
6. Registration editing
7. Basic analytics
8. Simple gamification
9. Responsive UI
10. Email notifications

========================================
STRICTLY OUT OF SCOPE FOR PHASE 1
========================================

DO NOT BUILD:

- Kubernetes
- Microservices
- Redis
- GraphQL
- Vector databases
- AI copilots
- AI chat systems
- Team chat
- Realtime collaboration
- WebSockets
- Event-driven architecture
- AI recommendation engines
- AI mentor assistants
- Advanced judging workflows
- Multi-tenant architecture
- Complex CI/CD pipelines
- Advanced infra provisioning
- Enterprise SSO integrations
- Video hosting
- Streaming systems

These belong to later phases.

========================================
PHASE 1 TECH STACK
========================================

Frontend:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

Backend:
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage

Deployment:
- Vercel

Forms:
- React Hook Form
- Zod validation

========================================
PHASE 1 ARCHITECTURE RULES
========================================

- Use modular architecture
- Use feature-based folder structure
- Use reusable components
- Use TypeScript types everywhere
- Keep business logic isolated
- Avoid premature abstraction
- Prefer simplicity over enterprise complexity
- Build production-quality UI

========================================
PHASE 1 UI/UX RULES
========================================

Design language:
- futuristic enterprise UI
- AI-inspired visuals
- premium glassmorphism
- orange + black + white color palette
- subtle animations
- responsive design
- accessible interfaces

Avoid:
- clutter
- overly flashy animations
- complex dashboards initially

========================================
PHASE 1 TEAM RULES
========================================

Team registration constraints:
- minimum 1 member
- maximum 4 members

Mentor system requirements:
- mentor capacity limits
- mentor availability toggle
- manual mentor reassignment
- admin override support

========================================
PHASE 1 GAMIFICATION
========================================

Allowed:
- participation points
- badges
- simple leaderboard
- completion progress tracker

Do NOT implement:
- realtime scoring
- XP engines
- audience voting
- advanced ranking systems

========================================
DATABASE RULES
========================================

Use PostgreSQL via Supabase.

All tables should:
- use UUID primary keys
- include timestamps
- support soft deletes where appropriate
- maintain auditability

========================================
ENGINEERING RULES
========================================

- Keep code clean and readable
- Avoid unnecessary dependencies
- Prefer server actions when suitable
- Use loading and error states
- Use reusable validation schemas
- Use environment variables correctly
- Keep components small and composable

========================================
DEVELOPMENT PRIORITY ORDER
========================================

1. Project setup
2. Landing page
3. Supabase schema
4. Team registration
5. Volunteer registration
6. Admin dashboard
7. Mentor management
8. Registration editing
9. Gamification
10. Analytics

========================================
IMPORTANT
========================================

Always prioritize:
- speed
- maintainability
- UI polish
- operational simplicity

Do NOT overengineer the MVP.
