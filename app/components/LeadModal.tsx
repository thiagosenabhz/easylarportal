'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LeadModal({ open, onClose }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    // focus management
    ref.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
  }, []);

  // preenchimento automático simples via localStorage
  useEffect(() => {
    const name = localStorage.getItem('lead:name') ?? '';
    const phone = localStorage.getItem('lead:phone') ?? '';
    const email = localStorage.getItem('lead:email') ?? '';
    const nameEl = document.querySelector<HTMLInputElement>('input[name="name"]');
    const phoneEl = document.querySelector<HTMLInputElement>('input[name="phone"]');
    const emailEl = document.querySelector<HTMLInputElement>('input[name="email"]');
    if (nameEl) nameEl.value = name;
    if (phoneEl) phoneEl.value = phone;
    if (emailEl) emailEl.value = email;
  }, []);

  if (!open) return null;

  return createPortal(
    <div
      aria-modal
      role="dialog"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        ref={ref}
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Falar com consultor</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-md p-2 hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();

            const form = e.currentTarget as HTMLFormElement;
            const fd = new FormData(form);
            const name = String(fd.get('name') || '');
            const phone = String(fd.get('phone') || '');
            const email = String(fd.get('email') || '');
            const tipo = String(fd.get('tipo') || 'Moradia');
            const obs = String(fd.get('obs') || '');
            const consent = fd.get('lgpd') === 'on';

            if (!name || !phone || !consent) return;

            // persistência local para auto completar da próxima vez
            localStorage.setItem('lead:name', name);
            localStorage.setItem('lead:phone', phone);
            localStorage.setItem('lead:email', email);

            // mensagem contextual
            const context = document?.title || 'EasyLar';
            const msg =
              `Olá, estou no portal EasyLar (${context}) e gostaria de falar com um consultor.\n` +
              `Nome: ${name}\n` +
              `Telefone: ${phone}\n` +
              (email ? `Email: ${email}\n` : '') +
              `Finalidade: ${tipo}\n` +
              (obs ? `Observações: ${obs}\n` : '');

            const url = `https://wa.me/55?text=${encodeURIComponent(msg)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
            onClose();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="name"
              autoComplete="name"
              required
              placeholder="Seu nome*"
              className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              name="phone"
              autoComplete="tel"
              required
              placeholder="Telefone (DDD)*"
              className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <input
            name="email"
            autoComplete="email"
            placeholder="Email*"
            className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-blue-300"
            required
          />

          <div className="flex gap-6">
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="tipo" value="Moradia" defaultChecked />
              <span>Moradia</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="tipo" value="Investimento" />
              <span>Investimento</span>
            </label>
          </div>

          <div>
            <textarea
              name="obs"
              rows={4}
              placeholder="Faça um breve relato da sua busca para direcionarmos seu atendimento (ex.: bairro desejado, nº de quartos, vagas, área privativa/cobertura, faixa de preço)."
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <label className="mt-1 flex items-center gap-2 text-sm">
            <input type="checkbox" name="lgpd" required />
            <span>Autorizo o contato por e-mail, WhatsApp e telefone conforme LGPD.</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl bg-gray-100 px-5 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-11 rounded-xl bg-emerald-500 px-5 font-medium text-white hover:bg-emerald-600"
            >
              Enviar pelo WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
