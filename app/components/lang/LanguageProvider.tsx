'use client';
import React from 'react';

type Dict = Record<string, string>;
type LangKey = 'pt' | 'en';

const messages: Record<LangKey, Dict> = {
  pt: {
    search: 'Buscar',
    preOpening: 'Pré-abertura',
    opportunities: 'Oportunidades',
    adminAccess: 'Acesso do administrador',
    langShort: 'PT',
    langLong: 'Português',
    talkToConsultant: 'Falar com consultor',
    yourName: 'Seu nome',
    phone: 'Telefone (DDD)',
    email: 'Email',
    housing: 'Moradia',
    investing: 'Investimento',
    notes: 'Observações',
    notesHint: 'Faça um breve relato da sua busca para direcionarmos melhor seu atendimento.',
    lgpdConsent: 'Autorizo o contato por e-mail, WhatsApp e telefone conforme LGPD.',
    cancel: 'Cancelar',
    sendByWhatsApp: 'Enviar pelo WhatsApp',
    scheduleVisit: 'Agendar visita',
    back: 'Voltar'
  },
  en: {
    search: 'Search',
    preOpening: 'Pre-opening',
    opportunities: 'Opportunities',
    adminAccess: 'Admin access',
    langShort: 'EN',
    langLong: 'English',
    talkToConsultant: 'Talk to an agent',
    yourName: 'Your name',
    phone: 'Phone',
    email: 'Email',
    housing: 'Housing',
    investing: 'Investment',
    notes: 'Notes',
    notesHint: 'Briefly describe what you are looking for so we can better assist you.',
    lgpdConsent: 'I authorize contact by email, WhatsApp and phone (LGPD/GDPR).',
    cancel: 'Cancel',
    sendByWhatsApp: 'Send via WhatsApp',
    scheduleVisit: 'Schedule a visit',
    back: 'Back'
  }
};

export type Ctx = {
  lang: LangKey;
  setLang: (v: LangKey) => void;
  t: (k: keyof typeof messages['pt']) => string;
};

const LangCtx = React.createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<LangKey>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('lang') as LangKey | null;
      if (saved === 'en' || saved === 'pt') return saved;
    }
    return 'pt';
  });

  const setLang = React.useCallback((v: LangKey) => {
    setLangState(v);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('lang', v);
      document.documentElement.lang = v === 'pt' ? 'pt-BR' : 'en';
    }
  }, []);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    }
  }, [lang]);

  const t = React.useCallback(
    (k: keyof typeof messages['pt']) => messages[lang][k] ?? k,
    [lang]
  );

  const value: Ctx = { lang, setLang, t };
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = React.useContext(LangCtx);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider/>');
  return ctx;
}
