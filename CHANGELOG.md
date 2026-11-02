# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Frontend redesign: green theme (lime `#B6F06B`, forest `#04302B`, cream `#F7F6EE`)
- Announcement strip with pulse animation (respects prefers-reduced-motion)
- Fixed navigation: working section links, smooth scroll, active highlighting, YouTube target=_blank
- Team section with initials avatars and LinkedIn links
- Contact section with mailto/tel links (brightpathai@gmail.com, +1999999999)
- SVG illustrations (no external image dependencies)
- Team data config (`apps/web/src/lib/team.ts`)
- Copy updated for USA, Europe, Asia Pacific markets
- Mobile-first responsive design (360px–1024px+), 44px tap targets, 16px min font
- Next.js 14 frontend with Tailwind CSS, App Router, TypeScript
- Spring Boot 3 backend with Java 21, Maven
- PostgreSQL 16 database schema with Flyway migrations
- Docker Compose local development stack
- JWT authentication (15-min access / 7-day refresh with rotation)
- Magic link passwordless authentication
- Role-Based Access Control (RBAC): ADMIN, CLIENT, PROJECT_MANAGER, DEVELOPER
- AES-256-GCM encryption for sensitive fields (app-managed keys)
- bcrypt password hashing (cost factor 12)
- Redis-backed rate limiting (sliding window)
- OpenAPI 3.1 specification with Swagger UI
- CI/CD pipeline (GitHub Actions: CI, security scans, performance tests)
- k6 load and spike testing scripts
- Unit tests: Jest + React Testing Library (frontend), JUnit 5 + Testcontainers (backend)
- OWASP Top 10 compliance documentation
- Security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- Glassmorphism design system with 8px grid
- Marketing pages: Home, Services, About, Contact
- "Book a Consultation" flow with Zod validation
- Case Studies and Blog CMS (Git-based MDX)
- Client portal: project dashboard, task list, booking calendar
- Sentry error monitoring (frontend + backend)
- Daily PostgreSQL backup to S3 (30-day retention)
- PostHog analytics & user feedback loop
- Production deployment: Vercel frontend + AWS ECS Fargate backend + RDS PostgreSQL
- CloudFormation infrastructure template
- Docker multi-stage builds for web & api
- A/B testing framework (PostHog feature flags, booking form experiment)
- Cursor-based pagination for project listings
- Redis response caching service
- Next.js image optimization with CDN support
- ECS Fargate auto-scaling (CPU/memory target tracking)
- RDS read replica configuration
- CloudFront CDN distribution
- Vibe debt refactor guide and OpenAPI client generation script

### Changed
- N/A

### Fixed
- N/A

### Security
- JWT tokens stored in memory (access) and HTTP-only Secure SameSite cookie (refresh)
- Refresh token rotation with family-based revocation
- Rate limiting on auth endpoints (5 req/min per IP)
- Brute force lockout after 5 failed attempts
- Parameterized queries for all database access
- HTML sanitization for rich text fields
- Content Security Policy configured
- Dependency scanning: pnpm audit, OWASP Dependency Check, Snyk, CodeQL

---

## [0.1.0] - 2026-11-02

### Added
- Project initialization
- Phase 1: Ideation & Requirements Gathering completed
- Phase 2: Project Setup & Planning completed
  - Monorepo structure created
  - README.md, CHANGELOG.md, DEVELOPMENT.md drafted
  - Agile milestones defined (MS1-MS8, sprint-sized, marketing site first)
- Phase 3: Design & Architecture completed
  - System architecture (modular monolith: Auth, Project, CMS modules)
  - Database schema (Auth, Project, CMS, Shared schemas with RLS)
  - API design (REST + OpenAPI 3.1, /api/v1 versioning)
  - UI/UX design system (glassmorphism, dark-first, 8px grid, full component library)
- Phase 4: Security Standards completed
  - Authentication & Authorization (magic link, JWT, RBAC, RLS)
  - Input Validation & Sanitization (Zod frontend, Jakarta Validation backend)
  - Encryption Standards (AES-256-GCM, TLS 1.3, bcrypt cost 12)
  - Rate Limiting (Redis-backed sliding window)
  - Dependency Scanning (pnpm audit, OWASP Dependency Check, Snyk, CodeQL)
  - OWASP Top 10 Compliance matrix
- Phase 5: Development / Coding (initial scaffolding)
  - Frontend: Next.js + pnpm + Tailwind, home page, booking flow, UI components
  - Backend: Spring Boot + Maven + Java 21, auth controllers, project controllers, JPA entities, repositories
  - Integration: Resend email API configured
  - AI rules file (rules.md)
- Phase 6: Testing
  - Frontend: Jest + React Testing Library (80% coverage threshold)
  - Backend: JUnit 5 + Testcontainers (PostgreSQL 16 + Redis 7)
  - CI/CD: GitHub Actions workflows (CI, security, performance)
  - Performance: k6 load and spike tests
  - Security: OWASP ZAP, CodeQL SAST, Snyk, manual PT checklist
