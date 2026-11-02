# API Design (REST + OpenAPI 3.1)

## Base Configuration

- **Base URL**: `/api/v1`
- **Format**: JSON (request/response)
- **Auth**: Bearer JWT (Access Token)
- **Versioning**: URL path (`/api/v1/`, `/api/v2/`)
- **Rate Limits**: 100 req/min (authenticated), 20 req/min (anonymous)

## Common Headers

| Header | Description |
|--------|-------------|
| `Authorization` | `Bearer <access_token>` |
| `Idempotency-Key` | Required for POST/PUT/DELETE (UUID) |
| `Accept-Language` | `en`, `hi`, `es`, `fr`, `de` |
| `X-Request-ID` | Echoed in response for tracing |

## Error Response Format

```json
{
  "timestamp": "2026-11-02T14:30:00Z",
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Invalid request payload",
  "path": "/api/v1/bookings",
  "requestId": "req_abc123",
  "details": [
    { "field": "slot_id", "code": "NOT_FOUND", "message": "Booking slot not found" }
  ]
}
```

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Request body validation failed |
| `UNAUTHENTICATED` | 401 | Missing/invalid/expired token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (duplicate, state) |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Auth Endpoints (`/api/v1/auth`)

### POST `/register`
Register new user (public)

**Request**
```json
{
  "email": "client@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "locale": "en"
}
```

**Response** `201`
```json
{
  "user": { "id": "uuid", "email": "...", "fullName": "...", "emailVerified": false },
  "message": "Verification email sent"
}
```

### POST `/login`
Authenticate user

**Request**
```json
{
  "email": "client@example.com",
  "password": "securePassword123",
  "rememberMe": true,
  "mfaCode": "123456"
}
```

**Response** `200`
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "expiresIn": 900,
  "tokenType": "Bearer",
  "user": { "id": "uuid", "email": "...", "fullName": "...", "roles": ["CLIENT"] }
}
```

### POST `/refresh`
Refresh access token

**Request**
```json
{ "refreshToken": "eyJ..." }
```

**Response** `200` (new access + refresh token pair)

### POST `/logout`
Revoke refresh token

**Request**
```json
{ "refreshToken": "eyJ..." }
```

### POST `/forgot-password`
Request password reset email

### POST `/reset-password`
Reset password with token from email

### GET `/me`
Get current user profile

**Response** `200`
```json
{
  "id": "uuid",
  "email": "client@example.com",
  "fullName": "John Doe",
  "avatarUrl": "https://...",
  "locale": "en",
  "timezone": "UTC",
  "roles": ["CLIENT"],
  "permissions": ["project:read", "booking:write"],
  "mfaEnabled": true
}
```

### PUT `/me`
Update profile (name, avatar, locale, timezone)

### POST `/mfa/totp/enable`
Initiate TOTP setup (returns QR code + secret)

### POST `/mfa/totp/verify`
Verify TOTP code to enable

### POST `/mfa/totp/disable`
Disable TOTP (requires password)

### GET `/oauth/providers`
List linked OAuth providers

### DELETE `/oauth/providers/{provider}`
Unlink OAuth provider

---

## User Management (`/api/v1/users`) — Admin/PM only

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List users (paginated, filterable) |
| GET | `/{id}` | Get user by ID |
| PUT | `/{id}` | Update user (roles, active status) |
| DELETE | `/{id}` | Soft delete user |

---

## Project Endpoints (`/api/v1/projects`)

### GET `/`
List projects (paginated)

**Query Params**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | int | 0 | Page number |
| `size` | int | 20 | Page size (max 100) |
| `sort` | string | `createdAt,desc` | Sort field,direction |
| `status` | string | — | Filter by status |
| `clientId` | uuid | — | Filter by client (admin) |

**Response** `200`
```json
{
  "content": [
    {
      "id": "uuid",
      "name": "E-commerce Platform",
      "slug": "ecommerce-platform",
      "status": "IN_PROGRESS",
      "startDate": "2026-01-15",
      "endDate": "2026-06-30",
      "client": { "id": "uuid", "fullName": "John Doe" },
      "manager": { "id": "uuid", "fullName": "Jane Smith" },
      "progress": 65,
      "milestoneCount": 4,
      "taskCount": 23,
      "completedTaskCount": 15
    }
  ],
  "page": { "number": 0, "size": 20, "totalElements": 45, "totalPages": 3 }
}
```

### POST `/`
Create project (Admin/PM)

**Request**
```json
{
  "clientId": "uuid",
  "managerId": "uuid",
  "name": "New Project",
  "description": "Project description",
  "startDate": "2026-02-01",
  "endDate": "2026-07-31",
  "budgetCents": 5000000,
  "currency": "USD"
}
```

### GET `/{id}`
Get project detail

**Response** `200`
```json
{
  "id": "uuid",
  "name": "E-commerce Platform",
  "slug": "ecommerce-platform",
  "description": "Full-stack e-commerce...",
  "status": "IN_PROGRESS",
  "startDate": "2026-01-15",
  "endDate": "2026-06-30",
  "budgetCents": 5000000,
  "currency": "USD",
  "repositoryUrl": "https://github.com/...",
  "client": { "id": "uuid", "fullName": "John Doe", "email": "..." },
  "manager": { "id": "uuid", "fullName": "Jane Smith" },
  "members": [
    { "userId": "uuid", "fullName": "...", "role": "DEVELOPER", "joinedAt": "..." }
  ],
  "milestones": [...],
  "recentActivity": [...]
}
```

### PUT `/{id}`
Update project

### DELETE `/{id}`
Archive project (soft delete)

### GET `/{id}/progress`
Get project progress summary

**Response** `200`
```json
{
  "overallProgress": 65,
  "milestoneProgress": [
    { "id": "uuid", "name": "Discovery", "progress": 100 },
    { "id": "uuid", "name": "Development", "progress": 60 }
  ],
  "taskStats": { "total": 23, "completed": 15, "inProgress": 5, "blocked": 1 },
  "upcomingMilestones": [...]
}
```

---

## Milestone Endpoints (`/api/v1/projects/{projectId}/milestones`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List milestones |
| POST | `/` | Create milestone |
| GET | `/{id}` | Get milestone |
| PUT | `/{id}` | Update milestone |
| DELETE | `/{id}` | Delete milestone |
| PUT | `/{id}/complete` | Mark complete |
| PUT | `/{id}/reopen` | Reopen milestone |

---

## Task Endpoints (`/api/v1/projects/{projectId}/tasks`)

### GET `/`
List tasks (paginated, filterable)

**Query Params**: `page`, `size`, `sort`, `status`, `type`, `priority`, `assigneeId`, `milestoneId`

### POST `/`
Create task

**Request**
```json
{
  "title": "Implement checkout flow",
  "description": "Integrate Stripe...",
  "type": "FEATURE",
  "priority": "HIGH",
  "milestoneId": "uuid",
  "assigneeId": "uuid",
  "storyPoints": 8,
  "dueDate": "2026-03-15"
}
```

### GET `/{id}`
Get task detail (with comments, activity)

### PUT `/{id}`
Update task

### PATCH `/{id}/status`
Update task status

**Request**
```json
{ "status": "IN_PROGRESS" }
```

### DELETE `/{id}`
Delete task

### GET `/{id}/comments`
List comments

### POST `/{id}/comments`
Add comment

---

## Booking Endpoints (`/api/v1/bookings`)

### GET `/slots`
List available booking slots

**Query Params**: `hostId`, `from`, `to`, `timezone`, `duration`

### GET `/slots/{id}`
Get slot detail

### POST `/`
Create booking (client)

**Request**
```json
{
  "slotId": "uuid",
  "projectId": "uuid",           // optional (pre-sales)
  "notes": "Want to discuss timeline"
}
```

### GET `/{id}`
Get booking detail

### PUT `/{id}`
Update booking (client: notes; host: meetingUrl)

### POST `/{id}/confirm`
Confirm booking (host)

### POST `/{id}/cancel`
Cancel booking (client or host)

### GET `/my-bookings`
List current user's bookings (paginated)

**Query Params**: `status`, `from`, `to`

---

## CMS Endpoints (`/api/v1/cms`)

### Case Studies

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/case-studies` | List published (paginated, filterable by technology, industry) |
| GET | `/case-studies/{slug}` | Get by slug (public) |
| GET | `/admin/case-studies` | List all (admin, with drafts) |
| POST | `/admin/case-studies` | Create |
| PUT | `/admin/case-studies/{id}` | Update |
| DELETE | `/admin/case-studies/{id}` | Delete |
| POST | `/admin/case-studies/{id}/publish` | Publish |
| POST | `/admin/case-studies/{id}/unpublish` | Unpublish |

