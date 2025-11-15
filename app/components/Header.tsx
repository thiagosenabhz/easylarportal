"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  const isHome = pathname === "/";
  const isLaunchView = isHome && view === "launch";
  const isStockView = isHome && view === "stock";

  return (
    <header className="bg-blue-700 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            EasyLar
          </Link>
        </div>

        <nav className="flex items-center gap-4 text-sm">
          {/* REMOVIDO: "Buscar" */}

          <Link
            href="/?view=launch"
            className={`rounded-full px-3 py-1 ${
              isLaunchView
                ? "bg-white text-blue-700 font-semibold"
                : "hover:bg-blue-600"
            }`}
          >
            Pré-abertura
          </Link>

          <Link
            href="/?view=stock"
            className={`rounded-full px-3 py-1 ${
              isStockView
                ? "bg-white text-blue-700 font-semibold"
                : "hover:bg-blue-600"
            }`}
          >
            Oportunidades
          </Link>

          <Link
            href="/admin"
            className="rounded-md bg-blue-600 px-3 py-1 font-semibold hover:bg-blue-500"
          >
            Acesso do administrador
          </Link>

          {/* Botão PT/EN mantido, sem alterar a lógica atual de tradução global.
             Patch dedicado de multilíngue virá depois. */}
          <Link
            href={pathname === "/" ? "/?lang=en" : `${pathname}?lang=en`}
            className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-gray-100"
          >
            EN
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
