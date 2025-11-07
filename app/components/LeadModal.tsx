'use client';
import { useState, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLang } from '@/app/components/lang/LanguageProvider';

type Props = { open?: boolean; onClose?: () => void; phoneNumber?: string; };

export default function LeadModal({ open=false, onClose, phoneNumber='5531996090508' }: Props) {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState<'moradia'|'investimento'|''>('');
  const [lgpd, setLgpd] = useState(false);
  const [obs, setObs] = useState('');
  const pathname = usePathname() || '';
  const params = useSearchParams();

  if (!open) return null;

  const slug = pathname.startsWith('/imovel/') ? pathname.split('/').pop() : undefined;
  const tipologia = params?.get('tipologia') || '';

  const context = useMemo(()=>{
    if (slug && tipologia) return `Estou no portal EasyLar e tenho interesse em apartamento de ${tipologia} quartos no empreendimento ${slug}.`;
    if (slug) return `Estou no portal EasyLar e tenho interesse no empreendimento ${slug}.`;
    return 'Estou no portal EasyLar.';
  }, [slug, tipologia]);

  const message =
`${context} Gostaria de agendar uma visita para conhecer mais a respeito.
Finalidade: ${purpose || '(informar)'}
Nome: ${name}
Telefone: ${phone}
Email: ${email}
Observações: ${obs || '-'}`;

  const valid = name.trim() && phone.trim() && email.trim() && lgpd;
  const waHref = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  function trySend(){ if(!valid) return; window.open(waHref,'_blank'); }
  function onKey(e: React.KeyboardEvent){ if(e.key==='Escape') onClose?.(); }

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4" onKeyDown={onKey}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">{t('talkToConsultant')}</h3>
          <button onClick={onClose} aria-label="Fechar" className="text-neutral-500 hover:text-black">✕</button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={name} onChange={e=>setName(e.target.value)} className="border rounded-lg px-3 py-2" placeholder="Seu nome*" />
          <input value={phone} onChange={e=>setPhone(e.target.value)} className="border rounded-lg px-3 py-2" placeholder="Telefone (DDD)*" />
          <input value={email} onChange={e=>setEmail(e.target.value)} className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Email*" type="email" />
          <div className="md:col-span-2 flex gap-4 items-center text-sm">
            <label className="flex items-center gap-2"><input type="radio" name="purpose" checked={purpose==='moradia'} onChange={()=>setPurpose('moradia')} /> Moradia</label>
            <label className="flex items-center gap-2"><input type="radio" name="purpose" checked={purpose==='investimento'} onChange={()=>setPurpose('investimento')} /> Investimento</label>
          </div>
          <textarea value={obs} onChange={e=>setObs(e.target.value)} className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Observações"></textarea>
          <label className="md:col-span-2 text-xs flex items-start gap-2 text-neutral-600">
            <input type="checkbox" checked={lgpd} onChange={e=>setLgpd(e.target.checked)} />
            Autorizo o contato por e-mail, WhatsApp e telefone conforme LGPD.
          </label>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="btn border">Cancelar</button>
          <button onClick={trySend} className={`btn btn-primary ${!valid && 'opacity-50 pointer-events-none'}`}>Enviar pelo WhatsApp</button>
        </div>
      </div>
    </div>
  );
}
