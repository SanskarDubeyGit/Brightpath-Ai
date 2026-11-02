package com.brightpathai.integration;

import com.brightpathai.dto.auth.LoginRequest;
import com.brightpathai.dto.auth.RegisterRequest;
import com.brightpathai.dto.auth.AuthResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class AuthControllerIntegrationTest extends AbstractIntegrationTest {

    @Test
    void registerUser_shouldReturnAuthResponse() {
        RegisterRequest request = new RegisterRequest(
            "test@example.com",
            "SecurePassword123!",
            "Test User",
            "en"
        );

        ResponseEntity<AuthResponse> response = restTemplate.postForEntity(
            "/api/v1/auth/register", request, AuthResponse.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().accessToken()).isNotEmpty();
        assertThat(response.getBody().refreshToken()).isNotEmpty();
        assertThat(response.getBody().user().email()).isEqualTo("test@example.com");
    }

    @Test
    void loginUser_shouldReturnAuthResponse() {
        // First register
        RegisterRequest registerRequest = new RegisterRequest(
            "login@example.com",
            "SecurePassword123!",
            "Login User",
            "en"
        );
        restTemplate.postForEntity("/api/v1/auth/register", registerRequest, AuthResponse.class);

        // Then login
        LoginRequest loginRequest = new LoginRequest("login@example.com", "SecurePassword123!");
        ResponseEntity<AuthResponse> response = restTemplate.postForEntity(
            "/api/v1/auth/login", loginRequest, AuthResponse.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().accessToken()).isNotEmpty();
    }

    @Test
    void loginWithWrongPassword_shouldReturn401() {
        LoginRequest loginRequest = new LoginRequest("nonexistent@example.com", "WrongPassword123!");
        ResponseEntity<AuthResponse> response = restTemplate.postForEntity(
            "/api/v1/auth/login", loginRequest, AuthResponse.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}
