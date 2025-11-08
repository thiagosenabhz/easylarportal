'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { useLang } from '@/app/components/lang/LanguageProvider';

const AdminLogin = dynamic(() => import('@/app/components/admin/AdminLogin'), { ssr: false, loading: () => null });

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [openAdmin, setOpenAdmin] = React.useState(false);

  return (
    <header className="bg-brandBlue text-white sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4 justify-between">
        <a href="/" className="font-semibold text-2xl">EasyLar</a>

        <nav className="hidden md:flex items-center gap-6">
          <a href="/search" className="hover:underline">{t('search')}</a>
          <a href="/#pre" className="hover:underline">{t('preOpening')}</a>
          <a href="/#opps" className="hover:underline">{t('opportunities')}</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenAdmin(true)}
            className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg"
            aria-label={t('adminAccess')}
          >
            {t('adminAccess')}
          </button>

          <button
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="bg-white text-brandBlue font-semibold px-3 py-1.5 rounded-lg w-12 text-center"
            aria-label={lang === 'pt' ? 'Switch to English' : 'Mudar para Português'}
          >
            {lang === 'pt' ? 'PT' : 'EN'}
          </button>
        </div>
      </div>
      {openAdmin && <AdminLogin open={openAdmin} onClose={() => setOpenAdmin(false)} />}
    </header>
  );
}
