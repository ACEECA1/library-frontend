import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="relative group cursor-pointer z-50">
      <div className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-full transition-colors text-white">
        <Globe size={20} />
      </div>
      <div className="absolute right-0 top-full pt-2 w-32 hidden group-hover:block z-50">
        <div className="bg-white rounded-lg shadow-xl py-2 text-gray-800 border border-gray-100">
          <button
            onClick={() => i18n.changeLanguage('en')}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${i18n.language === 'en' ? 'font-bold text-[#00502D]' : ''}`}
          >
            {t('language.en', 'English')}
          </button>
          <button
            onClick={() => i18n.changeLanguage('fr')}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${i18n.language === 'fr' ? 'font-bold text-[#00502D]' : ''}`}
          >
            {t('language.fr', 'Français')}
          </button>
        </div>
      </div>
    </div>
  );
}
