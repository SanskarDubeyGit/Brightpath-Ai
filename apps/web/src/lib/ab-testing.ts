// A/B Testing with PostHog Feature Flags
// Booking form experiment: single-step vs multi-step layout

import { posthog, trackBooking } from '@/lib/posthog';

/**
 * Gets the A/B test variant for the booking form.
 * Returns 'single_step' or 'multi_step' based on PostHog feature flag.
 */
export function getBookingFormVariant(): 'single_step' | 'multi_step' {
  if (typeof window === 'undefined') return 'single_step';

  const flag = posthog.getFeatureFlag('booking_form_layout');
  return flag === 'multi_step' ? 'multi_step' : 'single_step';
}

/**
 * Tracks booking form interaction for A/B test analysis.
 */
export function trackBookingFormInteraction(
  variant: 'single_step' | 'multi_step',
  action: 'form_start' | 'form_complete' | 'form_abandon',
  metadata?: Record<string, unknown>
) {
  trackEvent('booking_form_interaction', {
    variant,
    action,
    ...metadata,
  });
}

/**
 * Tracks booking submission success for A/B test conversion analysis.
 */
export function trackBookingConversion(
  variant: 'single_step' | 'multi_step',
  bookingData: {
    projectId?: string;
    clientId: string;
    slotId: string;
    serviceType?: string;
  }
) {
  trackBooking(bookingData);
  trackEvent('booking_form_conversion', {
    variant,
    ...bookingData,
  });
}

// Export trackEvent for internal use
export { trackEvent } from '@/lib/posthog';