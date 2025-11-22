"use client";

import { FormEvent, useState } from "react";

type DraftProject = {
  name: string;
  slug: string;
  city: string;
  neighborhood: string;
  openingDate: string;
  deliveryDate: string;
  priceFrom: string;
};

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewProjectForm() {
  const [form, setForm] = useState<DraftProject>({
    name: "",
    slug: "",
    city: "Belo Horizonte - MG",
    neighborhood: "",
    openingDate: "",
    deliveryDate: "",
    priceFrom: "0",
  });

  const [slugTouched, setSlugTouched] = useState(false);

  function handleNameChange(value: string) {
    setForm((prev) => {
      const next: DraftProject = { ...prev, name: value };
      if (!slugTouched) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setForm((prev) => ({
      ...prev,
      slug: value.replace(/\s+/g, "-").toLowerCase(),
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const payload: DraftProject = {
      ...form,
      slug: form.slug || slugify(form.name),
    };

    // Por enquanto só registramos o rascunho no console.
    // Em uma próxima etapa isso será enviado para o Supabase.
    // eslint-disable-next-line no-console
    console.log("Rascunho de empreendimento:", payload);

    alert("Rascunho de empreendimento salvo localmente (console.log).");
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        Novo empreendimento
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Este formulário gera um rascunho interno do empreendimento. Em uma
        próxima etapa será integrado ao banco de dados (Supabase).
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Nome do empreendimento
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: Azul e Verde"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Slug (URL)
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="ex: azul-e-verde"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">
              O slug é usado na URL do empreendimento. Ele é preenchido
              automaticamente a partir do nome, mas você pode ajustar se
              precisar.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Cidade</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, city: e.target.value }))
              }
              placeholder="Belo Horizonte - MG"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Bairro</label>
            <input
              type="text"
              value={form.neighborhood}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, neighborhood: e.target.value }))
              }
              placeholder="Ex: Luxemburgo"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Data de abertura de vendas (mês/ano)
            </label>
            <input
              type="text"
              value={form.openingDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, openingDate: e.target.value }))
              }
              placeholder="Ex: março de 2025"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Previsão de entrega (mês/ano)
            </label>
            <input
              type="text"
              value={form.deliveryDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, deliveryDate: e.target.value }))
              }
              placeholder="Ex: dezembro de 2028"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Preço a partir de (R$)
            </label>
            <input
              type="number"
              min={0}
              value={form.priceFrom}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, priceFrom: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Salvar rascunho
          </button>
        </div>
      </form>
    </section>
  );
}
