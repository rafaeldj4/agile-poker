import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, RotateCcw, CheckSquare, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { getCardsForType } from '../../types';
import { calculateResults } from '../../utils/voting';
import { ResultsPanel } from './ResultsPanel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

interface VotingBoardProps {
  sessionId: string;
}

export function VotingBoard({ sessionId }: VotingBoardProps) {
  const { t } = useTranslation();
  const session = useAppStore((s) => s.getActiveSession());
  const activeStoryId = useAppStore((s) => s.activeStoryId);
  const getActiveStory = useAppStore((s) => s.getActiveStory);
  const getSessionParticipants = useAppStore((s) => s.getSessionParticipants);
  const getStoryVotes = useAppStore((s) => s.getStoryVotes);
  const castVote = useAppStore((s) => s.castVote);
  const revealVotes = useAppStore((s) => s.revealVotes);
  const resetVotes = useAppStore((s) => s.resetVotes);
  const setFinalEstimate = useAppStore((s) => s.setFinalEstimate);
  const setActiveStory = useAppStore((s) => s.setActiveStory);
  const setStoryStatus = useAppStore((s) => s.setStoryStatus);
  const isRevealed = useAppStore((s) => s.isRevealed);
  const getSessionStories = useAppStore((s) => s.getSessionStories);

  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<string>('');

  const story = getActiveStory();
  const participants = getSessionParticipants(sessionId);
  const votes = activeStoryId ? getStoryVotes(activeStoryId) : [];
  const revealed = activeStoryId ? isRevealed(activeStoryId) : false;
  const cards = session ? getCardsForType(session.cardType) : [];

  const stories = getSessionStories(sessionId);
  const currentIndex = stories.findIndex((s) => s.id === activeStoryId);
  const nextStory = currentIndex >= 0 ? stories[currentIndex + 1] : undefined;

  if (!activeStoryId || !story) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 text-center">
        <p className="text-gray-500 text-sm">{t('select_card')}</p>
        <p className="text-gray-400 text-xs mt-1">{t('vote_story')}</p>
      </div>
    );
  }

  const votedCount = votes.length;
  const totalParticipants = participants.length;
  const allVoted = totalParticipants > 0 && votedCount >= totalParticipants;

  const getParticipantVote = (participantId: string) =>
    votes.find((v) => v.participantId === participantId);

  const handleVote = (value: string) => {
    if (!selectedParticipant) return;
    castVote(activeStoryId, selectedParticipant, value);
  };

  const handleReveal = () => {
    revealVotes(activeStoryId);
  };

  const handleReset = () => {
    if (confirmReset) {
      resetVotes(activeStoryId);
      setConfirmReset(false);
      setSelectedEstimate('');
    } else {
      setConfirmReset(true);
    }
  };

  const handleFinish = () => {
    if (selectedEstimate) {
      setFinalEstimate(activeStoryId, selectedEstimate);
      setActiveStory(null);
      setSelectedEstimate('');
    }
  };

  const handleNextStory = () => {
    if (nextStory) {
      if (selectedEstimate) {
        setFinalEstimate(activeStoryId, selectedEstimate);
      }
      resetVotes(nextStory.id);
      setStoryStatus(nextStory.id, 'voting');
      setActiveStory(nextStory.id);
      setSelectedEstimate('');
    }
  };

  const results = revealed
    ? calculateResults(votes, totalParticipants, session?.cardType ?? 'fibonacci')
    : null;

  const selectedParticipantVote = selectedParticipant
    ? getParticipantVote(selectedParticipant)?.value
    : undefined;

  return (
    <div className="space-y-4">
      {/* Story info */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 font-mono">{story.id !== activeStoryId ? story.id : ''}</p>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{story.title}</h3>
            {story.description && (
              <p className="text-sm text-gray-500 mt-1">{story.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-gray-500">
              {votedCount} {t('votes_of')} {totalParticipants}
            </span>
            {allVoted ? (
              <Badge variant="success">{t('all_voted')}</Badge>
            ) : (
              <Badge variant="warning">{t('waiting_votes')}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Participant selector */}
      {participants.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
          <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
            <SelectTrigger label={t('your_vote')}>
              <SelectValue placeholder={t('select_card')} />
            </SelectTrigger>
            <SelectContent>
              {participants.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} — {p.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Cards */}
          {selectedParticipant && !revealed && (
            <div className="flex flex-wrap gap-2 mt-4">
              {cards.map((card) => {
                const isSelected = selectedParticipantVote === card;
                return (
                  <button
                    key={card}
                    onClick={() => handleVote(card)}
                    className={`
                      relative flex h-16 w-12 items-center justify-center rounded-lg border-2 text-lg font-bold
                      transition-all duration-200 hover:scale-105 active:scale-95
                      ${isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 scale-105'
                        : 'border-gray-300 bg-white text-gray-800 hover:border-indigo-400 hover:bg-indigo-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20'
                      }
                    `}
                  >
                    {card}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Votes status grid */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t('voting_in_progress')}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {participants.map((p) => {
            const vote = getParticipantVote(p.id);
            return (
              <div
                key={p.id}
                className={`flex flex-col items-center rounded-lg border p-3 transition-all ${
                  vote
                    ? 'border-indigo-200 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/20'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                }`}
              >
                <div className={`
                  flex h-10 w-8 items-center justify-center rounded-md border-2 text-sm font-bold mb-1.5
                  ${vote
                    ? revealed
                      ? 'border-indigo-500 bg-indigo-600 text-white'
                      : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  }
                `}>
                  {vote ? (revealed ? vote.value : '✓') : '?'}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 text-center truncate w-full">
                  {p.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {!revealed && (
          <Button
            onClick={handleReveal}
            disabled={votedCount === 0}
            className="flex-1"
          >
            <Eye className="h-4 w-4" />
            {t('reveal_votes')}
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleReset}
          className={confirmReset ? 'flex-1 border-red-300 text-red-600 hover:bg-red-50' : ''}
        >
          <RotateCcw className="h-4 w-4" />
          {confirmReset ? t('confirm') : t('reset_votes')}
        </Button>
        {confirmReset && (
          <Button variant="ghost" onClick={() => setConfirmReset(false)}>
            {t('cancel')}
          </Button>
        )}
      </div>

      {/* Results */}
      {revealed && results && (
        <ResultsPanel results={results} cardType={session?.cardType ?? 'fibonacci'} />
      )}

      {/* Set final estimate */}
      {revealed && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('set_estimate')}
          </h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {cards.map((card) => (
              <button
                key={card}
                onClick={() => setSelectedEstimate(card)}
                className={`
                  flex h-12 w-10 items-center justify-center rounded-lg border-2 text-base font-bold
                  transition-all duration-200 hover:scale-105
                  ${selectedEstimate === card
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-gray-300 bg-white text-gray-800 hover:border-emerald-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  }
                `}
              >
                {card}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="success"
              onClick={handleFinish}
              disabled={!selectedEstimate}
              className="flex-1"
            >
              <CheckSquare className="h-4 w-4" />
              {t('finish_story')} {selectedEstimate ? `(${selectedEstimate})` : ''}
            </Button>
            {nextStory && (
              <Button variant="outline" onClick={handleNextStory}>
                <ChevronRight className="h-4 w-4" />
                {t('next_story')}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
