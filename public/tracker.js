(function() {
  /**
   * 75 Squared Nexus Tracking Engine
   * Minified version to be embedded on client websites.
   */
  const SUPABASE_URL = 'https://wnfffnliaepidcworoom.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_tKoKQgD_xmGhch2dEd8NxA_zbkvH3JR';
  
  // Scrape the Project ID automatically from the <script> tag URL parameters
  const scripts = document.getElementsByTagName('script');
  let projectId = null;
  for(let i = 0; i < scripts.length; i++) {
    if(scripts[i].src && scripts[i].src.includes('tracker.js?id=')) {
      const urlParams = new URL(scripts[i].src).searchParams;
      projectId = urlParams.get('id');
      break;
    }
  }

  // Fallback for local testing if running on localhost directly
  if (!projectId && window.location.hostname === 'localhost') {
     projectId = '00000000-0000-0000-0000-000000000000'; // Default test UUID
  } else if (!projectId) {
    console.warn('Nexus Tracker: Missing Project ID. Tracking disabled.');
    return;
  }

  const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
  const endpoint = `${SUPABASE_URL}/rest/v1/tracking_events`;
  let eventBatch = [];
  
  // The bulk transmission engine
  const flushBatch = () => {
    if (eventBatch.length === 0) return;
    
    const dataToSend = [...eventBatch];
    eventBatch = [];
    
    // We use keepalive: true so data transmits even if the user instantly closes the tab
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(dataToSend),
      keepalive: true
    }).catch(console.error);
  };

  const queueEvent = (type, x, y) => {
    eventBatch.push({
      project_id: projectId,
      domain: window.location.hostname,
      session_id: sessionId,
      url_path: window.location.pathname,
      event_type: type,
      x_coord: Math.round(x),
      y_coord: Math.round(y),
      viewport_width: window.innerWidth
    });

    // Automatically batch and flush every 20 events to preserve client performance
    if (eventBatch.length >= 20) {
      flushBatch();
    }
  };

  // Throttle mouse moves to 100ms. If we tracked every pixel, we'd crash their browser and our DB!
  let lastMove = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastMove > 100) {
      queueEvent('move', e.pageX, e.pageY);
      lastMove = now;
    }
  });

  window.addEventListener('click', (e) => {
    queueEvent('click', e.pageX, e.pageY);
    flushBatch(); // Always flush immediately on clicks for perfect accuracy
  });

  window.addEventListener('beforeunload', () => {
    flushBatch();
  });

  console.log(`Nexus Tracker active. Monitoring Project ID: ${projectId}`);
})();
