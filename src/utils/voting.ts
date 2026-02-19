import type { Vote, VotingResult, CardType } from '../types';

export function calculateResults(
  votes: Vote[],
  totalParticipants: number,
  cardType: CardType
): VotingResult {
  const castVotes = votes.filter((v) => v.value !== '');
  const votedCount = castVotes.length;

  if (votedCount === 0) {
    return {
      average: null,
      mode: null,
      max: null,
      min: null,
      consensus: false,
      distribution: {},
      votedCount: 0,
      totalParticipants,
    };
  }

  // Build distribution
  const distribution: Record<string, number> = {};
  for (const vote of castVotes) {
    distribution[vote.value] = (distribution[vote.value] ?? 0) + 1;
  }

  // Mode (most common)
  const mode = Object.entries(distribution).sort((a, b) => b[1] - a[1])[0][0];

  // Consensus: all voters chose the same value
  const consensus = Object.keys(distribution).length === 1;

  if (cardType === 'fibonacci') {
    const numericVotes = castVotes.map((v) => parseInt(v.value, 10)).filter((n) => !isNaN(n));
    const average = numericVotes.length > 0
      ? Math.round(numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length * 10) / 10
      : null;

    const sorted = [...numericVotes].sort((a, b) => a - b);
    const min = sorted.length > 0 ? String(sorted[0]) : null;
    const max = sorted.length > 0 ? String(sorted[sorted.length - 1]) : null;

    return { average, mode, max, min, consensus, distribution, votedCount, totalParticipants };
  } else {
    // Size cards — no numeric average
    const sizeOrder: Record<string, number> = { S: 0, M: 1, L: 2, XL: 3 };
    const sortedValues = castVotes
      .map((v) => v.value)
      .sort((a, b) => (sizeOrder[a] ?? 99) - (sizeOrder[b] ?? 99));

    const min = sortedValues[0] ?? null;
    const max = sortedValues[sortedValues.length - 1] ?? null;

    return { average: null, mode, max, min, consensus, distribution, votedCount, totalParticipants };
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
