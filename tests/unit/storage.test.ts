import { describe, expect, it } from 'vitest';
import { createBrowserStorage, createMemoryStorage, STORAGE_KEY } from '../../src/state/storage';
import { questions } from '../../src/domain/questions';
import { createSession } from '../../src/state/session';

describe('persistence and session', () => {
  it('restores the last stable question and answer', () => {
    const fake = createMemoryStorage();
    const session = createSession(fake);
    session.start(true);
    session.answer('q1', 'q1-a');
    session.next();
    const restored = createSession(fake);
    expect(restored.state().currentQuestion).toBe(1);
    expect(restored.state().answers.q1).toBe('q1-a');
  });

  it('reports corrupted JSON without deleting it automatically', () => {
    const raw = new Map<string, string>([[STORAGE_KEY, '{bad-json']]);
    const adapter = createBrowserStorage({
      getItem: (key) => raw.get(key) ?? null,
      setItem: (key, value) => raw.set(key, value),
      removeItem: (key) => raw.delete(key),
    });
    expect(adapter.load()).toMatchObject({ status: 'invalid' });
    expect(raw.get(STORAGE_KEY)).toBe('{bad-json');
  });

  it('falls back to session-only state when writes fail', () => {
    const unavailable = createMemoryStorage(false);
    const session = createSession(unavailable);
    session.start(true);
    session.answer('q1', 'q1-a');
    expect(session.storageHealth()).toBe('session-only');
    expect(session.state().answers.q1).toBe('q1-a');
  });

  it('finishes once and keeps a deterministic result', () => {
    const session = createSession(createMemoryStorage());
    session.start(true);
    for (let index = 0; index < questions.length; index += 1) {
      session.answer(`q${index + 1}`, `q${index + 1}-a`);
      session.next();
    }
    const first = session.finish();
    const second = session.finish();
    expect(first).not.toBeNull();
    expect(second).toEqual(first);
  });

  it('reset removes the persisted draft only after an explicit call', () => {
    const fake = createMemoryStorage();
    const session = createSession(fake);
    session.start(true);
    session.answer('q1', 'q1-a');
    expect(createSession(fake).state().answers.q1).toBe('q1-a');
    session.reset();
    expect(createSession(fake).state().answers).toEqual({});
  });
});