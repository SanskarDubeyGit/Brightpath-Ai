import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  isAuthenticated,
} from '@/lib/auth';

describe('auth utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getAccessToken', () => {
    it('returns null when no token is stored', () => {
      expect(getAccessToken()).toBeNull();
    });

    it('returns the stored token', () => {
      localStorage.setItem('access_token', 'test-token-123');
      expect(getAccessToken()).toBe('test-token-123');
    });
  });

  describe('setAccessToken', () => {
    it('stores the token in localStorage', () => {
      setAccessToken('new-token-456');
      expect(localStorage.getItem('access_token')).toBe('new-token-456');
    });
  });

  describe('removeAccessToken', () => {
    it('removes the token from localStorage', () => {
      localStorage.setItem('access_token', 'test-token');
      removeAccessToken();
      expect(localStorage.getItem('access_token')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('returns false when no token', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('returns true when token exists', () => {
      localStorage.setItem('access_token', 'some-token');
      expect(isAuthenticated()).toBe(true);
    });
  });
});