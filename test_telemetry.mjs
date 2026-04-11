import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inject() {
   const res = await supabase.from('sre_logs').insert([{
      log_id: 'ERR-SIMULATION',
      domain: '75squared.com',
      severity: 'fatal',
      source: 'ActionCenter.jsx Test',
      message: 'Node.js artificial telemetry injection',
      payload: '{}',
      timestamp: new Date().toISOString(),
      status: 'queued',
      sre_action: 'Awaiting Autonomous SRE Assessment...'
   }]);
   console.log(res);
}

inject();
