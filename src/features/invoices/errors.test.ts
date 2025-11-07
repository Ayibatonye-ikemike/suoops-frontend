import { describe, it, expect } from 'vitest';
import { isPremiumFeatureError } from './errors';
import type { AxiosError, AxiosResponse } from 'axios';

function mockAxiosError({
  status,
  data,
  message,
}: { status: number; data: any; message?: string }): AxiosError<any> {
  const response: AxiosResponse = {
    status,
    data,
    statusText: 'ERROR',
    headers: {},
    config: {},
  } as AxiosResponse;

  return {
    name: 'AxiosError',
    message: message || 'error',
    config: {},
    code: undefined,
    request: {},
    response,
    isAxiosError: true,
    toJSON() { return {}; },
  } as AxiosError<any>;
}

describe('isPremiumFeatureError', () => {
  it('returns true for explicit premium code', () => {
    const err = mockAxiosError({
      status: 400,
      data: { code: 'PREMIUM_REQUIRED', detail: 'Upgrade' },
    });
    expect(isPremiumFeatureError(err)).toBe(true);
  });

  it('returns true for 402 with upgrade language', () => {
    const err = mockAxiosError({
      status: 402,
      data: { detail: 'Upgrade to premium plan' },
    });
    expect(isPremiumFeatureError(err)).toBe(true);
  });

  it('returns true for 403 with subscription wording', () => {
    const err = mockAxiosError({
      status: 403,
      data: { detail: 'Subscription required' },
    });
    expect(isPremiumFeatureError(err)).toBe(true);
  });

  it('returns false for 403 without premium wording', () => {
    const err = mockAxiosError({
      status: 403,
      data: { detail: 'Forbidden' },
    });
    expect(isPremiumFeatureError(err)).toBe(false);
  });

  it('returns false for generic Error without keywords', () => {
    const err = new Error('Some random failure');
    expect(isPremiumFeatureError(err)).toBe(false);
  });

  it('returns true for message containing premium', () => {
    const err = new Error('Premium feature locked');
    expect(isPremiumFeatureError(err)).toBe(true);
  });
});
