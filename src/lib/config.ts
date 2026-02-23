const requiredEnvVars = ["NEXT_PUBLIC_API_BASE_URL"] as const;

function validateEnv() {
  const missing = requiredEnvVars.filter(
    (key) => !process.env[key]
  );
  if (missing.length > 0 && typeof window === "undefined") {
    console.warn(
      `[config] Missing environment variable(s): ${missing.join(", ")}. Falling back to defaults.`
    );
  }
}

validateEnv();

const defaultConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.suoops.com",
  auth: {
    refreshDebounceMs: 750,
  },
};

export type AppConfig = typeof defaultConfig;

export function getConfig(): AppConfig {
  return defaultConfig;
}
