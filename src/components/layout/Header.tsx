import { useTranslation } from 'react-i18next';
import { Globe, Layers } from 'lucide-react';

export function Header() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(next);
  };

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {t('app_name')}
            </span>
          </div>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            title={t('language')}
          >
            <Globe className="h-4 w-4" />
            <span className="uppercase">{i18n.language === 'es' ? 'EN' : 'ES'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
