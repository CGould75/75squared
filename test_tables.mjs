import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
let url = '', key = '';
envFile.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('nexus_users').select('*').limit(1);
  console.log('Error:', error);
  console.log('Data:', data);
  
  const { data: d2, error: e2 } = await supabase.from('api_integrations').select('*').limit(1);
  console.log('API Error:', e2);
  
  const { data: d3, error: e3 } = await supabase.from('nexus_billing_plans').select('*').limit(1);
  console.log('Billing Error:', e3);
}

run();
