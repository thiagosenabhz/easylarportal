import './globals.css';
import type { ReactNode } from 'react';
import Header from '@/app/components/Header';
import FloatingWhatsApp from '@/app/components/FloatingWhatsApp';

export const metadata = {
  title: 'EasyLar - Portal de Empreendimentos',
  description: 'Encontre seu próximo apartamento com facilidade.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
