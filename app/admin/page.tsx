"use client";

import { useState } from "react";

type NewProjectFormProps = any;

/**
 * Formulário simplificado de "Novo Empreendimento".
 * Este componente existe principalmente para satisfazer o import
 * `./NewProjectForm` em app/admin/page.tsx e evitar erro de build no Vercel.
 *
 * Você pode evoluir este formulário depois, mas ele já mantém o layout básico
 * e chama callbacks recebidos via props (onCancel / onSave) se existirem.
 */
export default function NewProjectForm(props: NewProjectFormProps) {
  const { onCancel, onSave, initialValues } = props;

  const [name, setName] = useState(initialValues?.name ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [city, setCity] = useState(initialValues?.city ?? "Belo Horizonte - MG");
  const [neighborhood, setNeighborhood] = useState(initialValues?.neighborhood ?? "");
  const [openingDate, setOpeningDate] = useState(initialValues?.openingDate ?? "");
  const [deliveryDate, setDeliveryDate] = useState(initialValues?.deliveryDate ?? "");
  const [priceFrom, setPriceFrom] = useState(initialValues?.priceFrom ?? 0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (onSave) {
      onSave({
        name,
        slug,
        city,
        neighborhood,
        openingDate,
        deliveryDate,
        priceFrom,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-900">
        Novo empreendimento
      </h2>

      <p className="text-sm text-gray-500">
        Este formulário gera um rascunho interno do empreendimento. Em uma
        próxima etapa será integrado ao banco de dados (Supabase).
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Nome do empreendimento
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Ex.: Azul e Verde"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Slug (URL)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="ex.: azul-e-verde"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Cidade</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Bairro</label>
          <input
            type="text"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Data de abertura de vendas (mês/ano)
          </label>
          <input
            type="month"
            value={openingDate}
            onChange={(e) => setOpeningDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Previsão de entrega (mês/ano)
          </label>
          <input
            type="month"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Preço a partir de (R$)
          </label>
          <input
            type="number"
            min={0}
            step="1000"
            value={priceFrom}
            onChange={(e) => setPriceFrom(Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Salvar rascunho
        </button>
      </div>
    </form>
  );
}
