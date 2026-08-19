// =====================================================
// HOTEL NEVADA — SUPABASE
// Backend demonstrativo
// =====================================================

const SUPABASE_URL =
    "https://xrqudrpocqhkhinjjcap.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_C-eRXQWeywP6H0fGy5MePw_i-PvxVQj";


const nevadaSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );