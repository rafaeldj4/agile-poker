import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, BarChart2, Zap } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { VotingResult, CardType } from '../../types';

interface ResultsPanelProps {
  results: VotingResult;
  cardType: CardType;
}

export function ResultsPanel({ results, cardType }: ResultsPanelProps) {
  const { t } = useTranslation();
  const { average, mode, max, min, consensus, distribution, votedCount, totalParticipants } = results;

  const totalVotes = Object.values(distribution).reduce((a, b) => a + b, 0);

  const sortedDistribution = Object.entries(distribution).sort((a, b) => {
    if (cardType === 'fibonacci') return parseInt(a[0]) - parseInt(b[0]);
    const sizeOrder: Record<string, number> = { S: 0, M: 1, L: 2, XL: 3 };
    return (sizeOrder[a[0]] ?? 99) - (sizeOrder[b[0]] ?? 99);
  });

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t('results')}</h4>
        {consensus ? (
          <Badge variant="success" className="gap-1">
            <Zap className="h-3 w-3" />
            {t('consensus_yes')}
          </Badge>
        ) : (
          <Badge variant="secondary">{t('consensus_no')}</Badge>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {cardType === 'fibonacci' && average !== null && (
          <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">{t('average')}</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{average}</p>
          </div>
        )}
        <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">{t('most_common')}</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{mode ?? '—'}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="h-3 w-3 text-gray-400" />
            <p className="text-xs text-gray-500">{t('highest')}</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{max ?? '—'}</p>
        </div>
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingDown className="h-3 w-3 text-gray-400" />
            <p className="text-xs text-gray-500">{t('lowest')}</p>
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{min ?? '—'}</p>
        </div>
      </div>

      {/* Distribution */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <BarChart2 className="h-3.5 w-3.5 text-gray-400" />
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {t('distribution')} — {votedCount} {t('votes_of')} {totalParticipants}
          </p>
        </div>
        <div className="space-y-1.5">
          {sortedDistribution.map(([value, count]) => {
            const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            return (
              <div key={value} className="flex items-center gap-2">
                <span className="w-8 text-right text-sm font-bold text-gray-700 dark:text-gray-300 shrink-0">
                  {value}
                </span>
                <div className="flex-1 rounded-full bg-gray-100 dark:bg-gray-800 h-5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 text-xs text-gray-500 shrink-0">{count}x ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
