'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState<'en' | 'vi'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved language from localStorage
    const saved = localStorage.getItem('language') as 'en' | 'vi' | null;
    if (saved) {
      setLanguage(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const handleLanguageChange = (lang: 'en' | 'vi') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    // Trigger page refresh to apply translations
    window.location.reload();
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <Button
        onClick={() => handleLanguageChange('en')}
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        className="px-3"
      >
        EN
      </Button>
      <Button
        onClick={() => handleLanguageChange('vi')}
        variant={language === 'vi' ? 'default' : 'outline'}
        size="sm"
        className="px-3"
      >
        VI
      </Button>
    </div>
  );
}
