'use client';
import React from 'react';
import { useLang } from '@/app/components/lang/LanguageProvider';

export default function LeadModal({
  open,
  onClose,
  defaultMessage
}: {
  open: boolean;
  onClose: () => void;
  defaultMessage?: string;
}) {
  const { t } = useLang();
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [type, setType] = React.useState<'moradia' | 'investimento'>('moradia');
  const [notes, setNotes] = React.useState('');
  const [consent, setConsent] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const canSend = name && phone && email && consent;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    const msg = defaultMessage
      ? defaultMessage
      : `Olá, tenho interesse. Tipo: ${type}. ${notes ? `Obs: ${notes}` : ''}`;
    const url = `https://wa.me/5531999999999?text=${encodeURIComponent(msg + `\nNome: ${name}\nTel: ${phone}\nEmail: ${email}`)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] p-4" role="dialog" aria-modal>
      <form onSubmit={onSubmit} className="bg-white w-full max-w-2xl rounded-2xl p-6 space-y-4">
        <div className="text-2xl font-semibold">{t('talkToConsultant')}</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            autoComplete="name"
            required
            value={name}
            onChange={e=>setName(e.target.value)}
            placeholder={`${t('yourName')}*`}
            className="border rounded-lg px-3 py-2"
          />
          <input
            autoComplete="tel"
            required
            value={phone}
            onChange={e=>setPhone(e.target.value)}
            placeholder={`${t('phone')}*`}
            className="border rounded-lg px-3 py-2"
          />
        </div>

        <input
          autoComplete="email"
          required
          value={email}
          onChange={e=>setEmail(e.target.value)}
          placeholder={`${t('email')}*`}
          className="border rounded-lg px-3 py-2 w-full"
        />

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="tipo" checked={type=='moradia'} onChange={()=>setType('moradia')} />
            <span>{t('housing')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="tipo" checked={type=='investimento'} onChange={()=>setType('investimento')} />
            <span>{t('investing')}</span>
          </label>
        </div>

        <textarea
          value={notes}
          onChange={e=>setNotes(e.target.value)}
          placeholder={`${t('notes')} — ${t('notesHint')}`}
          className="border rounded-lg px-3 py-2 w-full h-28"
        />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} />
          <span>{t('lgpdConsent')}</span>
        </label>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={!canSend}
            className={`px-4 py-2 rounded-lg text-white ${canSend ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {t('sendByWhatsApp')}
          </button>
        </div>
      </form>
    </div>
  );
}
