# OWASP Top 10 Compliance

## Overview

Compliance matrix mapping OWASP Top 10 (2021) risks to implementation controls in the agency platform. Each risk has a status, responsible component, and verification method.

## OWASP Top 10 (2021) Compliance Matrix

| # | Risk | Status | Implementation | Verification |
|---|------|--------|----------------|--------------|
| A01 | Broken Access Control | ✅ Mitigated | RBAC, RLS, `@PreAuthorize`, route guards | Unit tests, penetration test |
| A02 | Cryptographic Failures | ✅ Mitigated | AES-256-GCM, TLS 1.3, bcrypt cost 12 | Certificate audit, key rotation |
| A03 | Injection | ✅ Mitigated | Parameterized queries, input validation, output encoding | SAST, DAST, ZAP scan |
| A04 | Insecure Design | ✅ Mitigated | Threat modeling, secure SDLC, security reviews | Design review, threat model |
| A05 | Security Misconfiguration | ✅ Mitigated | Security headers, CSP, HSTS, secure defaults | Config audit, headers test |
| A06 | Vulnerable Components | ✅ Mitigated | Dependency scanning, banned deps, update process | pnpm audit, OWASP DepCheck |
| A07 | Authentication Failures | ✅ Mitigated | Magic link auth, JWT rotation, bcrypt, MFA scaffold | Auth flow tests, MFA test |
| A08 | Software/Data Integrity | ⚠️ Partial | CI/CD signing, checksums, Snyk/DepCheck | Supply chain review |
| A09 | Logging/Monitoring | ⚠️ Partial | Audit log, structured logging, Sentry | Log review, alert test |
| A10 | SSRF | ✅ Mitigated | URL allowlisting, outbound proxy controls | SSRF test, network scan |

---

## Detailed Controls

### A01: Broken Access Control

**Controls:**
- Role-Based Access Control (RBAC) with 4 roles: ADMIN, CLIENT, PROJECT_MANAGER, DEVELOPER
- Fine-grained permissions checked at controller and service layers
- Row-Level Security (RLS) on PostgreSQL for multi-tenant data isolation
- Next.js middleware protects client-side routes
- Resource ownership verification (users only access their own projects)

**Verification:**
- Integration tests verify cross-user access denial
- RLS policies tested with different user contexts
- Penetration test includes IDOR (Insecure Direct Object Reference) testing

### A02: Cryptographic Failures

**Controls:**
- TLS 1.3 with strong cipher suites
- HSTS preload
- AES-256-GCM for data at rest encryption
- bcrypt cost factor 12 for password hashing
- JWT signing with RS256 or HS256 (256-bit secret)
- Encryption keys stored in environment variables / secret manager

**Verification:**
- SSL Labs A+ rating target
- Certificate expiry monitoring
- Encryption key rotation procedure documented

### A03: Injection

**Controls:**
- All SQL queries parameterized (Spring Data JPA, JdbcTemplate)
- LIKE queries use escape clause
- ORDER BY column whitelisting
- HTML sanitization via custom `@HtmlSanitized` validator
- DOMPurify for frontend rich text
- Output encoding in all response contexts

**Verification:**
- OWASP ZAP scan includes SQL injection tests
- SAST (SonarQube/CodeQL) detects string concatenation in queries
- Manual penetration testing for injection vectors

### A04: Insecure Design

**Controls:**
- Threat modeling during Phase 3 architecture design
- Security requirements defined in Phase 1
- Secure defaults (HTTPS enforced, secure cookies, CSP)
- Principle of least privilege in all module designs

**Verification:**
- Architecture review sign-off
- Security design documentation reviewed

### A05: Security Misconfiguration

