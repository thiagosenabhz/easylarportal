"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";

type NewProjectForm = {
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

export default function AdminNewProjectClient() {
  const [form, setForm] = useState<NewProjectForm>({
    name: "",
    slug: "",
    city: "Belo Horizonte - MG",
    neighborhood: "",
    openingDate: "",
    deliveryDate: "",
    priceFrom: "0",
  });

  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!slugTouched) {
      setForm((prev) => ({
        ...prev,
        slug: slugify(prev.name),
      }));
    }
  }, [form.name, slugTouched]);

  function handleChange(
    field: keyof NewProjectForm
  ): (event: ChangeEvent<HTMLInputElement>) => void {
    return (event) => {
      const value = event.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  }

  function handleSlugChange(event: ChangeEvent<HTMLInputElement>) {
    setSlugTouched(true);
    const value = event.target.value;
    setForm((prev) => ({
      ...prev,
      slug: slugify(value),
    }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    console.log("Rascunho de empreendimento:", form);
    alert(
      "Rascunho salvo (apenas local por enquanto). Na próxima etapa vamos integrar com o Supabase."
    );
  }

  function handleReset() {
    setForm({
      name: "",
      slug: "",
      city: "Belo Horizonte - MG",
      neighborhood: "",
      openingDate: "",
      deliveryDate: "",
      priceFrom: "0",
    });
    setSlugTouched(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-6 max-w-6xl rounded-2xl bg-white p-6 shadow-sm"
    >
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Novo empreendimento
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Este formulário gera um rascunho interno do empreendimento. Em uma
          próxima etapa será integrado ao banco de dados (Supabase).
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Nome do empreendimento
          </label>
          <input
            type="text"
            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none ring-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Ex: Azul e Verde"
            value={form.name}
            onChange={handleChange("name")}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Slug (URL)
          </label>
          <input
            type="text"
            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none ring-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="ex: azul-e-verde"
            value={form.slug}
            onChange={handleSlugChange}
          />
          <p className="text-[11px] text-slate-500">
            Usado na URL pública do empreendimento. Pode ser ajustado
            manualmente se necessário.
          </p>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Cidade
          </label>
          <input
            type="text"
            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none ring-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={form.city}
            onChange={handleChange("city")}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Bairro
          </label>
          <input
            type="text"
            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none ring-0 focus:border-blue-500 focus:ring-blue-100"
            placeholder="Ex: Pampulha"
            value={form.neighborhood}
            onChange={handleChange("neighborhood")}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Data de abertura de vendas (mês/ano)
          </label>
          <input
            type="month"
            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none ring-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={form.openingDate}
            onChange={handleChange("openingDate")}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Previsão de entrega (mês/ano)
          </label>
          <input
            type="month"
            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none ring-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={form.deliveryDate}
            onChange={handleChange("deliveryDate")}
          />
        </div>

        <div className="space-y-1 md:col-span-2 md:max-w-xs">
          <label className="block text-xs font-medium text-slate-700">
            Preço a partir de (R$)
          </label>
          <input
            type="number"
            min={0}
            step={1000}
            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none ring-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={form.priceFrom}
            onChange={handleChange("priceFrom")}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Limpar
        </button>
        <button
          type="submit"
          className="h-10 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Salvar rascunho
        </button>
      </div>
    </form>
  );
}
