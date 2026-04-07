import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://wnfffnliaepidcworoom.supabase.co', 'sb_publishable_tKoKQgD_xmGhch2dEd8NxA_zbkvH3JR');

async function run() {
  const { data, error } = await supabase.from('nexus_clients').select('*');
  console.log(JSON.stringify(data, null, 2));
}
run();
