# System Architecture

## Overview

Modular monolith Spring Boot backend serving a Next.js frontend via REST API. Single deployable JAR with clear module boundaries for future service extraction.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Web App   │  │  Mobile App │  │  Third-Party│             │
│  │  (Next.js)  │  │  (Future)   │  │  Integrations│            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
└─────────┼────────────────┼────────────────┼────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY (Spring Cloud Gateway)           │
│              Rate Limiting │ Auth Validation │ Routing           │
└────────────────────────────┬────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Auth Module   │ │  Project Module │ │   CMS Module    │
│  (Users, Roles, │ │ (Projects,      │ │ (Case Studies,  │
│   MFA, OAuth)   │ │  Milestones,    │ │  Blog, Pages)   │
│                 │ │  Tasks, Booking)│ │                 │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SHARED KERNEL                               │
│  Database (PostgreSQL) │ Redis Cache │ Event Bus │ File Storage │
└─────────────────────────────────────────────────────────────────┘
```

## Module Boundaries

| Module | Package | Responsibility | Tables |
|--------|---------|----------------|--------|
| **Auth** | `com.agency.auth` | Authentication, authorization, user management, MFA, OAuth2 | `users`, `roles`, `permissions`, `mfa_devices`, `oauth_providers`, `refresh_tokens` |
| **Project** | `com.agency.project` | Project lifecycle, milestones, tasks, client portal access, bookings | `projects`, `milestones`, `tasks`, `project_members`, `bookings`, `booking_slots` |
| **CMS** | `com.agency.cms` | Marketing content: case studies, blog posts, pages, SEO | `case_studies`, `blog_posts`, `pages`, `categories`, `tags`, `media` |
| **Shared** | `com.agency.shared` | Common utilities, exceptions, events, security config, database config | — |

## Communication Patterns

- **Sync**: REST (JSON) via Spring MVC controllers → OpenAPI 3.1 spec
- **Async**: Spring Application Events for domain events (e.g., `ProjectCreatedEvent`, `BookingConfirmedEvent`)
- **Caching**: Redis for session store, rate limiting, CMS content caching
- **File Storage**: Local/S3-compatible (encrypted at rest via AES-256)

## Security Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      CLIENT REQUEST                          │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────┐
│                  API GATEWAY (GatewayFilter)                │
│  • Rate limiting (per IP, per user)                         │
│  • JWT validation (signature, expiry, claims)               │
│  • CORS, security headers (CSP, HSTS, X-Frame-Options)      │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────┐
│                   MODULE SECURITY                           │
│  @PreAuthorize("hasRole('CLIENT')")                         │
│  @PreAuthorize("@projectSecurity.canAccess(#projectId)")    │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│  • Row-level security policies (PostgreSQL RLS)             │
│  • AES-256 encryption for sensitive fields                  │
│  • Audit logging (created_by, updated_by, timestamps)       │
└────────────────────────────────────────────────────────────┘
```

## Deployment Topology

| Environment | Frontend | Backend | Database | Cache |
|-------------|----------|---------|----------|-------|
| **Local** | `localhost:3000` | `localhost:8080` | Docker Compose | Docker Compose |
| **Staging** | Vercel Preview | Kubernetes (1 replica) | Cloud SQL (PostgreSQL) | Redis (managed) |
| **Production** | Vercel/Netlify | Kubernetes (HPA, 3+ replicas) | Cloud SQL (HA, read replicas) | Redis Cluster |

## Observability

- **Logs**: Structured JSON (Logstash format) → Loki/Grafana
- **Metrics**: Micrometer → Prometheus → Grafana dashboards
- **Traces**: OpenTelemetry → Jaeger
- **Errors**: Sentry (frontend + backend)

## Future Extraction Points

When scaling demands, these modules can become independent services:

1. **Auth Service** → OAuth2/OIDC provider (Keycloak or custom)
2. **Project Service** → Core domain, high write throughput
3. **CMS Service** → Read-heavy, CDN-friendly
4. **Notification Service** → Email, push, webhooks
5. **File Service** → S3 + processing pipeline

Each extraction follows: shared kernel → separate database → async events → API gateway routing.