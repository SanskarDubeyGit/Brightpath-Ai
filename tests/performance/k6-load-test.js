import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const httpRequests = new Counter('http_requests');

export const options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up to 10 users
    { duration: '5m', target: 10 },   // Stay at 10 users
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    errors: ['rate<0.05'],            // Error rate under 5%
    http_req_failed: ['rate<0.05'],   // Failed requests under 5%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_URL = __ENV.API_URL || 'http://localhost:8080/api/v1';

export default function () {
  // Test homepage load
  let res = http.get(`${BASE_URL}/`);
  httpRequests.add(1);
  check(res, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads in under 2s': (r) => r.timings.duration < 2000,
  }) || errorRate.add(1);

  sleep(1);

  // Test services page
  res = http.get(`${BASE_URL}/services`);
  httpRequests.add(1);
  check(res, {
    'services page status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(1);

  // Test API projects endpoint (public)
  res = http.get(`${API_URL}/projects`);
  httpRequests.add(1);
  check(res, {
    'projects API status is 200 or 401': (r) => r.status === 200 || r.status === 401,
  }) || errorRate.add(1);

  sleep(1);

  // Test booking page
  res = http.get(`${BASE_URL}/book`);
  httpRequests.add(1);
  check(res, {
    'booking page status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(2);
}

// Spike test for booking endpoint
export function spikeTest() {
  const res = http.post(`${API_URL}/bookings`, JSON.stringify({
    slotId: 'test-slot-id',
    notes: 'Load test booking',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'booking spike status is 200 or 401': (r) => r.status === 200 || r.status === 401,
  }) || errorRate.add(1);
}