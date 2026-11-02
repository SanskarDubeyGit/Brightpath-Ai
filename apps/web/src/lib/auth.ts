/**
 * @fileoverview Authentication utility functions for token management.
 * @module lib/auth
 */

export const AUTH_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Retrieves the stored access token from localStorage.
 * @returns {string|null} The access token or null if not stored.
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Stores the access token in localStorage.
 * @param {string} token - The access token to store.
 */
export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Removes the access token from localStorage.
 */
export function removeAccessToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Checks if the user is authenticated by checking for a stored access token.
 * @returns {boolean} True if authenticated, false otherwise.
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/**
 * Builds authorization headers with the stored access token.
 * @returns {HeadersInit} Headers object with Authorization header if token exists.
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}