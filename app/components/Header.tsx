"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const Header: React.FC = () => {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="bg-blue-700 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            EasyLar
          </Link>
        </div>

        <nav className="flex items-center gap-4 text-sm">
          {/* "Buscar" removido conforme especificação.
              Pré-abertura e Oportunidades continuam apontando para a home com query. */}

          <Link
            href="/?view=launch"
            className="rounded-full px-3 py-1 hover:bg-blue-600"
          >
            Pré-abertura
          </Link>

          <Link
            href="/?view=stock"
            className="rounded-full px-3 py-1 hover:bg-blue-600"
          >
            Oportunidades
          </Link>

          <Link
            href="/admin"
            className={`rounded-md px-3 py-1 font-semibold ${
              isAdmin
                ? "bg-white text-blue-700"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            Acesso do administrador
          </Link>

          {/* Botão PT/EN mantido, lógica de tradução continua a mesma. */}
          <Link
            href={isHome ? "/?lang=en" : `${pathname}?lang=en`}
            className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-gray-100"
          >
            EN
          </Link>
        </nav>
      </div>
    </header>
  );
};
