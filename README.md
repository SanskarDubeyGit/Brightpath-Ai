# Brightpath Ai — IT Consulting & Services Website

A modern, full-stack website and secure client portal for Brightpath Ai, an IT consulting and software service agency offering web development, mobile app development, e-commerce, ERP solutions, and system scaling.

## Tech Stack

- **Frontend**: Next.js 14 (React) + Tailwind CSS
- **Backend**: Java Spring Boot 3
- **Database**: PostgreSQL 16
- **Monorepo**: Single GitHub repository with `apps/web` and `apps/api`

## Deployment

Frontend is deployed on **Netlify**. Backend runs on AWS ECS Fargate.

## Quick Start

```bash
# Start local development stack (PostgreSQL, etc.)
docker-compose up -d

# Frontend
cd apps/web && pnpm install && pnpm run dev

# Backend
cd apps/api && ./mvnw spring-boot:run
```

## Folder Structure

```
├── apps/
│   ├── web/          # Next.js marketing site + client portal
│   └── api/          # Spring Boot REST API
├── packages/
│   └── ui/           # Shared UI component library (future)
├── docs/             # Architecture, design, security docs
├── netlify.toml      # Netlify deployment config
├── docker-compose.yml
├── docker-compose.prod.yml
└── DEVELOPMENT.md    # Full workflow & phase walkthrough
```

## Documentation

- [Development Workflow & Commands](DEVELOPMENT.md)
- [Architecture Overview](docs/architecture/)
- [Design System](docs/design/)
- [Security Standards](docs/security/)

## Target Markets

- **India** (Launch): Local shop owners seeking e-commerce digitization
- **USA**: Startup founders seeking fast, modern MVPs
- **Europe**: Decision-makers seeking secure, enterprise-grade scaling & compliance

## License

Proprietary — All rights reserved.