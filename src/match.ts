import type { Item } from '@/types';

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'of',
  'in',
  'on',
  'at',
  'to',
  'for',
  'with',
  'my',
  'i',
  'is',
  'it',
  'this',
  'that',
  'was',
  'lost',
  'found',
  'item',
  'please',
  'has',
  'have',
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1 && !STOP_WORDS.has(w))
  );
}

export interface MatchResult {
  item: Item;
  score: number;
  reasons: string[];
}

export function findMatches(
  reported: Omit<Item, 'id'>,
  pool: Item[],
  limit = 3
): MatchResult[] {
  const oppositeStatus = reported.status === 'lost' ? 'found' : 'lost';
  const nameTokens = tokenize(reported.name);
  const locTokens = tokenize(reported.location);
  const descTokens = tokenize(reported.description);

  const results: MatchResult[] = [];

  for (const candidate of pool) {
    if (candidate.status !== oppositeStatus) continue;

    let score = 0;
    const reasons: string[] = [];

    if (candidate.category === reported.category) {
      score += 3;
      reasons.push('same category');
    }

    const candNameTokens = tokenize(candidate.name);
    let nameOverlap = 0;
    nameTokens.forEach((t) => {
      if (candNameTokens.has(t)) nameOverlap++;
    });
    if (nameOverlap > 0) {
      score += Math.min(nameOverlap, 3) * 2;
      reasons.push('similar name');
    }

    const candLocTokens = tokenize(candidate.location);
    let locOverlap = 0;
    locTokens.forEach((t) => {
      if (candLocTokens.has(t)) locOverlap++;
    });
    if (locOverlap > 0) {
      score += Math.min(locOverlap, 2) * 2;
      reasons.push('same area');
    }

    const candDescTokens = tokenize(candidate.description);
    let descOverlap = 0;
    descTokens.forEach((t) => {
      if (candDescTokens.has(t)) descOverlap++;
    });
    if (descOverlap >= 2) {
      score += 1;
      reasons.push('matching details');
    }

    if (score > 0) {
      results.push({ item: candidate, score, reasons });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