### Blog Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/blog` | List published (paginated, filterable by category, tag) |
| GET | `/blog/{slug}` | Get by slug (public, increments view_count) |
| GET | `/admin/blog` | List all (admin) |
| POST | `/admin/blog` | Create |
| PUT | `/admin/blog/{id}` | Update |
| DELETE | `/admin/blog/{id}` | Delete |
| POST | `/admin/blog/{id}/publish` | Publish |

### Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pages/{slug}` | Get page by slug (public) |
| GET | `/admin/pages` | List all (admin) |
| POST | `/admin/pages` | Create |
| PUT | `/admin/pages/{id}` | Update |
| DELETE | `/admin/pages/{id}` | Delete |

### Categories & Tags

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | List all |
| GET | `/tags` | List all |

---

## File Upload (`/api/v1/files`)

### POST `/presigned-url`
Get presigned S3 URL for direct upload

**Request**
```json
{
  "filename": "design.pdf",
  "contentType": "application/pdf",
  "sizeBytes": 1048576,
  "purpose": "PROJECT_DELIVERABLE"  // or CASE_STUDY_IMAGE, AVATAR, etc.
}
```

**Response** `200`
```json
{
  "uploadUrl": "https://s3.amazonaws.com/...",
  "fileId": "uuid",
  "expiresAt": "2026-11-02T15:00:00Z"
}
```

### POST `/complete`
Confirm upload complete

**Request**
```json
{ "fileId": "uuid" }
```

### GET `/{id}`
Get file metadata (with signed download URL)

### DELETE `/{id}`
Delete file (soft)

---

## Webhooks (`/api/v1/webhooks`)

### POST `/stripe`
Stripe payment events

### POST `/github`
GitHub push/PR events (for repository_url sync)

---

## OpenAPI Spec Location

- **Source**: `apps/api/src/main/resources/openapi/openapi.yaml`
- **Generated UI**: `/swagger-ui.html` (SpringDoc)
- **JSON**: `/v3/api-docs`

## Client SDK Generation

```bash
# Generate TypeScript client for Next.js
npx @openapitools/openapi-generator-cli generate \
  -i apps/api/src/main/resources/openapi/openapi.yaml \
  -g typescript-axios \
  -o apps/web/src/lib/api-client
```

Run in CI on API changes to keep frontend types in sync.