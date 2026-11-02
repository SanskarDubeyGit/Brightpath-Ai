/**
 * Authentication controller handling login, registration, token refresh, and logout.
 *
 * <p>All endpoints are public (no authentication required) as they are the entry
 * points for obtaining authentication tokens.</p>
 *
 * <p>Endpoints:</p>
 * <ul>
 *   <li>{@code POST /api/v1/auth/login} - Authenticate with email + password</li>
 *   <li>{@code POST /api/v1/auth/register} - Register a new user</li>
 *   <li>{@code POST /api/v1/auth/refresh} - Refresh access token</li>
 *   <li>{@code POST /api/v1/auth/logout} - Revoke refresh token</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Authenticates a user with email and password.
     *
     * @param request the login request containing email and password
     * @return authentication response with access and refresh tokens
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Registers a new user account.
     *
     * @param request the registration request containing email, password, and full name
     * @return authentication response with access and refresh tokens
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Refreshes an expired access token using a valid refresh token.
     *
     * @param request the refresh request containing a valid refresh token
     * @return new authentication response with rotated tokens
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshRequest request) {
        AuthResponse response = authService.refresh(request.refreshToken());
        return ResponseEntity.ok(response);
    }

    /**
     * Logs out a user by revoking their refresh token.
     *
     * @param request the logout request containing the refresh token to revoke
     * @return success message
     */
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@RequestBody RefreshRequest request) {
        authService.logout(request.refreshToken());
        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }
}