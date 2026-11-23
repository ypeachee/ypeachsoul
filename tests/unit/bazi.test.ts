import { describe, expect, it } from 'vitest';
import { buildBaziProfile } from '../../src/domain/bazi';

describe('interactive bazi lens', () => {
  it('calculates the four pillars with the local lunar library', () => {
    const result = buildBaziProfile({
      birthDate: '1990-06-01',
      birthTime: '08:30',
      timeKnown: true,
      gender: 'male',
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.profile.pillars.map((pillar) => pillar.ganZhi)).toEqual([
      '庚午',
      '辛巳',
      '丁酉',
      '甲辰',
    ]);
    expect(result.profile.dayMaster).toBe('丁火');
    expect(result.profile.zodiac).toBe('马');
  });

  it('omits the hour pillar when birth time is unknown', () => {
    const result = buildBaziProfile({
      birthDate: '1990-06-01',
      birthTime: '',
      timeKnown: false,
      gender: 'unspecified',
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.profile.pillars).toHaveLength(3);
    expect(result.profile.currentDaYun).toBeNull();
  });

  it('rejects impossible dates and malformed times', () => {
    expect(buildBaziProfile({
      birthDate: '1990-02-31',
      birthTime: '08:30',
      timeKnown: true,
      gender: 'female',
    })).toEqual({ ok: false, error: '请输入有效的出生日期' });

    expect(buildBaziProfile({
      birthDate: '1990-06-01',
      birthTime: '25:00',
      timeKnown: true,
      gender: 'female',
    })).toEqual({ ok: false, error: '请输入有效的出生时间' });
  });
});
