
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the available languages
export type Language = 'en' | 'ru';

// Define the language context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Create the language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to detect user's browser language
const detectBrowserLanguage = (): Language => {
  // Get browser language (navigator.language returns language code like 'en-US' or 'ru')
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  
  // Check if browser language is supported, otherwise default to English
  return browserLang === 'ru' ? 'ru' : 'en';
};

// Translation data for both languages
const translations = {
  en: {
    // App name
    'app.name': 'Listen to Sadhu',
    // Hero section
    'hero.tagline': 'Ancient Wisdom for Modern Life',
    'hero.title': 'Discover the [highlight]Vedic Knowledge[/highlight] in Your Pocket',
    'hero.description': 'Explore ancient Sanskrit teachings, guided meditations, and timeless wisdom adapted for your modern life journey, all within a beautiful mobile experience.',
    'hero.appStore': 'App Store',
    'hero.googlePlay': 'Google Play',
    'hero.reviews': '5-star reviews',
    // Statistics
    'stats.lectures': 'Lectures',
    'stats.lectors': 'Lectors',
    'stats.categories': 'Vedic Categories',
    'stats.updates': 'Wisdom Updates',
    // Nav
    'nav.features': 'Features',
    'nav.about': 'About',
    'nav.download': 'Download',
    // Feature section
    'features.title': 'Timeless Wisdom for Modern Seekers',
    'features.subtitle': 'Sadu brings the profound insights of ancient Vedic knowledge into your daily life through an intuitive, beautiful interface.',
    'features.swami.title': 'A.C. Bhaktivedanta Swami',
    'features.swami.description': 'Get all lectures from A.C. Bhaktivedanta Swami Prabhupada, a top Vedic scholar, packed with straight-up wisdom.',
    'features.transcript.title': 'Transcript Access',
    'features.transcript.description': 'Search transcripts fast, save key points, and share insights with others, no hassle.',
    'features.tracker.title': 'Sadhana Tracker',
    'features.tracker.description': 'Keep tabs on your spiritual progress and stay locked into Vedic practices daily.',
    // Download section
    'download.title': 'Begin Your Wisdom Journey',
    'download.description': 'Download the Listen to Sadhu app today and access centuries of Vedic wisdom reimagined for your modern life journey.',
    'download.appStore': 'App Store',
    'download.googlePlay': 'Google Play',
    'download.follow': 'Follow Us',
    'download.community': 'Join our community on social media to stay updated with the latest wisdom, events, and connect with fellow seekers.',
    'download.ratings.appStore': 'App Store Rating',
    'download.ratings.googlePlay': 'Google Play Rating',
    'download.ratings.users': 'Active Users',
    'download.ratings.pricing': 'With Premium Options',
    // Footer
    'footer.tagline': 'Ancient wisdom reimagined for your modern journey.',
    'footer.app': 'App',
    'footer.resources': 'Resources',
    'footer.company': 'Company',
    'footer.rights': '© 2025 AKd Studios',
    'footer.terms': 'Terms',
    'footer.privacy': 'Privacy',
  },
  ru: {
    // App name
    'app.name': 'Слушай Садху',
    // Hero section
    'hero.tagline': 'Мудрость вед',
    'hero.title': 'Все [highlight]ведические знания[/highlight] в одном приложении',
    'hero.description': 'Исследуйте древние санскритские учения, руководства по медитации и вневременную мудрость, адаптированную для вашего современного жизненного пути, всё в красивом мобильном приложении.',
    'hero.appStore': 'App Store',
    'hero.googlePlay': 'Google Play',
    'hero.reviews': 'отзывов с 5 звездами',
    // Statistics
    'stats.lectures': 'Лекций',
    'stats.lectors': 'Лекторов',
    'stats.categories': 'Ведических категорий',
    'stats.updates': 'Ежедневные обновления',
    // Nav
    'nav.features': 'Возможности',
    'nav.about': 'О нас',
    'nav.download': 'Скачать',
    // Feature section
    'features.title': 'Вневременная мудрость для современных искателей',
    'features.subtitle': 'Садху приносит глубокие прозрения древних ведических знаний в вашу повседневную жизнь через интуитивно понятный, красивый интерфейс.',
    'features.swami.title': 'А.Ч. Бхактиведанта Свами',
    'features.swami.description': 'Получите все лекции А.Ч. Бхактиведанты Свами Прабхупады, выдающегося ведического ученого, наполненные прямой мудростью.',
    'features.transcript.title': 'Доступ к транскриптам',
    'features.transcript.description': 'Быстро ищите в транскриптах, сохраняйте ключевые моменты и делитесь идеями с другими, без хлопот.',
    'features.tracker.title': 'Отслеживание садханы',
    'features.tracker.description': 'Следите за своим духовным прогрессом и ежедневно придерживайтесь ведических практик.',
    // Download section
    'download.title': 'Начните свой путь к мудрости',
    'download.description': 'Загрузите приложение Listen to Sadhu сегодня и получите доступ к вековой ведической мудрости, переосмысленной для вашего современного жизненного пути.',
    'download.appStore': 'App Store',
    'download.googlePlay': 'Google Play',
    'download.follow': 'Следите за нами',
    'download.community': 'Присоединяйтесь к нашему сообществу в социальных сетях, чтобы быть в курсе последних новостей, мероприятий и общаться с единомышленниками.',
    'download.ratings.appStore': 'Рейтинг App Store',
    'download.ratings.googlePlay': 'Рейтинг Google Play',
    'download.ratings.users': 'Активных пользователей',
    'download.ratings.pricing': 'С премиум-опциями',
    // Footer
    'footer.tagline': 'Древняя мудрость, переосмысленная для вашего современного пути.',
    'footer.app': 'Приложение',
    'footer.resources': 'Ресурсы',
    'footer.company': 'Компания',
    'footer.rights': '© 2025 AKd Studios',
    'footer.terms': 'Условия',
    'footer.privacy': 'Конфиденциальность',
  }
};

// Create the language provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try to get stored language from localStorage, then browser language, or default to English
  const [language, setLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    
    if (storedLanguage && ['en', 'ru'].includes(storedLanguage)) {
      return storedLanguage;
    } else {
      // If no stored preference, detect from browser
      return detectBrowserLanguage();
    }
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]] || key;
    return translation;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// Create a hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
