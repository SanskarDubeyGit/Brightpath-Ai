# AI Code Standards & Rules

This file defines coding standards for AI assistants working on this project. Follow these rules strictly.

## General Principles

- **DRY**: Don't repeat yourself. Extract shared logic into utilities/composables/services.
- **Simplicity**: Prefer simple, readable code over clever abstractions.
- **Type Safety**: Use TypeScript strictly. No `any` types without justification.
- **Security First**: Validate all inputs, sanitize outputs, never log secrets.
- **Progressive Enhancement**: Core functionality works without JavaScript; enhance with JS.

## Frontend (Next.js + TypeScript + Tailwind)

### File Organization
```
apps/web/src/
  app/          # App Router pages (route segments)
  components/   # UI components (ui/ = shadcn-style primitives, features/ = domain)
  lib/          # Utilities, API clients, auth, validation
  styles/       # Global CSS, Tailwind config
  types/        # TypeScript type definitions
  lib/validations/  # Zod schemas
```

### Naming Conventions
- Components: PascalCase (`Button.tsx`, `ProjectCard.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`, `useProjects.ts`)
- Utilities: camelCase (`cn.ts`, `api.ts`, `auth.ts`)
- Types: PascalCase in dedicated `types/` files
- Zod schemas: PascalCase with `Schema` suffix (`createProjectSchema`)
- API routes: kebab-case in `app/api/`

### Component Rules
- Always use `cn()` from `@/lib/utils` for class merging
- Use `ButtonVariants` type for button variants
- Components receive `className` prop for composition
- Event handlers use `React.MouseEvent` / `React.FormEvent` types
- Props interfaces exported separately from component

### Validation
- All form inputs validated with Zod schemas
- Schemas in `lib/validations/`
- React Hook Form with `zodResolver`
- Client validation mirrors server validation

### Styling
- Tailwind utility classes only (no custom CSS unless necessary)
- Use design tokens from `tailwind.config.js`
- Glassmorphism: `glass-card`, `glass-input`, `glass-btn` classes
- Dark mode only (no light mode initially)
- Responsive: mobile-first, use `sm:`, `md:`, `lg:` prefixes

### API Calls
- Use `ApiClient` class from `@/lib/api`
- All API calls typed with interfaces from `types/`
- Error handling with try/catch + user-facing messages
- Loading states for all async operations

### Auth
- Access token stored in memory (not localStorage)
- Use `getAuthHeaders()` from `@/lib/auth`
- Protected routes checked via middleware + component-level guards

## Backend (Spring Boot + Java 21 + Maven)

### File Organization
```
apps/api/src/main/java/com/agency/
  config/       # Security, JWT, OpenAPI config
  controller/   # REST controllers
  service/      # Business logic
  repository/   # Spring Data JPA repositories
  model/        # JPA entities
  dto/          # Request/Response DTOs (records)
  exception/    # Custom exceptions
  security/     # JWT filters, auth providers
```

### Naming Conventions
- Classes: PascalCase (`ProjectController`, `AuthService`)
- Methods: camelCase (`createProject`, `getUserById`)
- Variables: camelCase (`projectId`, `accessToken`)
- Packages: lowercase dot-separated (`com.agency.controller`)
- DTOs: Java records (`CreateProjectRequest`, `ProjectResponse`)
- Entities: PascalCase matching DB tables (`Project`, `User`)

### Controller Rules
- `@RestController` + `@RequestMapping("/api/v1/...")`
- `@PreAuthorize` for authorization on every endpoint
- `@Valid` for request body validation
- Return `ResponseEntity<T>` with proper HTTP status
- Exception handling via `@RestControllerAdvice`

### Service Rules
- `@Service` + `@RequiredArgsConstructor` (Lombok)
- `@Transactional` on write operations
- Business logic in services, not controllers
- Throw `RuntimeException` for business errors (handled by advice)

### Repository Rules
- `JpaRepository<Entity, UUID>` for all entities
- Custom queries with `@Query` and `@Param`
- Pageable for list endpoints
- Soft delete pattern (deleted_at column)

### Validation
- Jakarta Validation annotations on DTOs
- Custom `@HtmlSanitized` for rich text
- Global exception handler for `MethodArgumentNotValidException`

### Security
- JWT stateless authentication
- BCrypt cost factor 12
- Passwords never logged
- AES-256-GCM for sensitive fields
- Rate limiting via Spring Cloud Gateway

## Database (PostgreSQL + Flyway)

### Migration Rules
- One migration per feature (`V1__initial_schema.sql`, `V2__seed_roles_permissions.sql`)
- Migrations are immutable once deployed
- Use `gen_random_uuid()` for UUID primary keys
- `created_at` and `updated_at` on all tables
- Soft delete with `deleted_at` column
- Indexes on foreign keys and frequently queried columns
- Row-Level Security (RLS) for multi-tenancy readiness

### Naming Conventions
- Tables: `snake_case`, plural (`users`, `project_members`)
- Columns: `snake_case` (`created_at`, `user_id`)
- Primary keys: `id` (UUID)
- Foreign keys: `{table}_id` (`user_id`, `project_id`)
- Indexes: `idx_{table}_{column(s)}`
- Constraints: `uk_{table}_{column(s)}` (unique), `fk_{table}_{column}` (foreign key)

## Code Review Checklist

### Before Submitting a PR
- [ ] TypeScript: `pnpm typecheck` passes
- [ ] Java: `./mvnw compile` passes
- [ ] Frontend tests: `pnpm test` passes
- [ ] Backend tests: `./mvnw test` passes
- [ ] Lint: `pnpm lint` passes
- [ ] No `any` types without comment justification
- [ ] All API endpoints have `@PreAuthorize`
- [ ] All inputs validated (Zod frontend, Jakarta backend)
- [ ] No secrets hardcoded
- [ ] Error messages don't leak internals
- [ ] Proper HTTP status codes
- [ ] Documentation updated if API changed

### PR Requirements
- Descriptive title following Conventional Commits
- Linked issue reference
- Screenshots for UI changes
- Test coverage for new logic
- CHANGELOG.md updated

## Commit Message Format

```
type(scope): description

- Bullet point of changes
- Another change

Closes #123
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `security`

Scopes: `web`, `api`, `auth`, `project`, `cms`, `config`, `deps`

## Forbidden Patterns

- `any` type in TypeScript (use proper types or `unknown`)
- `console.log` in production code
- Hardcoded secrets or API keys
- String concatenation in SQL queries
- `dangerouslySetInnerHTML` without DOMPurify
- LocalStorage for sensitive tokens
- Skipping validation on any endpoint
- Missing error handling on async operations