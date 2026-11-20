export const ARCHETYPE_IDS = [
  'deep-diver',
  'stargazer',
  'alchemist',
  'dream-weaver',
  'architect',
  'pathfinder',
  'fire-keeper',
  'wind-chaser',
] as const;

export type ArchetypeId = (typeof ARCHETYPE_IDS)[number];

export interface Archetype {
  id: ArchetypeId;
  name: string;
  tagline: string;
  keywords: readonly string[];
  strengths: readonly [string, string, string];
  blindSpots: readonly [string, string];
  relationship: string;
  work: string;
  action: string;
  accent: string;
}

export interface QuizOption {
  id: string;
  label: string;
  archetypeId: ArchetypeId;
}

export interface Question {
  id: string;
  prompt: string;
  options: readonly QuizOption[];
}

export type AnswerMap = Readonly<Record<string, string>>;
export type ArchetypeScores = Record<ArchetypeId, number>;

export interface QuizResult {
  archetypeId: ArchetypeId;
  scores: Readonly<ArchetypeScores>;
  completedAt: string;
}