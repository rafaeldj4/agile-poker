import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import type { CardType } from '../../types';

interface CreateSessionFormProps {
  onCreated?: () => void;
}

export function CreateSessionForm({ onCreated }: CreateSessionFormProps) {
  const { t } = useTranslation();
  const createSession = useAppStore((s) => s.createSession);

  const [sprintName, setSprintName] = useState('');
  const [facilitator, setFacilitator] = useState('');
  const [cardType, setCardType] = useState<CardType>('fibonacci');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!sprintName.trim()) newErrors.sprintName = t('error_name_required');
    if (!facilitator.trim()) newErrors.facilitator = t('error_facilitator_required');
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    createSession(sprintName.trim(), facilitator.trim(), cardType);
    onCreated?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label={t('sprint_name')}
        placeholder={t('sprint_name_placeholder')}
        value={sprintName}
        onChange={(e) => {
          setSprintName(e.target.value);
          if (errors.sprintName) setErrors((prev) => ({ ...prev, sprintName: '' }));
        }}
        error={errors.sprintName}
      />
      <Input
        label={t('facilitator')}
        placeholder={t('facilitator_placeholder')}
        value={facilitator}
        onChange={(e) => {
          setFacilitator(e.target.value);
          if (errors.facilitator) setErrors((prev) => ({ ...prev, facilitator: '' }));
        }}
        error={errors.facilitator}
      />
      <div className="flex flex-col gap-1">
        <Select value={cardType} onValueChange={(v) => setCardType(v as CardType)}>
          <SelectTrigger label={t('card_type')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fibonacci">{t('fibonacci')}</SelectItem>
            <SelectItem value="size">{t('size')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="mt-2">
        {t('create_session_btn')}
      </Button>
    </form>
  );
}
