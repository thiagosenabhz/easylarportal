"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type DownloadState = "idle" | "loading" | "done" | "error";

export default function BackupPanel() {
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleDownload() {
    try {
      setDownloadState("loading");
      setMessage(null);

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Erro ao gerar backup:", error);
        setDownloadState("error");
        setMessage("Não foi possível gerar o backup agora.");
        return;
      }

      const payload = {
        exportedAt: new Date().toISOString(),
        count: data?.length ?? 0,
        projects: data ?? [],
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      const stamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19);

      a.href = url;
      a.download = `easylar-backup-projects-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setDownloadState("done");
      setMessage("Backup baixado com sucesso.");
    } catch (err) {
      console.error("Erro inesperado ao gerar backup:", err);
      setDownloadState("error");
      setMessage("Ocorreu um erro inesperado ao gerar o backup.");
    }
  }

  async function handleUploadChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // Por enquanto só validamos superficialmente e registramos no console.
      // Em uma etapa futura, esse conteúdo poderá ser restaurado no banco.
      // eslint-disable-next-line no-console
      console.log("Backup importado no navegador:", json);

      setMessage(
        "Backup lido no navegador (console.log). Em uma próxima etapa será restaurado no banco."
      );
    } catch (err) {
      console.error("Erro ao ler backup:", err);
      setMessage("Arquivo inválido. Verifique o JSON do backup.");
    } finally {
      // Permite escolher o mesmo arquivo novamente se quiser
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">
          Backup de empreendimentos
        </h3>
        <p className="mt-1 text-xs text-gray-600">
          Gere um arquivo JSON com todos os empreendimentos cadastrados via
          Supabase e faça o upload de um backup existente para leitura no
          navegador. Nenhum dado é sobrescrito ainda.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloadState === "loading"}
          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {downloadState === "loading"
            ? "Gerando backup..."
            : "Baixar backup (JSON)"}
        </button>

        <label className="inline-flex cursor-pointer items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          Carregar backup (JSON)
          <input
            type="file"
            accept="application/json"
            onChange={handleUploadChange}
            className="hidden"
          />
        </label>
      </div>

      {message && <p className="text-xs text-gray-700">{message}</p>}
    </div>
  );
}
