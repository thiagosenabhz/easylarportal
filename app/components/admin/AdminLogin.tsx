'use client';
import { useEffect, useState } from 'react';
type Props = { open?: boolean; onClose?: () => void; };
const STATIC_CODE = '098765';
export default function AdminLogin({ open=false, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  useEffect(()=>{ function onKey(e:KeyboardEvent){ if(e.key==='Escape') onClose?.(); } if(open) window.addEventListener('keydown',onKey); return ()=>window.removeEventListener('keydown',onKey); },[open,onClose]);
  if (!open) return null;
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code === STATIC_CODE && email.includes('@')) { window.location.href = '/admin'; }
    else { setError('Código inválido ou e-mail incorreto.'); }
  }
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl p-5 shadow-xl text-black">
        <h3 className="text-lg font-semibold">Acesso do administrador</h3>
        <div className="mt-4 space-y-3">
          <input className="w-full border rounded-lg px-3 py-2" placeholder="E-mail" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <div className="relative">
            <input className="w-full border rounded-lg px-3 py-2 pr-10" placeholder="Código" type={show?'text':'password'} value={code} onChange={e=>setCode(e.target.value)} />
            <button type="button" onClick={()=>setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500">{show?'🙈':'👁️'}</button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="btn border">Cancelar</button>
            <button type="submit" className="btn btn-primary">Entrar</button>
          </div>
          <p className="text-xs text-neutral-600">Código temporário: 098765 • Pressione ESC para fechar</p>
        </div>
      </form>
    </div>
  );
}
