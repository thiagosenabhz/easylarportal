"use client";

import { useState } from "react";

type FormState = {
  name: string;
  slug: string;
  city: string;
  neighborhood: string;
  launchDate: string;
  deliveryDate: string;
  priceFrom: string;
};

const initialState: FormState = {
  name: "",
  slug: "",
  city: "Belo Horizonte - MG",
  neighborhood: "",
  launchDate: "",
  deliveryDate: "",
  priceFrom: "0",
};

export default function NewProjectForm() {
  const [form, setForm] = useState<FormState>(initialState);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Novo empreendimento (rascunho):", form);
    alert("Rascunho de empreendimento salvo localmente (console.log).");
  };

  return (
    <section className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="mb-1 text-lg font-semibold text-gray-900">
        Novo empreendimento
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        Este formulário gera um rascunho interno do empreendimento. Em uma
        próxima etapa será integrado ao banco de dados (Supabase).
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Nome do empreendimento
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex: Azul e Verde"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Slug (URL)
            </label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="ex: azul-e-verde"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Cidade
            </label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Bairro
            </label>
            <input
              name="neighborhood"
              value={form.neighborhood}
              onChange={handleChange}
              placeholder="Ex: Pampulha"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Data de abertura de vendas (mês/ano)
            </label>
            <input
              type="month"
              name="launchDate"
              value={form.launchDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Previsão de entrega (mês/ano)
            </label>
            <input
              type="month"
              name="deliveryDate"
              value={form.deliveryDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-1 md:w-1/2">
          <label className="text-sm font-medium text-gray-700">
            Preço a partir de (R$)
          </label>
          <input
            name="priceFrom"
            value={form.priceFrom}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Salvar rascunho
          </button>
        </div>
      </form>
    </section>
  );
}
