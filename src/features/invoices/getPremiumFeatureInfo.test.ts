import { describe, it, expect } from 'vitest';
import { getPremiumFeatureInfo } from './errors';
import type { AxiosError, AxiosResponse } from 'axios';

type MockResponseData = Record<string, unknown>;

function mockAxiosError({ status, data }: { status: number; data: MockResponseData }): AxiosError<MockResponseData> {
  const response = {
    status,
    data,
    statusText: 'ERROR',
    headers: {},
    config: {},
  } as unknown as AxiosResponse<MockResponseData>;
  return {
    name: 'AxiosError',
    message: 'error',
    config: {},
    code: undefined,
    request: {},
    response,
    isAxiosError: true,
    toJSON() { return {}; },
  } as unknown as AxiosError<MockResponseData>;
}

describe('getPremiumFeatureInfo', () => {
  it('flags required when premium code present', () => {
    const err = mockAxiosError({ status: 400, data: { code: 'PREMIUM_REQUIRED', detail: 'Upgrade' } });
    expect(getPremiumFeatureInfo(err)).toEqual({ required: true, code: 'PREMIUM_REQUIRED', message: 'Upgrade' });
  });
  it('flags required for 402 with wording', () => {
    const err = mockAxiosError({ status: 402, data: { detail: 'Upgrade to premium plan' } });
    expect(getPremiumFeatureInfo(err).required).toBe(true);
  });
  it('not required for generic 403 without wording', () => {
    const err = mockAxiosError({ status: 403, data: { detail: 'Forbidden' } });
    expect(getPremiumFeatureInfo(err).required).toBe(false);
  });
  it('false for simple Error', () => {
    expect(getPremiumFeatureInfo(new Error('random'))).toEqual({ required: false });
  });
});
