import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lê as variáveis públicas do Next (definidas no Vercel ou no .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variáveis de ambiente do Supabase não configuradas. " +
      "Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

// Client único e reutilizável na aplicação
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);
