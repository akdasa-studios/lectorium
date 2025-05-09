
import React from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className="bg-white/80 hover:bg-white text-sadu-dark-purple font-medium text-xs"
    >
      {language === 'en' ? 'РУС' : 'ENG'}
    </Button>
  );
};

export default LanguageSwitcher;
