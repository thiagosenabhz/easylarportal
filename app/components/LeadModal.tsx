'use client';
import { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type Props = { open?: boolean; onClose?: () => void; phoneNumber?: string; };

export default function LeadModal({ open=false, onClose, phoneNumber='5531996090508' }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const pathname = usePathname();
  const params = useSearchParams();
  if (!open) return null;

  const slug = pathname?.startsWith('/imovel/') ? pathname.split('/').pop() : undefined;
  const tipologia = params?.get('tipologia') || '';

  let context = 'Estou no portal EasyLar.';
  if (slug && tipologia) context = `Estou no portal EasyLar e tenho interesse em apartamento de ${tipologia} quartos no empreendimento ${slug}.`;
  else if (slug) context = `Estou no portal EasyLar e tenho interesse no empreendimento ${slug}.`;

  const message = `${context} Gostaria de agendar uma visita para conhecer mais a respeito.` +
    `\nNome: ${name || '(informar)'}\nTelefone: ${phone || '(informar)'}\nEmail: ${email || '(opcional)'}`;

  const waHref = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">Falar com consultor</h3>
          <button onClick={onClose} aria-label="Fechar" className="text-neutral-500 hover:text-black">✕</button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={name} onChange={e=>setName(e.target.value)} className="border rounded-lg px-3 py-2" placeholder="Seu nome*" />
          <input value={phone} onChange={e=>setPhone(e.target.value)} className="border rounded-lg px-3 py-2" placeholder="Telefone (DDD)*" />
          <input value={email} onChange={e=>setEmail(e.target.value)} className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Email (opcional)" type="email" />
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="btn border">Cancelar</button>
          <a href={waHref} target="_blank" className="btn btn-primary">Enviar pelo WhatsApp</a>
        </div>
        <p className="mt-2 text-xs text-neutral-500">Ao enviar, abriremos o WhatsApp com sua mensagem preenchida.</p>
      </div>
    </div>
  );
}
