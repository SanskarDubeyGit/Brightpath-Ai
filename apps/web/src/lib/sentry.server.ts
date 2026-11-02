// Sentry server-side config for Next.js
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN;

const sentryServerConfig = {
  dsn: SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV || 'production',
  release: process.env.SENTRY_RELEASE || '1.0.0',
};

if (SENTRY_DSN) {
  Sentry.init(sentryServerConfig);
}

export { Sentry };
export default sentryServerConfig;