import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Session, Participant, Story, Vote, CardType, ParticipantRole, StoryStatus } from '../types';
import { storageService } from '../services/storage';
import { generateId } from '../utils/voting';

interface AppState {
  sessions: Session[];
  participants: Participant[];
  stories: Story[];
  votes: Vote[];
  activeSessionId: string | null;
  activeStoryId: string | null;

  // Hydration
  hydrate: () => void;
  persist: () => void;

  // Sessions
  createSession: (sprintName: string, facilitator: string, cardType: CardType) => Session;
  deleteSession: (sessionId: string) => void;
  setActiveSession: (sessionId: string | null) => void;
  getActiveSession: () => Session | undefined;

  // Participants
  addParticipant: (name: string, role: ParticipantRole, sessionId: string) => Participant;
  removeParticipant: (participantId: string) => void;
  getSessionParticipants: (sessionId: string) => Participant[];

  // Stories
  addStory: (sessionId: string, title: string, description: string, storyId?: string) => Story;
  removeStory: (storyId: string) => void;
  setStoryStatus: (storyId: string, status: StoryStatus) => void;
  setFinalEstimate: (storyId: string, estimate: string) => void;
  setActiveStory: (storyId: string | null) => void;
  getSessionStories: (sessionId: string) => Story[];
  getActiveStory: () => Story | undefined;

  // Votes
  castVote: (storyId: string, participantId: string, value: string) => void;
  revealVotes: (storyId: string) => void;
  resetVotes: (storyId: string) => void;
  getStoryVotes: (storyId: string) => Vote[];
  isRevealed: (storyId: string) => boolean;
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    sessions: [],
    participants: [],
    stories: [],
    votes: [],
    activeSessionId: null,
    activeStoryId: null,

    hydrate() {
      const data = storageService.load();
      set({
        sessions: data.sessions,
        participants: data.participants,
        stories: data.stories,
        votes: data.votes,
        activeSessionId: data.activeSessionId,
        activeStoryId: data.activeStoryId,
      });
    },

    persist() {
      const { sessions, participants, stories, votes, activeSessionId, activeStoryId } = get();
      storageService.save({ sessions, participants, stories, votes, activeSessionId, activeStoryId });
    },

    // Sessions
    createSession(sprintName, facilitator, cardType) {
      const session: Session = {
        id: generateId(),
        sprintName,
        facilitator,
        cardType,
        createdAt: Date.now(),
        active: true,
      };
      set((state) => ({
        sessions: [...state.sessions, session],
        activeSessionId: session.id,
        activeStoryId: null,
      }));
      get().persist();
      return session;
    },

    deleteSession(sessionId) {
      set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== sessionId),
        participants: state.participants.filter((p) => p.sessionId !== sessionId),
        stories: state.stories.filter((s) => s.sessionId !== sessionId),
        votes: state.votes.filter(
          (v) => !state.stories.filter((s) => s.sessionId === sessionId).map((s) => s.id).includes(v.storyId)
        ),
        activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId,
        activeStoryId: state.activeSessionId === sessionId ? null : state.activeStoryId,
      }));
      get().persist();
    },

    setActiveSession(sessionId) {
      set({ activeSessionId: sessionId, activeStoryId: null });
      get().persist();
    },

    getActiveSession() {
      const { sessions, activeSessionId } = get();
      return sessions.find((s) => s.id === activeSessionId);
    },

    // Participants
    addParticipant(name, role, sessionId) {
      const participant: Participant = {
        id: generateId(),
        name,
        role,
        sessionId,
      };
      set((state) => ({ participants: [...state.participants, participant] }));
      get().persist();
      return participant;
    },

    removeParticipant(participantId) {
      set((state) => ({
        participants: state.participants.filter((p) => p.id !== participantId),
        votes: state.votes.filter((v) => v.participantId !== participantId),
      }));
      get().persist();
    },

    getSessionParticipants(sessionId) {
      return get().participants.filter((p) => p.sessionId === sessionId);
    },

    // Stories
    addStory(sessionId, title, description, storyId) {
      const story: Story = {
        id: storyId ?? generateId(),
        sessionId,
        title,
        description,
        status: 'pending',
        finalEstimate: null,
        createdAt: Date.now(),
      };
      set((state) => ({ stories: [...state.stories, story] }));
      get().persist();
      return story;
    },

    removeStory(storyId) {
      set((state) => ({
        stories: state.stories.filter((s) => s.id !== storyId),
        votes: state.votes.filter((v) => v.storyId !== storyId),
        activeStoryId: state.activeStoryId === storyId ? null : state.activeStoryId,
      }));
      get().persist();
    },

    setStoryStatus(storyId, status) {
      set((state) => ({
        stories: state.stories.map((s) => (s.id === storyId ? { ...s, status } : s)),
      }));
      get().persist();
    },

    setFinalEstimate(storyId, estimate) {
      set((state) => ({
        stories: state.stories.map((s) =>
          s.id === storyId ? { ...s, finalEstimate: estimate, status: 'estimated' } : s
        ),
      }));
      get().persist();
    },

    setActiveStory(storyId) {
      set({ activeStoryId: storyId });
      get().persist();
    },

    getSessionStories(sessionId) {
      return get().stories.filter((s) => s.sessionId === sessionId);
    },

    getActiveStory() {
      const { stories, activeStoryId } = get();
      return stories.find((s) => s.id === activeStoryId);
    },

    // Votes
    castVote(storyId, participantId, value) {
      set((state) => {
        // Remove existing vote for this participant on this story (replace)
        const filtered = state.votes.filter(
          (v) => !(v.storyId === storyId && v.participantId === participantId)
        );
        const vote: Vote = {
          id: generateId(),
          storyId,
          participantId,
          value,
          revealed: false,
          timestamp: Date.now(),
        };
        return { votes: [...filtered, vote] };
      });
      get().persist();
    },

    revealVotes(storyId) {
      set((state) => ({
        votes: state.votes.map((v) =>
          v.storyId === storyId ? { ...v, revealed: true } : v
        ),
      }));
      get().persist();
    },

    resetVotes(storyId) {
      set((state) => ({
        votes: state.votes.filter((v) => v.storyId !== storyId),
      }));
      // Also reset story to voting status
      get().setStoryStatus(storyId, 'voting');
      get().persist();
    },

    getStoryVotes(storyId) {
      return get().votes.filter((v) => v.storyId === storyId);
    },

    isRevealed(storyId) {
      const votes = get().getStoryVotes(storyId);
      return votes.length > 0 && votes.every((v) => v.revealed);
    },
  }))
);
