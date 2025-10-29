const defaultConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000",
  auth: {
    refreshDebounceMs: 750,
  },
};

export type AppConfig = typeof defaultConfig;

export function getConfig(): AppConfig {
  return defaultConfig;
}
