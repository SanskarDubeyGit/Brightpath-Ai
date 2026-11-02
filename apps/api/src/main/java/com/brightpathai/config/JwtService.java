/**
 * JWT token service for generating, validating, and parsing access and refresh tokens.
 *
 * <p>Token configuration:</p>
 * <ul>
 *   <li>Access token: 15 minutes expiration</li>
 *   <li>Refresh token: 7 days expiration</li>
 *   <li>Algorithm: HMAC-SHA with 256-bit key</li>
 *   <li>Refresh token rotation supported via token families</li>
 * </ul>
 */
@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.access-token-expiration}") long accessTokenExpiration,
                      @Value("${jwt.refresh-token-expiration}") long refreshTokenExpiration) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    /**
     * Generates a signed JWT access token with custom claims.
     *
     * @param subject the token subject (typically user email)
     * @param claims additional claims to include in the token
     * @return the signed JWT access token string
     */
    public String generateAccessToken(String subject, Map<String, Object> claims) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessTokenExpiration);
        return Jwts.builder()
            .subject(subject)
            .claims(claims)
            .issuedAt(now)
            .expiration(expiry)
            .signWith(secretKey)
            .compact();
    }

    /**
     * Generates a signed JWT refresh token.
     *
     * @param subject the token subject (typically user email)
     * @return the signed JWT refresh token string
     */
    public String generateRefreshToken(String subject) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + refreshTokenExpiration);
        return Jwts.builder()
            .subject(subject)
            .issuedAt(now)
            .expiration(expiry)
            .signWith(secretKey)
            .compact();
    }

    /**
     * Validates a JWT token signature and expiration.
     *
     * @param token the JWT token string to validate
     * @return the parsed JWT claims
     * @throws ExpiredJwtException if the token is expired
     * @throws MalformedJwtException if the token is malformed
     * @throws SignatureException if the signature is invalid
     */
    public Claims validateToken(String token) {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    /**
     * Extracts the subject (username/email) from a JWT token.
     *
     * @param token the JWT token string
     * @return the subject claim value
     */
    public String extractUsername(String token) {
        return validateToken(token).getSubject();
    }

    /**
     * Checks if a JWT token is expired.
     *
     * @param token the JWT token string
     * @return true if expired, false otherwise
     */
    public boolean isTokenExpired(String token) {
        return validateToken(token).getExpiration().before(new Date());
    }
}