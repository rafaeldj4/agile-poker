import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Play, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { Story } from '../../types';

interface StoryManagerProps {
  sessionId: string;
}

export function StoryManager({ sessionId }: StoryManagerProps) {
  const { t } = useTranslation();
  const addStory = useAppStore((s) => s.addStory);
  const removeStory = useAppStore((s) => s.removeStory);
  const setStoryStatus = useAppStore((s) => s.setStoryStatus);
  const setActiveStory = useAppStore((s) => s.setActiveStory);
  const activeStoryId = useAppStore((s) => s.activeStoryId);
  const resetVotes = useAppStore((s) => s.resetVotes);
  const getSessionStories = useAppStore((s) => s.getSessionStories);

  const stories = getSessionStories(sessionId);

  const [showForm, setShowForm] = useState(false);
  const [storyId, setStoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [pendingStoryChange, setPendingStoryChange] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError(t('error_story_title_required'));
      return;
    }
    addStory(sessionId, title.trim(), description.trim(), storyId.trim() || undefined);
    setStoryId('');
    setTitle('');
    setDescription('');
    setTitleError('');
    setShowForm(false);
  };

  const handleStartVoting = (story: Story) => {
    if (activeStoryId && activeStoryId !== story.id) {
      // Warn: changing story during voting
      setPendingStoryChange(story.id);
      return;
    }
    startVoting(story.id);
  };

  const startVoting = (id: string) => {
    if (activeStoryId && activeStoryId !== id) {
      resetVotes(activeStoryId);
      setStoryStatus(activeStoryId, 'pending');
    }
    setStoryStatus(id, 'voting');
    setActiveStory(id);
    setPendingStoryChange(null);
  };

  const statusBadge = (status: Story['status']) => {
    if (status === 'pending') return <Badge variant="secondary">{t('story_status_pending')}</Badge>;
    if (status === 'voting') return <Badge variant="warning">{t('story_status_voting')}</Badge>;
    return <Badge variant="success">{t('story_status_estimated')}</Badge>;
  };

  const statusIcon = (status: Story['status']) => {
    if (status === 'pending') return <Circle className="h-4 w-4 text-gray-400" />;
    if (status === 'voting') return <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />;
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          {t('stories')}
          <span className="ml-2 text-sm font-normal text-gray-500">({stories.length})</span>
        </h2>
        <Button size="sm" variant={showForm ? 'outline' : 'default'} onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          {t('add_story')}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="border-b border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <Input
            label={t('story_id')}
            placeholder={t('story_id_placeholder')}
            value={storyId}
            onChange={(e) => setStoryId(e.target.value)}
          />
          <Input
            label={t('story_title')}
            placeholder={t('story_title_placeholder')}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError('');
            }}
            error={titleError}
          />
          <Textarea
            label={`${t('story_description')} (${t('optional')})`}
            placeholder={t('story_description_placeholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm">{t('add')}</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => { setShowForm(false); setTitle(''); setStoryId(''); setDescription(''); setTitleError(''); }}>
              {t('cancel')}
            </Button>
          </div>
        </form>
      )}

      {/* Confirm story change dialog */}
      {pendingStoryChange && (
        <div className="border-b border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 px-4 py-3">
          <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">{t('confirm_change_story')}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="warning" onClick={() => startVoting(pendingStoryChange)}>
              {t('confirm')}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setPendingStoryChange(null)}>
              {t('cancel')}
            </Button>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {stories.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-gray-500">{t('no_stories')}</p>
        ) : (
          stories.map((story) => (
            <div
              key={story.id}
              className={`flex items-start justify-between px-4 py-3 transition-colors ${
                activeStoryId === story.id ? 'bg-indigo-50 dark:bg-indigo-900/10' : ''
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                {statusIcon(story.status)}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {story.id && (
                      <span className="text-xs font-mono text-gray-400">{story.id}</span>
                    )}
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{story.title}</p>
                  </div>
                  {story.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{story.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {statusBadge(story.status)}
                    {story.finalEstimate && (
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {t('final_estimate')}: {story.finalEstimate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2 shrink-0">
                {story.status !== 'estimated' && (
                  <Button
                    size="icon-sm"
                    variant={activeStoryId === story.id ? 'secondary' : 'ghost'}
                    onClick={() => handleStartVoting(story)}
                    title={t('vote_story')}
                  >
                    <Play className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => removeStory(story.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
