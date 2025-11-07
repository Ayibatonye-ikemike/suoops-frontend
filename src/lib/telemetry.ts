// Simple telemetry stub; replace with real analytics provider later.
// Each event is logged to console in development.

export interface FeatureEvent {
  feature: string;
  action: string; // e.g. 'error', 'upgrade_click'
  meta?: Record<string, unknown>;
  ts: number;
}

export function logFeatureEvent(event: Omit<FeatureEvent, 'ts'>) {
  const full: FeatureEvent = { ...event, ts: Date.now() };
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[telemetry]', full);
  }
  // Placeholder: push to analytics queue or endpoint
}
