'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Lang = 'pt-BR' | 'en-US';
type Ctx = { lang: Lang; toggle: () => void };

const C = createContext<Ctx>({ lang: 'pt-BR', toggle: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'pt-BR');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  return <C.Provider value={{ lang, toggle: () => setLang((l) => (l === 'pt-BR' ? 'en-US' : 'pt-BR')) }}>{children}</C.Provider>;
}

export function useLang() {
  return useContext(C);
}
