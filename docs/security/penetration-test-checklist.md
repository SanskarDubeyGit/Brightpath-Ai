# Manual Penetration Testing Checklist

This checklist covers security testing that should be performed before each major release.

## A01: Broken Access Control

- [ ] Test IDOR: Try accessing another user's project by modifying project ID in URL
- [ ] Test horizontal privilege escalation: Client trying to access admin endpoints
- [ ] Test vertical privilege escalation: Developer trying to access PROJECT_MANAGER endpoints
- [ ] Verify `@PreAuthorize` annotations on all controller methods
- [ ] Test that deleted projects are not accessible (soft delete)
- [ ] Verify Row-Level Security policies work at database level
- [ ] Test project member access: Non-member trying to view project details

## A02: Cryptographic Failures

- [ ] Verify HTTPS enforced on all endpoints
- [ ] Check HSTS header present and correct
- [ ] Verify TLS 1.3 used (not just 1.2)
- [ ] Check certificate validity and chain
- [ ] Verify AES-256-GCM encryption for sensitive fields (MFA secrets, OAuth tokens)
- [ ] Check bcrypt cost factor >= 12
- [ ] Verify JWT secret is not hardcoded in source
- [ ] Test that refresh tokens are HTTP-only and Secure cookies

## A03: Injection

- [ ] SQL injection: Try `' OR 1=1 --` in all input fields
- [ ] SQL injection in URL parameters
- [ ] NoSQL injection attempts (if applicable)
- [ ] Command injection in file upload filenames
- [ ] LDAP injection (if LDAP used)
- [ ] Verify all queries use parameterized statements
- [ ] Test LIKE queries with wildcard characters `%` and `_`
- [ ] Test ORDER BY with column injection attempts

## A04: Insecure Design

- [ ] Review threat model against implemented controls
- [ ] Verify business logic flaws (e.g., price manipulation in booking)
- [ ] Test workflow bypass (e.g., accessing dashboard without authentication)
- [ ] Verify rate limiting on sensitive endpoints
- [ ] Check that error messages don't reveal system internals

## A05: Security Misconfiguration

- [ ] Verify security headers: CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- [ ] Check that debug endpoints are disabled in production
- [ ] Verify default credentials are changed
- [ ] Check CORS configuration restricts origins properly
- [ ] Verify error handling doesn't leak stack traces
- [ ] Check that file upload directory is not executable

## A06: Vulnerable Components

- [ ] Run `pnpm audit` and review results
- [ ] Run OWASP Dependency Check and review results
- [ ] Check for outdated dependencies with known vulnerabilities
- [ ] Verify lock files (pnpm-lock.yaml, Maven) are committed
- [ ] Check for banned dependencies in Maven Enforcer rules

## A07: Authentication Failures

- [ ] Test magic link: Try using same link twice (should fail - single use)
- [ ] Test magic link expiration (should fail after 15 minutes)
- [ ] Test JWT access token expiration (15 minutes)
- [ ] Test JWT refresh token expiration (7 days)
- [ ] Test refresh token rotation (old token should be revoked after use)
- [ ] Test refresh token reuse detection (family revocation)
- [ ] Test rate limiting on login endpoint (5 req/min per IP)
- [ ] Test brute force lockout after 5 failed attempts
- [ ] Verify password strength requirements (bcrypt cost 12)
- [ ] Test OAuth provider linking/unlinking

## A08: Software and Data Integrity

- [ ] Verify CI/CD pipeline integrity checks
- [ ] Check that dependency lock files are not modified without review
- [ ] Verify container image scanning (if using Docker)
- [ ] Test that unsigned updates are rejected
- [ ] Verify SBOM generation (if implemented)

## A09: Logging and Monitoring

- [ ] Verify audit log records: CREATE, UPDATE, DELETE, LOGIN, LOGOUT
- [ ] Check that sensitive data (passwords, tokens) is not logged
- [ ] Verify failed authentication attempts are logged
- [ ] Check that rate limit exceeded events are logged
- [ ] Verify admin actions are audited
- [ ] Test log retention policy
- [ ] Verify Sentry integration captures errors

## A10: Server-Side Request Forgery (SSRF)

- [ ] Test URL validation: Try `file://`, `ftp://`, `gopher://` schemes
- [ ] Test internal IP access: `http://169.254.169.254/` (AWS metadata)
- [ ] Test localhost access: `http://localhost:8080/admin`
- [ ] Verify outbound HTTP requests use allowlisted domains only
- [ ] Test webhook signature verification

## Additional Tests

### Rate Limiting
- [ ] Test anonymous rate limit (20 req/min per IP)
- [ ] Test authenticated rate limit (100 req/min per user)
- [ ] Test auth endpoint rate limit (5 req/min per IP)
- [ ] Verify 429 response with Retry-After header

### File Upload
- [ ] Test uploading executable files (.exe, .sh, .php)
- [ ] Test uploading files with double extensions (.php.jpg)
- [ ] Test file size limits (max 10MB)
- [ ] Test MIME type spoofing
- [ ] Verify filename sanitization (path traversal `../../`)

### XSS
- [ ] Test reflected XSS in search/error messages
- [ ] Test stored XSS in case studies, blog posts, comments
- [ ] Test DOM-based XSS in URL parameters
- [ ] Verify CSP blocks inline scripts
- [ ] Test DOMPurify sanitization on rich text

### CSRF
- [ ] Verify SameSite=Strict on all cookies
- [ ] Test state-changing operations without CSRF token
- [ ] Verify double-submit cookie pattern implemented

### Business Logic
- [ ] Test booking slot double-booking (race condition)
- [ ] Test project status transitions (invalid state changes)
- [ ] Test budget manipulation (negative values)
- [ ] Test task assignment to non-existent users

## Test Data

| Test Case | Input | Expected Result |
|-----------|-------|----------------|
| SQL Injection | `admin'--` in email field | 400 validation error |
| XSS | `<script>alert(1)</script>` in name | Sanitized/escaped output |
| Path Traversal | `../../../etc/passwd` as filename | Sanitized filename |
| Rate Limit | 101 requests in 1 min | 429 Too Many Requests |
| IDOR | Change project ID in URL | 403 Forbidden or 404 |
| Expired JWT | Token older than 15 min | 401 Unauthorized |