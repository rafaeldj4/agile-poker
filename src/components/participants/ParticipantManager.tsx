import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import type { ParticipantRole } from '../../types';

interface ParticipantManagerProps {
  sessionId: string;
  activeStoryId?: string | null;
}

const ROLES: ParticipantRole[] = ['Developer', 'QA', 'PO', 'SM'];

const roleColors: Record<ParticipantRole, 'default' | 'success' | 'warning' | 'secondary'> = {
  Developer: 'default',
  QA: 'success',
  PO: 'warning',
  SM: 'secondary',
};

export function ParticipantManager({ sessionId, activeStoryId }: ParticipantManagerProps) {
  const { t } = useTranslation();
  const addParticipant = useAppStore((s) => s.addParticipant);
  const removeParticipant = useAppStore((s) => s.removeParticipant);
  const getSessionParticipants = useAppStore((s) => s.getSessionParticipants);
  const getStoryVotes = useAppStore((s) => s.getStoryVotes);

  const participants = getSessionParticipants(sessionId);
  const votes = activeStoryId ? getStoryVotes(activeStoryId) : [];

  const [name, setName] = useState('');
  const [role, setRole] = useState<ParticipantRole>('Developer');
  const [nameError, setNameError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const getRoleLabel = (r: ParticipantRole) => {
    const map: Record<ParticipantRole, string> = {
      Developer: t('roles_developer'),
      QA: t('roles_qa'),
      PO: t('roles_po'),
      SM: t('roles_sm'),
    };
    return map[r];
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError(t('error_participant_name_required'));
      return;
    }
    addParticipant(name.trim(), role, sessionId);
    setName('');
    setRole('Developer');
    setNameError('');
    setShowForm(false);
  };

  const hasVoted = (participantId: string) =>
    votes.some((v) => v.participantId === participantId);

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          {t('participants')}
          <span className="ml-2 text-sm font-normal text-gray-500">({participants.length})</span>
        </h2>
        <Button
          size="sm"
          variant={showForm ? 'outline' : 'default'}
          onClick={() => setShowForm(!showForm)}
        >
          <UserPlus className="h-4 w-4" />
          {t('add_participant')}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col gap-3">
            <Input
              label={t('participant_name')}
              placeholder={t('participant_name_placeholder')}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError('');
              }}
              error={nameError}
              autoFocus
            />
            <Select value={role} onValueChange={(v) => setRole(v as ParticipantRole)}>
              <SelectTrigger label={t('role')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {getRoleLabel(r)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                {t('add')}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => { setShowForm(false); setName(''); setNameError(''); }}
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        </form>
      )}

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {participants.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-gray-500">{t('no_participants')}</p>
        ) : (
          participants.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-sm font-bold">
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</p>
                  <Badge variant={roleColors[p.role]} className="mt-0.5">
                    {getRoleLabel(p.role)}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activeStoryId && (
                  hasVoted(p.id) ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-400" />
                  )
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeParticipant(p.id)}
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
