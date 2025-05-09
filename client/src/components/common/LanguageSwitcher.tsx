import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Define language options with display names and country codes for flags
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' }
];

export const LanguageSwitcher: React.FC<{ variant?: 'default' | 'outline' | 'ghost' }> = ({ 
  variant = 'outline' 
}) => {
  const { i18n, t } = useTranslation();
  const { toast } = useToast();
  const [isChanging, setIsChanging] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = async (langCode: string) => {
    if (langCode === i18n.language) return;
    
    setIsChanging(true);
    
    try {
      await i18n.changeLanguage(langCode);
      localStorage.setItem('fixpoint_language', langCode);
      
      const newLang = languages.find(lang => lang.code === langCode);
      
      toast({
        title: t('common.success'),
        description: `${t('language.currentLanguage')}: ${newLang?.name}`,
      });
    } catch (error) {
      console.error('Error changing language:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to change language. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline-flex">{currentLanguage.flag} {currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            disabled={isChanging}
            onClick={() => changeLanguage(lang.code)}
            className={lang.code === i18n.language ? 'bg-muted' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;