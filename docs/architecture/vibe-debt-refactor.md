# Vibe Debt Refactor Plan (Step 36)

## Overview

This document outlines the codebase refactoring to eliminate "vibe debt" — accumulated inconsistencies, duplication, and anti-patterns across all 10 phases of development.

## Focus Areas

### 1. Component Deduplication

| Duplication | Current State | Target State |
|-------------|--------------|--------------|
| Card components | Multiple card variants in `ui/card.tsx` and inline | Single `Card` component with variants |
| Button variants | Button variants scattered across pages | Centralized `Button` with `ButtonVariants` type |
| Glassmorphism | Inline styles in components | `glass-card`, `glass-input`, `glass-btn` utility classes |
| Layout wrappers | Inline `max-w-7xl mx-auto px-4` on pages | `page-container` utility class |

**Files to refactor:**
- `apps/web/src/components/ui/button.tsx` — consolidate variant logic
- `apps/web/src/components/ui/card.tsx` — add variant props
- `apps/web/src/app/page.tsx` — use `page-container`
- `apps/web/src/app/book/page.tsx` — extract repeated form patterns

### 2. Utility Consolidation

| Utility | Current State | Target State |
|---------|--------------|--------------|
| `cn()` | In `lib/utils.ts` | Keep, ensure all components use it |
| Class merging | Inline `className` concatenation | Use `cn()` everywhere |
| Date formatting | Scattered `new Date().toISOString()` | `formatDate()` utility |
| Currency formatting | Inline `toLocaleString` | `formatCurrency()` utility |
| Slug generation | Inline `.toLowerCase().replace()` | `generateSlug()` utility |

**Files to create/update:**
- `apps/web/src/lib/format.ts` — date, currency, slug utilities
- `apps/web/src/lib/utils.ts` — ensure `cn()` is comprehensive

### 3. API Response Standardization

| Issue | Current State | Target State |
|-------|--------------|--------------|
| Error responses | Inconsistent shapes across endpoints | Standard `ErrorResponse` with `timestamp`, `status`, `error`, `message`, `path`, `requestId` |
| Success responses | Mixed `ResponseEntity.ok()` and raw objects | Standard `ApiResponse<T>` wrapper |
| Pagination | Inconsistent page info structure | Standard `PageInfo` with `number`, `size`, `totalElements`, `totalPages` |

**Files to update:**
- `apps/api/src/main/java/com/agency/config/ErrorResponse.java` — already standardized
- `apps/api/src/main/java/com/agency/dto/` — create `ApiResponse<T>` record
- All controllers — wrap responses in `ApiResponse`

### 4. Shared Types (TypeScript/Java)

| Issue | Current State | Target State |
|-------|--------------|--------------|
| Type duplication | Types defined separately in TS and Java | Generate TS types from OpenAPI spec |
| DTO mismatch | Frontend and backend DTOs can diverge | OpenAPI-generated client keeps them in sync |
| Enum duplication | Status enums defined in both languages | Single source of truth in OpenAPI spec |

**Files to create:**
- `apps/web/src/lib/api-client/` — OpenAPI-generated TypeScript client (replaces manual `ApiClient`)
- `scripts/generate-client.sh` — script to regenerate client from OpenAPI spec

### 5. Full Codebase Review

| Review Area | Check Items |
|-------------|-------------|
| Error handling | All endpoints have try/catch, proper HTTP status codes |
| Validation | All inputs validated (Zod frontend, Jakarta backend) |
| Security | `@PreAuthorize` on all protected endpoints |
| Logging | Structured logging, no sensitive data in logs |
| Performance | No N+1 queries, proper indexing |
| Testing | Unit + integration tests for new code |
| Documentation | JSDoc/JavaDoc on all public APIs |

## Refactor Execution Order

1. **Week 1**: Component deduplication (Button, Card, layout utilities)
2. **Week 2**: Utility consolidation (date, currency, slug helpers)
3. **Week 3**: API response standardization (ErrorResponse, ApiResponse wrapper)
4. **Week 4**: Shared types extraction (OpenAPI client generation)
5. **Week 5**: Full codebase review and fixes

## Success Metrics

- [ ] Zero `any` types in TypeScript (except with justification)
- [ ] All components use `cn()` for class merging
- [ ] All API responses use standardized `ErrorResponse`/`ApiResponse`
- [ ] TypeScript types generated from OpenAPI spec (no manual duplication)
- [ ] Test coverage maintained at ≥80%
- [ ] Zero lint warnings
- [ ] All security headers present