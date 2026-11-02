# Encryption Standards

## Overview

Encryption at rest (AES-256-GCM, app-managed keys) and in transit (TLS 1.3, HTTPS everywhere). Key rotation and secure key storage procedures defined.

---

## Encryption in Transit (HTTPS/TLS)

### TLS Configuration

| Setting | Value |
|---------|-------|
| Protocol | TLS 1.3 (TLS 1.2 fallback only for legacy clients) |
| Cipher Suites | `TLS_AES_256_GCM_SHA384`, `TLS_CHACHA20_POLY1305_SHA256`, `TLS_AES_128_GCM_SHA256` |
| Certificate | Let's Encrypt (auto-renewed via cert-manager) |
| HSTS | `max-age=31536000; includeSubDomains; preload` |
| Perfect Forward Secrecy | Required (ECDHE key exchange) |

### Spring Boot HTTPS (application.yml)

```yaml
server:
  port: 8443
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: ${SSL_KEYSTORE_PASSWORD}
    key-store-type: PKCS12
    key-alias: agency
    key-password: ${SSL_KEY_PASSWORD}
  forward-headers-strategy: framework
```

### Force HTTPS Middleware

```java
@Component
public class HttpsRedirectFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        if (!request.isSecure() && !"localhost".equals(request.getServerName())) {
            String secureUrl = "https://" + request.getServerName() 
                + (request.getServerPort() != 443 ? ":" + 443 : "") 
                + request.getRequestURI();
            response.sendRedirect(secureUrl);
            return;
        }
        filterChain.doFilter(request, response);
    }
}
```

### Next.js HTTPS (Vercel/Production)

Vercel provides automatic HTTPS with managed certificates. Custom domains auto-provision TLS 1.3 certificates.

### Local Development HTTPS

```bash
# Generate self-signed cert for local dev
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes \
  -subj "/CN=localhost"

# Trust the cert in your OS keychain
```

---

## Encryption at Rest (AES-256-GCM)

### Key Management (App-Managed for MVP)

Encryption keys stored as environment variables, never in code or version control. Keys rotated annually or on compromise.

```
ENCRYPTION_MASTER_KEY=base64-encoded-256-bit-key  # 32 bytes, base64
ENCRYPTION_KEY_VERSION=1                          # For key rotation support
```

### Encryption Service

```java
@Component
public class EncryptionService {
    
    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int KEY_SIZE = 256;
    private static final int IV_SIZE = 12; // 96 bits for GCM
    private static final int TAG_SIZE = 16; // 128 bits
    
    private final SecretKey secretKey;
    
    public EncryptionService(@Value("${encryption.master.key}") String base64Key,
                             @Value("${encryption.key.version:1}") int keyVersion) {
        byte[] decodedKey = Base64.getDecoder().decode(base64Key);
        if (decodedKey.length != KEY_SIZE / 8) {
            throw new IllegalStateException("Encryption key must be 256 bits (32 bytes)");
        }
        this.secretKey = new SecretKeySpec(decodedKey, "AES");
    }
    
    public EncryptedData encrypt(String plaintext) {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            byte[] iv = new byte[IV_SIZE];
            SecureRandom random = new SecureRandom();
            random.nextBytes(iv);
            
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(TAG_SIZE * 8, iv));
            byte[] ciphertext = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));
            
            return new EncryptedData(
                Base64.getEncoder().encodeToString(iv),
                Base64.getEncoder().encodeToString(ciphertext),
                keyVersion
            );
        } catch (Exception e) {
            throw new EncryptionException("Encryption failed", e);
        }
    }
    
    public String decrypt(EncryptedData encryptedData) {
        try {
            // Support key rotation: different versions could use different keys
            SecretKey key = getKeyForVersion(encryptedData.getKeyVersion());
            
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            byte[] iv = Base64.getDecoder().decode(encryptedData.getIv());
            byte[] ciphertext = Base64.getDecoder().decode(encryptedData.getCiphertext());
            
            cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(TAG_SIZE * 8, iv));
            byte[] plaintext = cipher.doFinal(ciphertext);
            
            return new String(plaintext, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new EncryptionException("Decryption failed", e);
        }
    }
    
    private SecretKey getKeyForVersion(int version) {
        // In production: load different keys per version from secret manager
        // For MVP: same master key for all versions
        return secretKey;
    }
}

public record EncryptedData(String iv, String ciphertext, int keyVersion) {}
```

### Entity-Level Encryption (JPA Attribute Converter)

