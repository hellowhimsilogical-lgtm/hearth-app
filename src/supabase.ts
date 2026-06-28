import { createClient } from '@supabase/supabase-js'




const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://jbwcgnwelhszgjeherot.supabase.co'

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_em1BUFfZtTdhkfWR06DiIw_ipSGiG06'




export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)




export type Database = any // Extend this with your generated types later
