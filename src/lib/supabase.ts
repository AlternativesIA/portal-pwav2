import { createClient } from '@supabase/supabase-js';

// URL et clé Supabase depuis les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Configuration du client Supabase avec options explicites pour l'authentification
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage,
    storageKey: 'botnb-auth-token',
    detectSessionInUrl: true,
    flowType: 'implicit'
  },
  global: {
    headers: {
      'X-Client-Info': 'BotnB Tempo'
    }
  }
});

// Fonction utilitaire pour vérifier la configuration de Supabase
export const checkSupabaseConfig = () => {
  return {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isConfigured: !!supabaseUrl && !!supabaseAnonKey
  };
};