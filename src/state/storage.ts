import { questions } from '../domain/questions';
import { ARCHETYPE_IDS, type AnswerMap, type ArchetypeId, type QuizResult } from '../domain/types';

export const STORAGE_KEY = 'soul_manual_v1';

export interface PersistedState {
  schemaVersion: 1;
  answers: AnswerMap;
  currentQuestion: number;
  result: QuizResult | null;
  updatedAt: string;
}

export type StorageLoad =
  | { status: 'empty' }
  | { status: 'ok'; state: PersistedState }
  | { status: 'invalid'; reason: string }
  | { status: 'unavailable'; reason: string };

export interface StorageAdapter {
  load(): StorageLoad;
  save(state: PersistedState): 'saved' | 'unavailable';
  clear(): 'cleared' | 'unavailable';
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const questionById = new Map(questions.map((question) => [question.id, question]));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidResult(value: unknown): value is QuizResult {
  if (!isRecord(value) || !ARCHETYPE_IDS.includes(value.archetypeId as ArchetypeId)) {
    return false;
  }
  if (typeof value.completedAt !== 'string' || !isRecord(value.scores)) {
    return false;
  }
  const scores = value.scores;
  return ARCHETYPE_IDS.every((id) => typeof scores[id] === 'number');
}

function isValidState(value: unknown): value is PersistedState {
  if (!isRecord(value) || value.schemaVersion !== 1 || !isRecord(value.answers)) {
    return false;
  }
  if (!Number.isInteger(value.currentQuestion) || Number(value.currentQuestion) < 0 || Number(value.currentQuestion) >= questions.length) {
    return false;
  }
  if (typeof value.updatedAt !== 'string' || (value.result !== null && !isValidResult(value.result))) {
    return false;
  }
  return Object.entries(value.answers).every(([questionId, optionId]) => {
    if (typeof optionId !== 'string') {
      return false;
    }
    const question = questionById.get(questionId);
    return Boolean(question?.options.some((option) => option.id === optionId));
  });
}

function decode(raw: string): StorageLoad {
  try {
    const parsed: unknown = JSON.parse(raw);
    return isValidState(parsed) ? { status: 'ok', state: parsed } : { status: 'invalid', reason: '数据格式或版本不兼容' };
  } catch {
    return { status: 'invalid', reason: '本地草稿不是合法 JSON' };
  }
}

export function createBrowserStorage(storage?: StorageLike): StorageAdapter {
  const backend = storage ?? window.localStorage;
  return {
    load() {
      try {
        const raw = backend.getItem(STORAGE_KEY);
        return raw === null ? { status: 'empty' } : decode(raw);
      } catch {
        return { status: 'unavailable', reason: '浏览器禁止访问本地存储' };
      }
    },
    save(state) {
      try {
        backend.setItem(STORAGE_KEY, JSON.stringify(state));
        return 'saved';
      } catch {
        return 'unavailable';
      }
    },
    clear() {
      try {
        backend.removeItem(STORAGE_KEY);
        return 'cleared';
      } catch {
        return 'unavailable';
      }
    },
  };
}

export function createMemoryStorage(available = true): StorageAdapter {
  const values = new Map<string, string>();
  return {
    load() {
      if (!available) {
        return { status: 'unavailable', reason: '测试存储不可用' };
      }
      const raw = values.get(STORAGE_KEY);
      return raw === undefined ? { status: 'empty' } : decode(raw);
    },
    save(state) {
      if (!available) {
        return 'unavailable';
      }
      values.set(STORAGE_KEY, JSON.stringify(state));
      return 'saved';
    },
    clear() {
      if (!available) {
        return 'unavailable';
      }
      values.delete(STORAGE_KEY);
      return 'cleared';
    },
  };
}