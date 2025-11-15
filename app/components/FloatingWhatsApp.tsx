"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Purpose = "moradia" | "investimento";

interface LeadFormState {
  name: string;
  phone: string;
  email: string;
  purpose: Purpose;
  notes: string;
  consent: boolean;
}

const STORAGE_KEY = "easylar-whats-contact";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<LeadFormState>({
    name: "",
    phone: "",
    email: "",
    purpose: "moradia",
    notes: "",
    consent: true,
  });

  // Esconde o botão em qualquer rota que comece com /admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Carrega nome / telefone / e-mail da última vez que o usuário preencheu
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as Partial<LeadFormState>;
      setForm((prev) => ({
        ...prev,
        name: parsed.name ?? prev.name,
        phone: parsed.phone ?? prev.phone,
        email: parsed.email ?? prev.email,
      }));
    } catch {
      // se der erro no parse, só ignoramos
    }
  }, []);

  // Salva em memória básica (localStorage) à medida que usuário digita
  useEffect(() => {
    if (typeof window === "undefined") return;

    const toSave = {
      name: form.name,
      phone: form.phone,
      email: form.email,
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // se localStorage não estiver disponível, só seguimos sem salvar
    }
  }, [form.name, form.phone, form.email]);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleChange<K extends keyof LeadFormState>(
    field: K,
    value: LeadFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.consent) {
      alert("Para prosseguir, autorize o contato conforme LGPD.");
      return;
    }

    const purposeLabel =
      form.purpose === "moradia" ? "Moradia" : "Investimento";

    const lines = [
      "Olá, vi os imóveis no portal EasyLar e quero falar com um consultor.",
      "",
      form.name ? `Nome: ${form.name}` : "",
      form.phone ? `Telefone: ${form.phone}` : "",
      form.email ? `E-mail: ${form.email}` : "",
      `Finalidade: ${purposeLabel}`,
      form.notes ? "" : "",
      form.notes ? `Observações: ${form.notes}` : "",
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));

    // ✅ Telefone do corretor / canal principal do EasyLar (DDD 31)
    const phoneNumber = "5531996090508";
    const url = `https://wa.me/${phoneNumber}?text=${text}`;

    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }

    setIsOpen(false);
  }

  return (
    <>
      {/* BOTÃO FLOANTE – estilo clássico WhatsApp (verde, redondo) */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Falar pelo WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/20 transition hover:bg-[#1ebe5d] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#25D366]"
      >
        <span className="sr-only">Falar pelo WhatsApp</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 32 32"
          className="h-7 w-7 fill-white"
        >
          <path d="M16.04 4C9.955 4 5 8.955 5 15.04c0 2.66.93 5.12 2.5 7.08L6 28l6.04-1.47A11.07 11.07 0 0 0 16.04 26C22.125 26 27.08 21.045 27.08 14.96 27.08 8.955 22.125 4 16.04 4zm0 2.08c5.02 0 9 3.98 9 8.88 0 4.99-3.98 9.04-9 9.04-1.68 0-3.27-.47-4.64-1.28l-.33-.2-3.58.87.93-3.49-.22-.36A8.54 8.54 0 0 1 7.04 15C7 10.06 11.02 6.08 16.04 6.08zm-2.2 3.36c-.24-.01-.53-.01-.82.05-.43.08-.88.4-1.01.78-.26.75-.66 2.3-.66 2.3s-.16.57.18 1.16c.34.59 1.16 1.41 1.16 1.41s1.59 1.6 3.18 2.23c1.58.63 1.9.51 2.24.48.34-.03 1.1-.45 1.26-.88.16-.43.45-1.57.45-1.57s.13-.49-.16-.78c-.29-.29-.9-.47-.9-.47l-1.09-.35s-.27-.09-.42.04-.44.54-.44.54-.17.26-.32.28c-.15.02-.39-.12-.39-.12a7.7 7.7 0 0 1-2.02-1.26 7.57 7.57 0 0 1-1.4-1.75s-.04-.15.02-.24c.06-.09.26-.3.26-.3s.11-.13.14-.22c.03-.09 0-.19 0-.19s-.27-.96-.39-1.31c-.1-.32-.32-.35-.46-.36z" />
        </svg>
      </button>

      {/* MODAL DO FORMULÁRIO */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Falar com consultor
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Seu nome*
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Telefone (DDD)*
                  </label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email*
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="purpose"
                    checked={form.purpose === "moradia"}
                    onChange={() => handleChange("purpose", "moradia")}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Moradia</span>
                </label>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="purpose"
                    checked={form.purpose === "investimento"}
                    onChange={() => handleChange("purpose", "investimento")}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Investimento</span>
                </label>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Observações
                </label>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Nos dê uma breve descrição a respeito do seu interesse."
                  className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <label className="flex items-start gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => handleChange("consent", e.target.checked)}
                  className="mt-0.5 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>
                  Autorizo o contato por e-mail, WhatsApp e telefone conforme
                  LGPD.
                </span>
              </label>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[#25D366] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1ebe5d]"
                >
                  Enviar pelo WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
