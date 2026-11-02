// PostHog analytics integration for Next.js frontend
import posthog from 'posthog-js';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

if (POSTHOG_KEY && typeof window !== 'undefined') {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    loaded: () => {
      // Capture initial page view
      posthog.capture('$pageview');
    },
    capture_pageview: false, // We capture manually in Next.js
    disable_session_recording: false,
    block: false,
  });
}

export { posthog };

/**
 * Track a custom event in PostHog
 */
export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.capture(eventName, properties);
}

/**
 * Identify a user in PostHog
 */
export function identifyUser(userId: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.identify(userId, properties);
}

/**
 * Track page view for Next.js App Router
 */
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.capture('$pageview', {
    $current_url: url,
  });
}

/**
 * Track consultation booking event
 */
export function trackBooking(bookingData: {
  projectId?: string;
  clientId: string;
  slotId: string;
  serviceType?: string;
}) {
  trackEvent('consultation_booked', {
    project_id: bookingData.projectId,
    client_id: bookingData.clientId,
    slot_id: bookingData.slotId,
    service_type: bookingData.serviceType,
  });
}

/**
 * Track user registration
 */
export function trackRegistration(userData: {
  userId: string;
  email: string;
  locale: string;
}) {
  trackEvent('user_registered', {
    user_id: userData.userId,
    email: userData.email,
    locale: userData.locale,
  });
}