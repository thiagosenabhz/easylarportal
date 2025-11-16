"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  return (
    <>
      <header className="bg-blue-600 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
          {/* Marca + botão Início padronizado */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold tracking-tight">
              EasyLar
            </span>

            <Link
              href="/"
              className={classNames(
                "hidden rounded-full px-4 py-1.5 text-xs font-medium shadow-sm transition",
                "bg-white text-blue-600 hover:bg-blue-50",
                "sm:inline-flex"
              )}
            >
              Início
            </Link>
          </div>

          {/* Navegação principal */}
          <nav className="flex items-center gap-3 text-xs font-medium">
            <Link
              href="/?view=launch"
              className="hidden text-blue-100 hover:text-white sm:inline-block"
            >
              Pré-abertura
            </Link>

            <Link
              href="/?view=stock"
              className="hidden text-blue-100 hover:text-white sm:inline-block"
            >
              Oportunidades
            </Link>

            {/* Botão Acesso do administrador PADRONIZADO com Início */}
            <button
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              className={classNames(
                "rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm transition",
                "bg-white text-blue-600 hover:bg-blue-50"
              )}
            >
              Acesso do administrador
            </button>

            {/* Botão EN (PT/ENG) preservado */}
            <button
              type="button"
              className="rounded-full border border-blue-200 px-3 py-1 text-[11px] font-semibold text-blue-50 hover:bg-blue-500/40"
            >
              EN
            </button>
          </nav>
        </div>
      </header>

      {isAdminModalOpen && (
        <AdminAccessModal onClose={() => setIsAdminModalOpen(false)} />
      )}
    </>
  );
}

type AdminAccessModalProps = {
  onClose: () => void;
};

function AdminAccessModal({ onClose }: AdminAccessModalProps) {
  const router = useRouter();

  const handleConfirm = () => {
    onClose();
    router.push("/admin");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-base font-semibold text-gray-900">
          Acesso ao painel do administrador
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Área reservada para uso interno. Confirme abaixo para acessar o painel
          do administrador.
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Entrar no painel
          </button>
        </div>
      </div>
    </div>
  );
}
