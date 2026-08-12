import { createRequire } from 'module';
import { describe, it, expect } from 'vitest';

const require = createRequire(import.meta.url);
const { computeMatchPercentage, computeTier } = require('../src/services/matching.service');
const { extractSkillsFromText, normalizeSkill } = require('../src/utils/skills.dictionary');

describe('Matching Logic', () => {
  it('computes match percentages correctly', () => {
    expect(computeMatchPercentage(5, 6)).toBe(83);
    expect(computeMatchPercentage(2, 4)).toBe(50);
    expect(computeMatchPercentage(0, 5)).toBe(0);
    expect(computeMatchPercentage(0, 0)).toBe(0);
  });

  it('assigns tiers accurately', () => {
    expect(computeTier(83)).toBe('HIGH');
    expect(computeTier(70)).toBe('HIGH');
    expect(computeTier(69)).toBe('MEDIUM');
    expect(computeTier(40)).toBe('MEDIUM');
    expect(computeTier(39)).toBe('LOW');
    expect(computeTier(0)).toBe('LOW');
  });
});

describe('Skills Dictionary', () => {
  it('normalizes skill variants', () => {
    expect(normalizeSkill('ReactJS')).toBe('React');
    expect(normalizeSkill('react.js')).toBe('React');
    expect(normalizeSkill('NodeJS')).toBe('Node.js');
    expect(normalizeSkill('TS')).toBe('TypeScript');
  });

  it('extracts skills from text', () => {
    const text = 'Looking for a developer with ReactJS, TypeScript, and Docker experience.';
    const extracted = extractSkillsFromText(text);
    expect(extracted).toContain('React');
    expect(extracted).toContain('TypeScript');
    expect(extracted).toContain('Docker');
  });
});
