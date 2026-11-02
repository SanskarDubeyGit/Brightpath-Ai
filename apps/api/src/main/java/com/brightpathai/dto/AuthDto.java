package com.brightpathai.dto.auth;

public record LoginRequest(
    String email,
    String password
) {}

public record RegisterRequest(
    String email,
    String password,
    String fullName,
    String locale
) {}

public record AuthResponse(
    String accessToken,
    String refreshToken,
    long expiresIn,
    String tokenType,
    UserDto user
) {}

public record UserDto(
    String id,
    String email,
    String fullName,
    String avatarUrl,
    String locale,
    String timezone,
    java.util.List<String> roles,
    java.util.List<String> permissions,
    boolean mfaEnabled
) {}

public record RefreshRequest(
    String refreshToken
) {}

public record MessageResponse(
    String message
) {}
