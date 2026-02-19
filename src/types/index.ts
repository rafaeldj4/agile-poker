export type CardType = 'fibonacci' | 'size';

export type ParticipantRole = 'Developer' | 'QA' | 'PO' | 'SM';

export type StoryStatus = 'pending' | 'voting' | 'estimated';

export type VoteStatus = 'pending' | 'voted';

export interface Session {
  id: string;
  sprintName: string;
  facilitator: string;
  cardType: CardType;
  createdAt: number;
  active: boolean;
}

export interface Participant {
  id: string;
  name: string;
  role: ParticipantRole;
  sessionId: string;
}

export interface Story {
  id: string;
  sessionId: string;
  title: string;
  description: string;
  status: StoryStatus;
  finalEstimate: string | null;
  createdAt: number;
}

export interface Vote {
  id: string;
  storyId: string;
  participantId: string;
  value: string;
  revealed: boolean;
  timestamp: number;
}

export interface VoteRound {
  storyId: string;
  votes: Vote[];
  revealed: boolean;
}

export interface VotingResult {
  average: number | null;
  mode: string | null;
  max: string | null;
  min: string | null;
  consensus: boolean;
  distribution: Record<string, number>;
  votedCount: number;
  totalParticipants: number;
}

export interface AppStorage {
  sessions: Session[];
  participants: Participant[];
  stories: Story[];
  votes: Vote[];
  activeSessionId: string | null;
  activeStoryId: string | null;
}

export const FIBONACCI_CARDS = ['1', '2', '3', '5', '8', '13', '21'] as const;
export const SIZE_CARDS = ['S', 'M', 'L', 'XL'] as const;

export type FibonacciCard = (typeof FIBONACCI_CARDS)[number];
export type SizeCard = (typeof SIZE_CARDS)[number];

export function getCardsForType(cardType: CardType): readonly string[] {
  return cardType === 'fibonacci' ? FIBONACCI_CARDS : SIZE_CARDS;
}
