import { questions } from '../domain/questions';
import { scoreAnswers } from '../domain/scoring';
import type { AnswerMap, QuizResult } from '../domain/types';
import type { PersistedState, StorageAdapter, StorageLoad } from './storage';

export interface SessionLoadIssue {
  kind: 'invalid' | 'unavailable';
  reason: string;
}

export interface Session {
  state(): PersistedState;
  start(force?: boolean): void;
  answer(questionId: string, optionId: string): boolean;
  next(): void;
  previous(): void;
  finish(): QuizResult | null;
  reset(): void;
  storageHealth(): 'persistent' | 'session-only';
  loadIssue(): SessionLoadIssue | null;
}

function emptyState(): PersistedState {
  return {
    schemaVersion: 1,
    answers: {},
    currentQuestion: 0,
    result: null,
    updatedAt: new Date().toISOString(),
  };
}

export function createSession(adapter: StorageAdapter): Session {
  let current = emptyState();
  let health: 'persistent' | 'session-only' = 'persistent';
  let issue: SessionLoadIssue | null = null;
  const loaded: StorageLoad = adapter.load();

  if (loaded.status === 'ok') {
    current = loaded.state;
  } else if (loaded.status === 'invalid') {
    issue = { kind: 'invalid', reason: loaded.reason };
  } else if (loaded.status === 'unavailable') {
    health = 'session-only';
    issue = { kind: 'unavailable', reason: loaded.reason };
  }

  const persist = (): void => {
    current = { ...current, updatedAt: new Date().toISOString() };
    if (adapter.save(current) === 'unavailable') {
      health = 'session-only';
    }
  };

  return {
    state: () => ({ ...current, answers: { ...current.answers } }),
    start(force = false) {
      if (force || Object.keys(current.answers).length === 0) {
        current = emptyState();
        issue = null;
      }
      persist();
    },
    answer(questionId, optionId) {
      const question = questions.find((item) => item.id === questionId);
      if (!question?.options.some((option) => option.id === optionId)) {
        return false;
      }
      const answers: AnswerMap = { ...current.answers, [questionId]: optionId };
      current = { ...current, answers, result: null };
      persist();
      return true;
    },
    next() {
      const question = questions[current.currentQuestion];
      if (!current.answers[question.id] || current.currentQuestion >= questions.length - 1) {
        return;
      }
      current = { ...current, currentQuestion: current.currentQuestion + 1 };
      persist();
    },
    previous() {
      if (current.currentQuestion === 0) {
        return;
      }
      current = { ...current, currentQuestion: current.currentQuestion - 1 };
      persist();
    },
    finish() {
      if (current.result) {
        return current.result;
      }
      const result = scoreAnswers(current.answers);
      if (!result) {
        return null;
      }
      current = { ...current, result, currentQuestion: questions.length - 1 };
      persist();
      return result;
    },
    reset() {
      adapter.clear();
      current = emptyState();
      issue = null;
    },
    storageHealth: () => health,
    loadIssue: () => issue,
  };
}