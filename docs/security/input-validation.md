# Input Validation & Sanitization

## Overview

Defense-in-depth input validation: client-side (Next.js) for UX, server-side (Spring Boot) as the security boundary. All inputs validated, sanitized, and parameterized to prevent XSS, SQL injection, and other injection attacks.

## Backend Validation (Spring Boot)

### Bean Validation (Jakarta Validation)

```java
// Entity/DTO example
public class CreateProjectDto {
    
    @NotBlank(message = "Project name is required")
    @Size(min = 3, max = 100, message = "Name must be 3-100 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-_.]+$", message = "Invalid characters in name")
    private String name;
    
    @Email(message = "Invalid email format")
    @NotBlank
    private String clientEmail;
    
    @Size(max = 5000, message = "Description too long")
    @HtmlSanitized  // Custom annotation (see below)
    private String description;
    
    @FutureOrPresent(message = "Start date cannot be in the past")
    private LocalDate startDate;
    
    @DecimalMin(value = "0", inclusive = false)
    private BigDecimal budget;
}
```

### Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        
        List<ValidationError> errors = ex.getBindingResult().getFieldErrors().stream()
            .map(error -> new ValidationError(
                error.getField(),
                error.getDefaultMessage(),
                error.getRejectedValue() != null ? error.getRejectedValue().toString() : null
            ))
            .collect(Collectors.toList());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse.validationError(request.getRequestURI(), errors));
    }
}
```

### Custom `@HtmlSanitized` Annotation

```java
@Documented
@Constraint(validatedBy = HtmlSanitizedValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface HtmlSanitized {
    String message() default "HTML content contains dangerous elements";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

@Component
public class HtmlSanitizedValidator implements ConstraintValidator<HtmlSanitized, String> {
    
    private final OwaspHtmlSanitizer sanitizer;
    
    public HtmlSanitizedValidator() {
        this.sanitizer = new HtmlPolicyBuilder()
            .allowElements("p", "br", "b", "i", "em", "strong", "u", "a", "ul", "ol", "li")
            .allowAttributes("href").onElements("a")
            .allowAttributes("target").onElements("a")
            .requireRelNofollowOnLinks()
            .toFactory();
    }
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) return true;
        String sanitized = sanitizer.sanitize(value);
        return value.equals(sanitized); // Reject if sanitization changed anything
    }
}
```

### SQL Injection Prevention

- **All queries use parameterized statements** (Spring Data JPA, JdbcTemplate with `?` placeholders)
- **No string concatenation** in SQL queries
- **LIKE queries** use `escape` clause for user-provided wildcards
- **Order-by column whitelisting** — never accept raw column names from client

```java
// Safe: parameterized
@Query("SELECT p FROM Project p WHERE p.clientId = :clientId AND p.name LIKE %:name%")
List<Project> findByClientAndName(@Param("clientId") UUID clientId, @Param("name") String name);

// Safe: whitelist order columns
public Page<Project> list(String sortBy, String direction) {
    Set<String> allowedColumns = Set.of("name", "createdAt", "status", "endDate");
    if (!allowedColumns.contains(sortBy)) {
        throw new ValidationException("Invalid sort column");
    }
    Sort sort = Sort.by(Direction.valueOf(direction), sortBy);
    return projectRepository.findAll(PageRequest.of(0, 20, sort));
}
```

### File Upload Validation

```java
public void validateUpload(MultipartFile file) {
    // Size limit
    if (file.getSize() > MAX_FILE_SIZE) {
        throw new ValidationException("File too large");
    }
    
    // MIME type validation (from content, not just extension)
    String mimeType = Files.probeContentType(file.getInputStream());
    Set<String> allowedTypes = Set.of("application/pdf", "image/png", "image/jpeg", "image/webp");
    if (!allowedTypes.contains(mimeType)) {
        throw new ValidationException("File type not allowed");
    }
    
    // Filename sanitization
    String cleanFilename = sanitizeFilename(file.getOriginalFilename());
    
    // Content scan for embedded scripts (ClamAV or similar in production)
    malwareScanner.scan(file.getInputStream());
}
```

### Output Encoding (XSS Prevention)

- **Thymeleaf/JSP**: Use `th:text` (auto-escapes), never `th:utext` with untrusted data
- **JSON responses**: Spring Boot defaults to escaped JSON
- **Error messages**: Never echo raw user input in error responses without sanitization
- **Headers**: `X-Content-Type-Options: nosniff` to prevent MIME sniffing

---

## Frontend Validation (Next.js)

### Schema Validation (Zod)

```typescript
// lib/validations/project.ts
import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Invalid characters in name'),
  
  clientEmail: z.string().email('Invalid email format'),
  
  description: z.string()
    .max(5000, 'Description too long')
    .optional(),
  
  startDate: z.string()
    .refine((date) => new Date(date) >= new Date(), 'Start date cannot be in the past'),
  
  budget: z.number().positive('Budget must be positive'),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
```

### Form Handling (React Hook Form + Zod)

```typescript
// app/projects/new/page.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function NewProjectPage() {
  const form = useForm<CreateProjectDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      clientEmail: '',
      description: '',
      startDate: '',
      budget: 0,
    },
  });
  
  // ...
}
```

### XSS Prevention in React

- **Never use `dangerouslySetInnerHTML`** with untrusted data
- **Sanitize rich text** with DOMPurify before rendering
- **Escape template literals** in SSR (Next.js auto-escapes by default)

```typescript
import DOMPurify from 'dompurify';

function SafeContent({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
  });
  
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

### URL Validation

```typescript
// Validate external URLs before redirect
function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
```

---

## Content Security Policy (CSP)

### Next.js (next.config.js)

```javascript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://vercel.live;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.agency.example.com wss://api.agency.example.com;
  frame-src 'none';
  base-uri 'self';
  form-action 'self';
  object-src 'none';
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspHeader.replace(/\s{2,}/g, ' ').trim(),
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

module.exports = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
```

### Spring Boot (Security Headers Filter)

```java
@Component
public class SecurityHeadersFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("X-XSS-Protection", "1; mode=block");
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        response.setHeader("Content-Security-Policy", 
            "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;");
        
        filterChain.doFilter(request, response);
    }
}
```

---

## Validation Rules by Endpoint

| Endpoint | Fields | Validation Rules |
|----------|--------|-----------------|
| `POST /auth/login` | email | Required, valid email format, max 254 chars |
| `POST /auth/register` | email, password, fullName | Email valid, password ≥ 12 chars, name 2-100 chars |
| `POST /projects` | name, description, startDate, endDate, budget | Name 3-100 chars, dates valid, budget positive |
| `POST /tasks` | title, description, priority, storyPoints | Title 3-200 chars, priority in enum, storyPoints 1-100 |
| `POST /bookings` | slotId, notes | slotId required UUID, notes ≤ 1000 chars |
| `POST /cms/case-studies` | title, slug, content, technologies | Slug matches `^[a-z0-9-]+$`, technologies ≤ 20 items |
| File upload | file | Size ≤ 10MB, MIME type whitelisted, filename sanitized |

---

## Sanitization Checklist

- [ ] All user input validated on server (never trust client validation)
- [ ] Parameterized queries for all database access
- [ ] HTML sanitization for rich text fields
- [ ] File type validation by content, not extension
- [ ] Filename sanitization (remove path traversal characters)
- [ ] Output encoding for all rendered user content
- [ ] CSP headers configured
- [ ] Error messages don't leak system internals
- [ ] Rate limiting on all auth endpoints