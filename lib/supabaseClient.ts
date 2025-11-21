// lib/supabaseClient.ts

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.https://zepngrslqqdtmvsraawg.supabase.co;
const supabaseAnonKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplcG5ncnNscXFkdG12c3JhYXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMTU1NzEsImV4cCI6MjA3NTU5MTU3MX0.3lWBnHhYxAMqyPv_liMSyWKPXXKZh3gop4jQJjGHKrM;

// Criamos um client único, reutilizado em toda a aplicação.
let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não estão configuradas."
    );
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  return supabaseClient;
}
