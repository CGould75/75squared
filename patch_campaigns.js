const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://wnfffnliaepidcworoom.supabase.co',
  'sb_publishable_tKoKQgD_xmGhch2dEd8NxA_zbkvH3JR'
);

async function patch() {
  const { data, error } = await supabase.from('email_campaigns').select('*');
  if (error) {
    console.error(error);
    return;
  }
  
  for (const camp of data) {
    if (camp.body_content && camp.body_content.includes('Take Action Now')) {
      const newBody = camp.body_content.replace(/Take Action Now/g, 'Click Here');
      const { error: updateErr } = await supabase.from('email_campaigns').update({ body_content: newBody }).eq('id', camp.id);
      if (updateErr) {
        console.error('Failed to update', camp.id, updateErr);
      } else {
        console.log('Updated campaign', camp.id);
      }
    }
  }
  console.log('Done!');
}

patch();
