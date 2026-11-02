# Development Workflow & Commands

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20.x LTS | Frontend runtime |
| pnpm | 9.x | Fast, disk-efficient package manager |
| JDK | 21 (Temurin) | Spring Boot backend |
| Maven | 3.9+ (wrapper included) | Backend build |
| Docker | 25+ | Local PostgreSQL, Redis, etc. |
| PostgreSQL | 16 | Primary database |
| Git | 2.45+ | Version control |

## Environment Variables

Copy `.env.example` to `.env` in each app:

```bash
# apps/web/.env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# apps/api/.env (or application-local.yml)
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/agency
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
JWT_SECRET=your-256-bit-secret
```

## Common Commands

### Frontend (`apps/web`)

```bash
cd apps/web

# Install dependencies
pnpm install

# Development server (with Turbopack)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint & format
pnpm lint
pnpm format

# Type check
pnpm typecheck

# Run tests
pnpm test
pnpm test:watch
pnpm test:coverage
```

### Backend (`apps/api`)

```bash
cd apps/api

# Run with Maven wrapper
./mvnw spring-boot:run

# Run tests
./mvnw test

# Package JAR
./mvnw package -DskipTests

# Generate database migration (Flyway)
./mvnw flyway:migrate

# Dependency check
./mvnw dependency:analyze
./mvnw org.owasp:dependency-check-maven:check
```

### Docker Compose (Local Stack)

```bash
# From repo root
docker-compose up -d          # Start PostgreSQL, Redis, etc.
docker-compose logs -f        # Follow logs
docker-compose down -v        # Stop & remove volumes
```

## Git Workflow

### Branch Naming

| Type | Prefix | Example |
|------|--------|---------|
| Feature | `feat/` | `feat/booking-flow` |
| Bug fix | `fix/` | `fix/cors-header` |
| Chore | `chore/` | `chore/update-deps` |
| Docs | `docs/` | `docs/api-spec` |
| Refactor | `refactor/` | `refactor/auth-service` |
| Test | `test/` | `test/booking-unit` |

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(web): add booking consultation form

- Create form component with validation
- Integrate with email API
- Add analytics tracking

Closes #42
```

### Pull Requests

1. Create PR against `main`
2. Fill PR template (linked issues, testing notes, screenshots)
3. Require: CI passing, 1 approval, up-to-date with `main`
4. Squash merge

## CI/CD Overview (GitHub Actions)

| Workflow | Trigger | Jobs |
|----------|---------|------|
| `ci.yml` | PR / push to main | Lint, typecheck, test, build (web & api) |
| `security.yml` | Weekly / PR | Dependency audit, OWASP scan, SAST |
| `deploy-staging.yml` | Push to main | Build & deploy to staging |
| `deploy-prod.yml` | Tag `v*` | Build, security gate, deploy to prod |

## 10-Phase Development Roadmap

### Phase 1: Ideation & Requirements Gathering ✅ COMPLETED
- Core idea, user personas, target markets defined
- Tech stack validated (Next.js + Spring Boot + PostgreSQL)
- NFRs established: GDPR/CCPA, JWT, AES-256, mobile performance

### Phase 2: Project Setup & Planning ✅ COMPLETED
- [x] Monorepo structure created
- [x] README.md, CHANGELOG.md, DEVELOPMENT.md drafted
- [x] Agile milestones defined (sprint-sized, marketing site first)
- [ ] GitHub repo initialized with branch protection
- [ ] GitHub Actions CI skeleton
- [ ] Docker compose for local dev stack

### Phase 3: Design & Architecture ✅ COMPLETED
- [x] System architecture diagram (components, gateways, data flow)
- [x] Database schema (tables, indexes, migrations)
- [x] REST API design (OpenAPI spec)
- [x] UI/UX wireframes (responsive, animations, glassmorphism)

### Phase 4: Security Standards ✅ COMPLETED
- [x] JWT authentication & bcrypt password hashing
- [x] MFA scaffold (TOTP/WebAuthn)
- [x] OAuth2/OIDC integration (Google, GitHub, Microsoft)
- [x] Input validation & sanitization (XSS, SQLi)
- [x] HTTPS/TLS configuration, AES-256 for documents
- [x] Rate limiting per IP
- [x] Dependency scanning (OWASP Dependency Check)
- [x] OWASP Top 10 compliance checklist

### Phase 5: Development / Coding ✅ COMPLETED (initial scaffolding)
- [x] Frontend: Marketing pages (Home, Services, About, Contact)
- [x] Frontend: Design system (Tailwind config, glassmorphism components)
- [x] Frontend: "Book a Consultation" flow + analytics
- [x] Frontend: CMS integration (case studies, blog)
- [x] Frontend: SEO optimization (ISR, sitemap, meta tags)
- [x] Backend: Auth endpoints (register, login, refresh, MFA)
- [x] Backend: Project/Invoice/File CRUD APIs
- [x] Backend: Email service integration
- [x] AI rules file (`rules.md`) for code standards
- [x] Code review pass (DRY, simplicity)

### Phase 6: Testing ✅ COMPLETED
- [x] Unit tests ≥ 80% coverage (Jest/React Testing Library, JUnit)
- [x] Integration tests (API flows, mock services)
- [x] Security testing (SAST/DAST, OWASP ZAP)
- [x] Performance testing (caching, concurrency, Lighthouse)

### Phase 7: Documentation & Logging ✅ COMPLETED
- [x] Inline docs (JSDoc, JavaDoc)
- [x] OpenAPI/Swagger UI for REST API
- [x] CHANGELOG.md updated per milestone

### Phase 8: Deployment ✅ COMPLETED
- [x] GitHub Actions CI/CD pipeline (CI, security, deploy workflows)
- [x] Docker images for web & api (multi-stage builds)
- [x] Production hosting setup (Vercel frontend + AWS ECS backend + RDS PostgreSQL)
- [x] Infrastructure as Code (CloudFormation template)

### Phase 9: Monitoring & Maintenance ✅ COMPLETED
- [x] Sentry error monitoring (frontend + backend)
- [x] Daily backup scripts (PostgreSQL to S3, 30-day retention)
- [x] PostHog analytics & user feedback loop

### Phase 10: Iteration & Scaling ✅ COMPLETED
- [x] A/B testing framework (PostHog flags, booking form experiment)
- [x] Vibe debt refactor (component deduplication, utility consolidation, API standardization, shared types, full codebase review)
- [x] Scale optimizations (cursor-based pagination, Redis caching, image optimization, CDN setup, ECS auto-scaling, read replicas)

---

## Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Conventional Commits](https://www.conventionalcommits.org/)