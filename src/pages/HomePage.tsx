import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Clock, Trash2, ArrowRight, Layers } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { CreateSessionForm } from '../components/session/CreateSessionForm';
import { Button } from '../components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/Dialog';

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sessions = useAppStore((s) => s.sessions);
  const setActiveSession = useAppStore((s) => s.setActiveSession);
  const deleteSession = useAppStore((s) => s.deleteSession);
  const getSessionStories = useAppStore((s) => s.getSessionStories);

  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleLoadSession = (sessionId: string) => {
    setActiveSession(sessionId);
    navigate(`/session/${sessionId}`);
  };

  const handleCreated = () => {
    setShowCreate(false);
    const state = useAppStore.getState();
    if (state.activeSessionId) {
      navigate(`/session/${state.activeSessionId}`);
    }
  };

  const handleDelete = (sessionId: string) => {
    deleteSession(sessionId);
    setDeleteTarget(null);
  };

  const sortedSessions = [...sessions].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
            <Layers className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('home_title')}</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{t('home_subtitle')}</p>
          <Button
            size="lg"
            className="mt-6"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="h-5 w-5" />
            {t('create_session')}
          </Button>
        </div>

        {/* Recent sessions */}
        {sortedSessions.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
              {t('recent_sessions')}
            </h2>
            <div className="space-y-2">
              {sortedSessions.map((session) => {
                const stories = getSessionStories(session.id);
                const estimated = stories.filter((s) => s.status === 'estimated').length;
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 px-4 py-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {session.sprintName}
                        </p>
                        <span className="text-xs rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-gray-500">
                          {session.cardType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-500">{session.facilitator}</span>
                        <span className="text-xs text-gray-400">
                          {estimated}/{stories.length} {t('estimated_stories').toLowerCase()}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {new Date(session.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLoadSession(session.id)}
                        className="gap-1 group-hover:text-indigo-600"
                      >
                        {t('load_session')}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setDeleteTarget(session.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sortedSessions.length === 0 && !showCreate && (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 py-12 text-center">
            <p className="text-gray-400 text-sm">{t('no_sessions')}</p>
          </div>
        )}
      </div>

      {/* Create Session Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('new_session')}</DialogTitle>
            <DialogDescription>{t('home_subtitle')}</DialogDescription>
          </DialogHeader>
          <CreateSessionForm onCreated={handleCreated} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('delete')}</DialogTitle>
            <DialogDescription>{t('confirm_delete_session')}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>{t('cancel')}</Button>
            <Button variant="destructive" onClick={() => deleteTarget && handleDelete(deleteTarget)}>
              {t('delete')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
