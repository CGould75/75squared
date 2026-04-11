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
  const { data, error } = await supabase.from('email_subscribers').select('*');
  console.log("Error:", error);
  console.log("Data length:", data ? data.length : 0);
  console.log("Data:", data);
}
run();
