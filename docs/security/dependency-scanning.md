# Dependency Scanning

## Overview

Automated dependency vulnerability scanning for both frontend (npm/pnpm) and backend (Maven). Regular audits, fix recommendations, and CI integration.

---

## Frontend: pnpm Audit

### package.json (apps/web/package.json)

```json
{
  "name": "agency-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "audit": "pnpm audit",
    "audit:fix": "pnpm audit --fix",
    "audit:json": "pnpm audit --json > audit-report.json",
    "deps:outdated": "pnpm outdated",
    "deps:upgrade": "pnpm up --interactive"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.3.0",
    "react-hook-form": "^7.50.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    "lucide-react": "^0.390.0",
    "framer-motion": "^11.0.0",
    "dompurify": "^3.1.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/react": "^18.3.0",
    "@types/node": "^20.14.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.0",
    "prettier": "^3.3.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.0"
  },
  "pnpm": {
    "peerDependencyRules": {
      "allowedVersions": {}
    }
  }
}
```

### Audit Commands

```bash
# Run audit
cd apps/web
pnpm audit

# Fix automatically where possible
pnpm audit --fix

# Generate JSON report for CI
pnpm audit --json > audit-report.json

# Check for outdated packages
pnpm outdated

# Interactive upgrade
pnpm up --interactive
```

### CI Integration (GitHub Actions)

```yaml
# .github/workflows/dependency-audit.yml
name: Dependency Audit

on:
  schedule:
    - cron: '0 9 * * 1'  # Weekly, Mondays 9 AM
  push:
    branches: [main]
    paths:
      - 'apps/web/package.json'
      - 'apps/web/pnpm-lock.yaml'

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        working-directory: apps/web
      
      - name: Run audit
        id: audit
        run: |
          pnpm audit --json > audit-report.json || true
          cat audit-report.json
        working-directory: apps/web
      
      - name: Fail on critical vulnerabilities
        run: |
          python3 -c "
          import json
          with open('audit-report.json') as f:
              report = json.load(f)
          critical = report.get('metadata', {}).get('vulnerabilities', {}).get('critical', 0)
          high = report.get('metadata', {}).get('vulnerabilities', {}).get('high', 0)
          if critical > 0:
              print(f'CRITICAL: {critical} critical vulnerabilities found')
              exit(1)
          if high > 0:
              print(f'WARNING: {high} high vulnerabilities found')
          "
        working-directory: apps/web
```

---

## Backend: Maven Dependency Check

### pom.xml (apps/api/pom.xml)

```xml
<properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <spring-boot.version>3.3.0</spring-boot.version>
    <owasp.dependency-check.version>8.4.0</owasp.dependency-check.version>
</properties>

<build>
    <plugins>
        <!-- OWASP Dependency Check -->
        <plugin>
            <groupId>org.owasp</groupId>
            <artifactId>dependency-check-maven</artifactId>
            <version>${owasp.dependency-check.version}</version>
            <configuration>
                <failBuildOnCVSS>7</failBuildOnCVSS>
                <failBuildOnVulnerability>true</failBuildOnVulnerability>
                <retireJsAnalyzer enabled="true"/>
                <suppressionFile>owasp-suppressions.xml</suppressionFile>
                <format>ALL</format>
            </configuration>
            <executions>
                <execution>
                    <goals>
                        <goal>check</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
        
        <!-- Maven Enforcer: Ban dangerous dependencies -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-enforcer-plugin</artifactId>
            <version>3.3.0</version>
            <executions>
                <execution>
                    <id>enforce-banned-dependencies</id>
                    <goals>
                        <goal>enforce</goal>
                    </goals>
                    <configuration>
                        <rules>
                            <bannedDependencies>
                                <excludes>
                                    <exclude>org.codehaus.jackson:*</exclude>
                                    <exclude>com.fasterxml.jackson.core:jackson-databind:[2.0,2.9.9]</exclude>
                                    <exclude>org.springframework:spring-core:[5.0,5.2.2]</exclude>
                                </excludes>
                                <includeDuplicateDependencies>true</includeDuplicateDependencies>
                            </bannedDependencies>
                        </rules>
                        <fail>true</fail>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

### Audit Commands

```bash
# Run OWASP dependency check
cd apps/api
./mvnw org.owasp:dependency-check-maven:check

# Check with fail on CVSS 7+
./mvnw org.owasp:dependency-check-maven:check -DfailBuildOnCVSS=7

# Generate HTML report
./mvnw org.owasp:dependency-check-maven:check -Dformat=HTML

# Check for outdated dependencies
./mvnw versions:display-dependency-updates

# Check plugin updates
./mvnw versions:display-plugin-updates
```

### Suppression File (owasp-suppressions.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<suppressions xmlns="https://jeremylong.github.io/DependencyCheck/dependency-suppression.1.3.xsd">
    <suppress>
        <notes>False positive - library not used in runtime</notes>
        <packageUrl regex="true">^pkg:maven/com\.example\.legacy/.*$</packageUrl>
    </suppress>
</suppressions>
```

---

## CI/CD Integration

### GitHub Actions Workflow (.github/workflows/security-scan.yml)

```yaml
name: Security Scans

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily 2 AM

jobs:
  frontend-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - name: Install
        run: pnpm install --frozen-lockfile
        working-directory: apps/web
      - name: Audit
        run: pnpm audit --json > audit-report.json || true
        working-directory: apps/web
      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: frontend-audit-report
          path: apps/web/audit-report.json

  backend-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21
      - name: Cache Maven
        uses: actions/cache@v4
        with:
          path: ~/.m2/repository
          key: ${{ runner.os }}-maven-${{ hashFiles('apps/api/pom.xml') }}
      - name: OWASP Dependency Check
        run: ./mvnw org.owasp:dependency-check-maven:check
        working-directory: apps/api
      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: backend-security-report
          path: apps/api/target/dependency-check-report.html

  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Dependency Review
        uses: actions/dependency-review-action@v4
```

---

## Vulnerability Response Process

| Severity | SLA | Process |
|----------|-----|---------|
| Critical (CVSS 9-10) | 24 hours | Immediate patch, emergency deploy if needed |
| High (CVSS 7-8.9) | 72 hours | Schedule patch in next sprint |
| Medium (CVSS 4-6.9) | 7 days | Patch in next release |
| Low (CVSS 0-3.9) | 30 days | Patch at team discretion |

### Emergency Patch Workflow

1. Create `security/patch-CVE-YYYY-NNNN` branch
2. Update vulnerable dependency to patched version
3. Run full test suite
4. Create PR with `security` label
5. Fast-track review (1 approver required)
6. Deploy to staging → production

### Dependency Update Best Practices

- **Patch versions**: Auto-update via Dependabot (weekly PRs)
- **Minor versions**: Review changelog, test, then update
- **Major versions**: Planned update with testing and documentation
- **Transitive dependencies**: Monitor via `pnpm outdated` and `mvn versions:display-dependency-updates`

---

## Tools Summary

| Tool | Purpose | Frequency |
|------|---------|-----------|
| `pnpm audit` | Frontend vulnerability scan | Per commit + weekly |
| `actions/dependency-review-action` | PR dependency changes | Per PR |
| OWASP Dependency Check | Backend (Java) vulnerability scan | Per commit + weekly |
| Maven Enforcer | Ban dangerous dependencies | Per build |
| `pnpm outdated` / `mvn versions` | Outdated dependency report | Weekly |
| Dependabot | Automated PRs for updates | Weekly |