```java
@Converter(autoApply = true)
public class EncryptedStringConverter implements AttributeConverter<String, String> {
    
    @Autowired
    private EncryptionService encryptionService;
    
    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) return null;
        EncryptedData encrypted = encryptionService.encrypt(attribute);
        // Store as JSON: {"iv": "...", "ciphertext": "...", "keyVersion": 1}
        return objectMapper.writeValueAsString(encrypted);
    }
    
    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        EncryptedData encrypted = objectMapper.readValue(dbData, EncryptedData.class);
        return encryptionService.decrypt(encrypted);
    }
}
```

### Encrypted Fields (Database)

| Table | Field | Encryption |
|-------|-------|------------|
| `auth.users` | `password_hash` | bcrypt (not reversible) |
| `auth.mfa_devices` | `secret_encrypted` | AES-256-GCM |
| `auth.oauth_providers` | `access_token_encrypted` | AES-256-GCM |
| `auth.oauth_providers` | `refresh_token_encrypted` | AES-256-GCM |
| `auth.refresh_tokens` | `token_hash` | SHA-256 (not reversible) |

### File Encryption (AES-256-GCM)

```java
@Service
public class FileEncryptionService {
    
    public void encryptFile(Path sourcePath, Path destinationPath) {
        try (InputStream in = Files.newInputStream(sourcePath);
             OutputStream out = Files.newOutputStream(destinationPath);
             CipherOutputStream cos = new CipherOutputStream(
                 out, getCipher(Cipher.ENCRYPT_MODE))) {
            
            // Write IV first (12 bytes)
            byte[] iv = new byte[12];
            SecureRandom random = new SecureRandom();
            random.nextBytes(iv);
            out.write(iv);
            
            // Encrypt and write file content
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                cos.write(buffer, 0, bytesRead);
            }
            cos.flush();
        }
    }
    
    public void decryptFile(Path sourcePath, Path destinationPath) {
        try (InputStream in = Files.newInputStream(sourcePath);
             OutputStream out = Files.newOutputStream(destinationPath);
             CipherInputStream cis = new CipherInputStream(
                 in, getCipher(Cipher.DECRYPT_MODE))) {
            
            // Read IV (first 12 bytes)
            byte[] iv = new byte[12];
            in.read(iv); // Skip IV, cipher initialized with it
            
            // Decrypt and write file content
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = cis.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
        }
    }
}
```

### Key Rotation Procedure

1. Generate new 256-bit key, store as `ENCRYPTION_MASTER_KEY_V2`
2. Set `ENCRYPTION_KEY_VERSION=2` for new encryptions
3. Decrypt existing data with v1 key, re-encrypt with v2 key (background job)
4. After migration complete, remove v1 key from environment
5. Old `ENCRYPTION_KEY_VERSION=1` entries still decryptable if v1 key retained temporarily

### Key Storage Options (MVP → Production)

| Environment | Storage | Rotation |
|-------------|---------|----------|
| Development | `.env` file (gitignored) | Manual |
| Staging | Docker secrets / Kubernetes secrets | Manual |
| Production | AWS Secrets Manager / HashiCorp Vault | Automated (annual) |

---

## Password Hashing (bcrypt)

```yaml
# application.yml
security:
  bcrypt:
    strength: 12  # Work factor (cost)
```

```java
@Component
public class PasswordEncoderConfig {
    
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // ~250ms per hash
    }
}
```

- **Cost factor**: 12 (adjust based on hardware benchmark)
- **Salt**: Auto-generated by Spring Security
- **Pepper**: Additional application-secret pepper (env var) prepended before hashing

```java
public String hashPassword(String rawPassword) {
    String peppered = rawPassword + pepper; // pepper from env var
    return passwordEncoder.encode(peppered);
}

public boolean verifyPassword(String rawPassword, String storedHash) {
    String peppered = rawPassword + pepper;
    return passwordEncoder.matches(peppered, storedHash);
}
```

---

## Secrets Checklist

- [ ] No secrets committed to git (`.gitignore` covers `.env`, `*.pem`, `*.key`)
- [ ] Production secrets in secret manager (not environment variables on EC2)
- [ ] Encryption keys rotated annually
- [ ] Old keys retained for decryption during rotation window
- [ ] TLS 1.3 enforced in production
- [ ] HSTS preload submitted
- [ ] bcrypt cost factor ≥ 12
- <|constraint|>unknown_token<|constraint|>0<|constraint|>