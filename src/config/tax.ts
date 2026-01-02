// Central tax configuration - Nigeria Tax Act 2025 (NTA 2025) effective Jan 1, 2026
export const TAX_CONFIG = {
  // CIT (Company Income Tax) thresholds
  SMALL_TURNOVER_LIMIT: 100_000_000, // ₦100M - CIT exempt
  SMALL_ASSETS_LIMIT: 250_000_000, // ₦250M
  MEDIUM_TURNOVER_LIMIT: 250_000_000, // ₦250M - above this is 30% CIT
  
  // VAT threshold (separate from CIT)
  VAT_TURNOVER_LIMIT: 25_000_000, // ₦25M - VAT registration required above this
  
  // Tax rates
  DEVELOPMENT_LEVY_RATE: 0.04, // 4%
  CIT_RATE_SMALL: 0, // 0% - exempt
  CIT_RATE_MEDIUM: 0.20, // 20%
  CIT_RATE_LARGE: 0.30, // 30%
  VAT_RATE: 0.075, // 7.5%
};
