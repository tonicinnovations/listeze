// v1.13 — Sentry initialization helpers
import * as Sentry from "@sentry/nextjs";

let initialized = false;

export function initSentry() {
  if (initialized) return;
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
    beforeSend(event) {
      // Filter out expected errors
      const status = event.contexts?.response?.status_code;
      if (status === 402 || status === 429) return null;
      return event;
    },
  });

  initialized = true;
}
