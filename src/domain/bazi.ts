import { Solar } from 'lunar-typescript';

export type WuXing = '木' | '火' | '土' | '金' | '水';
export type BaziGender = 'male' | 'female' | 'unspecified';

export interface BaziInput {
  birthDate: string;
  birthTime: string;
  timeKnown: boolean;
  gender: BaziGender;
}

export interface BaziPillar {
  label: string;
  ganZhi: string;
  wuXing: string;
  shiShen: string;
  naYin: string;
}

export interface BaziDaYun {
  startYear: number;
  endYear: number;
  ganZhi: string;
}

export interface BaziProfile {
  solarDate: string;
  lunarDate: string;
  zodiac: string;
  pillars: BaziPillar[];
  dayMaster: string;
  elementCounts: Record<WuXing, number>;
  dominantElements: WuXing[];
  missingElements: WuXing[];
  currentDaYun: BaziDaYun | null;
  upcomingDaYun: BaziDaYun[];
}

export type BaziResult =
  | { ok: true; profile: BaziProfile }
  | { ok: false; error: string };

const WU_XING: readonly WuXing[] = ['木', '火', '土', '金', '水'];

function parseDate(value: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    year < 1900 ||
    year > 2100
  ) {
    return null;
  }
  return { year, month, day };
}

function parseTime(value: string): { hour: number; minute: number } | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

function countElements(values: readonly string[]): Record<WuXing, number> {
  const counts = Object.fromEntries(WU_XING.map((element) => [element, 0])) as Record<WuXing, number>;
  for (const value of values) {
    for (const char of value) {
      if (WU_XING.includes(char as WuXing)) {
        counts[char as WuXing] += 1;
      }
    }
  }
  return counts;
}

export function buildBaziProfile(input: BaziInput): BaziResult {
  const date = parseDate(input.birthDate);
  if (!date) return { ok: false, error: '请输入有效的出生日期' };

  const birthTime = input.timeKnown ? parseTime(input.birthTime) : { hour: 12, minute: 0 };
  if (!birthTime) return { ok: false, error: '请输入有效的出生时间' };

  const solar = Solar.fromYmdHms(
    date.year,
    date.month,
    date.day,
    birthTime.hour,
    birthTime.minute,
    0,
  );
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const pillars: BaziPillar[] = [
    {
      label: '年柱',
      ganZhi: eightChar.getYear(),
      wuXing: eightChar.getYearWuXing(),
      shiShen: eightChar.getYearShiShenGan(),
      naYin: eightChar.getYearNaYin(),
    },
    {
      label: '月柱',
      ganZhi: eightChar.getMonth(),
      wuXing: eightChar.getMonthWuXing(),
      shiShen: eightChar.getMonthShiShenGan(),
      naYin: eightChar.getMonthNaYin(),
    },
    {
      label: '日柱',
      ganZhi: eightChar.getDay(),
      wuXing: eightChar.getDayWuXing(),
      shiShen: '日主',
      naYin: eightChar.getDayNaYin(),
    },
  ];

  if (input.timeKnown) {
    pillars.push({
      label: '时柱',
      ganZhi: eightChar.getTime(),
      wuXing: eightChar.getTimeWuXing(),
      shiShen: eightChar.getTimeShiShenGan(),
      naYin: eightChar.getTimeNaYin(),
    });
  }

  const elementCounts = countElements(pillars.map((pillar) => pillar.wuXing));
  const maxCount = Math.max(...Object.values(elementCounts));
  const dominantElements = WU_XING.filter((element) => elementCounts[element] === maxCount);
  const missingElements = WU_XING.filter((element) => elementCounts[element] === 0);

  let currentDaYun: BaziDaYun | null = null;
  let upcomingDaYun: BaziDaYun[] = [];
  if (input.gender !== 'unspecified') {
    const yun = eightChar.getYun(input.gender === 'male' ? 1 : 0);
    const daYun = yun.getDaYun(10)
      .map((item) => ({
        startYear: item.getStartYear(),
        endYear: item.getEndYear(),
        ganZhi: item.getGanZhi(),
      }))
      .filter((item) => item.ganZhi);
    const currentYear = new Date().getFullYear();
    const currentIndex = daYun.findIndex((item) => item.startYear <= currentYear && currentYear <= item.endYear);
    if (currentIndex >= 0) {
      currentDaYun = daYun[currentIndex];
      upcomingDaYun = daYun.slice(currentIndex + 1, currentIndex + 3);
    } else {
      upcomingDaYun = daYun.filter((item) => item.startYear > currentYear).slice(0, 2);
    }
  }

  return {
    ok: true,
    profile: {
      solarDate: `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`,
      lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
      zodiac: lunar.getYearShengXiaoExact(),
      pillars,
      dayMaster: `${eightChar.getDayGan()}${eightChar.getDayWuXing().charAt(0)}`,
      elementCounts,
      dominantElements,
      missingElements,
      currentDaYun,
      upcomingDaYun,
    },
  };
}

export function elementPractice(element: WuXing | undefined): string {
  switch (element) {
    case '木':
      return '先画一个 15 分钟能启动的草图或提纲，让想法有一个可见的枝干。';
    case '火':
      return '先做一个能被别人看见的最小动作，但不要同时点亮太多战线。';
    case '土':
      return '先完成一个已经拖了两天的小收尾，让环境重新变得稳。';
    case '金':
      return '写下一句边界，明确今天什么不做，以及什么必须完成。';
    case '水':
      return '留十分钟只观察和记录，不急着把感受变成结论。';
    default:
      return '只选一个今天能完成的小动作，先恢复对节奏的掌控。';
  }
}
