import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Users, BookOpen, StickyNote } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ParticipantManager } from '../components/participants/ParticipantManager';
import { StoryManager } from '../components/stories/StoryManager';
import { VotingBoard } from '../components/voting/VotingBoard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const setActiveSession = useAppStore((s) => s.setActiveSession);
  const getActiveSession = useAppStore((s) => s.getActiveSession);
  const activeStoryId = useAppStore((s) => s.activeStoryId);
  const activeSessionId = useAppStore((s) => s.activeSessionId);

  useEffect(() => {
    if (id && id !== activeSessionId) {
      setActiveSession(id);
    }
  }, [id, activeSessionId, setActiveSession]);

  const session = getActiveSession();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{t('no_sessions')}</p>
          <Button onClick={() => navigate('/')}>{t('back')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Session header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate('/')}
              className="mt-0.5"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {session.sprintName}
                </h1>
                <Badge variant="default" className="capitalize">
                  {session.cardType}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                {t('facilitator')}: <span className="font-medium">{session.facilitator}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Participants + Stories */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              <Users className="h-4 w-4" />
              {t('participants')}
            </div>
            <ParticipantManager sessionId={session.id} activeStoryId={activeStoryId} />

            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              <StickyNote className="h-4 w-4" />
              {t('stories')}
            </div>
            <StoryManager sessionId={session.id} />
          </div>

          {/* Right column: Voting Board */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4">
              <BookOpen className="h-4 w-4" />
              {t('voting_board')}
            </div>
            <VotingBoard sessionId={session.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
