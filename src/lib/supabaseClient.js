import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://ybnmpvfqmhykavguowfg.supabase.co";

const supabaseAnonKey =
  "sb_publishable_oZT1fpNfc6SPYS48NaKvRA_ZCMjaxbu";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);