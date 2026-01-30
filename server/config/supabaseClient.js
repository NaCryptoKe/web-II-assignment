const { createClient } = require('@supabase/supabase-js');
const { setGlobalDispatcher, Agent } = require('undici');

setGlobalDispatcher(new Agent({ 
    connect: { timeout: 30_000_000_000 } 
}));

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    { auth: { persistSession: false } }
);

module.exports = supabase;