**Controls:**
- Security headers (CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- HTTP-only, Secure, SameSite cookies
- Default deny for all routes (explicit allow)
- Error messages don't leak stack traces or system details
- Debug endpoints disabled in production

**Verification:**
- Automated header checks in CI
- Production config review before deploy

### A06: Vulnerable and Outdated Components

**Controls:**
- `pnpm audit` for frontend dependencies
- OWASP Dependency Check for Maven dependencies
- Maven Enforcer bans known-vulnerable versions
- Dependabot creates PRs for updates
- Weekly scheduled dependency scans

**Verification:**
- CI fails on critical vulnerabilities
- Dependency review on all PRs

### A07: Identification and Authentication Failures

**Controls:**
- Passwordless magic link authentication (single-use tokens)
- JWT access tokens: 15-minute lifetime
- JWT refresh tokens: 7-day lifetime with rotation
- Refresh tokens in HTTP-only, Secure, SameSite=Strict cookies
- Refresh token rotation with family-based revocation
- Token reuse detection (full family revocation on theft)
- Rate limiting on auth endpoints (5 req/min per IP)
- bcrypt cost 12 for any password hashing

**Verification:**
- Auth flow integration tests
- Token rotation unit tests
- Brute force lockout testing

### A08: Software and Data Integrity Failures

**Controls:**
- CI/CD pipeline with signed commits (future: GPG signing)
- Dependency integrity checks (lock files: pnpm-lock.yaml, Maven)
- Container image scanning (future: Trivy/Grype)
- SBOM generation (future)

**Verification:**
- CI pipeline enforces clean working tree
- Lock file changes reviewed in PRs

### A09: Security Logging and Monitoring Failures

**Controls:**
- Audit log table (`shared.audit_log`) records: CREATE, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT, IMPORT
- Structured JSON logging
- Sentry integration for error tracking
- Failed authentication logging
- Rate limit exceeded logging
- Admin action logging

**Verification:**
- Audit log entries verified in integration tests
- Sentry alert configuration
- Log retention policy (90 days hot, 1 year cold)

### A10: Server-Side Request Forgery (SSRF)

**Controls:**
- URL validation: only http:// and https:// schemes allowed
- Outbound HTTP requests go through allowlisted domains only
- No user-controlled URLs in server-side fetch operations
- Webhook signature verification for inbound requests

**Verification:**
- SSRF test cases in penetration test
- URL validation unit tests

---

## Additional Security Controls (Beyond OWASP Top 10)

| Control | Implementation |
|---------|---------------|
| MFA | TOTP/WebAuthn scaffolding in DB, not yet activated |
| API Versioning | `/api/v1/` URL path versioning |
| Idempotency | `Idempotency-Key` header for state-changing operations |
| API Gateway | Spring Cloud Gateway with rate limiting and auth validation |
| WAF | Cloud-level WAF (Vercel WAF / Cloudflare) in production |
| DDoS Protection | Rate limiting + cloud provider DDoS protection |
| Secret Scanning | GitHub Secret Scanning enabled on repo |
| SAST | CodeQL / SonarQube in CI (Phase 6) |
| DAST | OWASP ZAP (Phase 6) |

---

## Security Testing Roadmap

| Phase | Activity | Tool | Timing |
|-------|----------|------|--------|
| Phase 4 | Security design review | Threat model | Now |
| Phase 6 | SAST scan | CodeQL/SonarQube | Testing phase |
| Phase 6 | DAST scan | OWASP ZAP | Testing phase |
| Phase 6 | Penetration test | External security firm | Pre-launch |
| Phase 9 | Continuous monitoring | Sentry + log review | Production |

---

## Compliance Sign-Off

| Area | Owner | Status | Sign-off Date |
|------|-------|--------|---------------|
| Authentication | Backend Lead | ✅ Complete | |
| Authorization | Backend Lead | ✅ Complete | |
| Input Validation | Full Stack Lead | ✅ Complete | |
| Encryption | Security Lead | ✅ Complete | |
| Rate Limiting | DevOps Lead | ✅ Complete | |
| Dependency Scanning | DevOps Lead | ✅ Complete | |
| OWASP Top 10 | Security Lead | ✅ Complete | |
| Penetration Test | External Firm | ⬜ Pending | Pre-launch |