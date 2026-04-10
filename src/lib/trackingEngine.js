import { supabase } from './supabaseClient';

class PerformanceTrackingEngine {
  constructor() {
    this.buffer = [];
    this.active = false;
    this.domain = window.location.hostname;
    this.sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
    
    // Limits
    this.MAX_BUFFER_SIZE = 50; // Upload to Supabase every 50 events
    this.THROTTLE_MS = 100; // Track mouse moves max once every 100ms
    this.lastTrackTime = 0;
  }

  start(targetDomainOverride = null) {
    if (this.active) return;
    this.active = true;
    
    if (targetDomainOverride) {
       this.domain = targetDomainOverride;
    }

    console.log(`[75² Nexus Tracker] Engaged for domain: ${this.domain}. Session: ${this.sessionId}`);

    // Universal Mouse Follower
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    
    // Universal Click Sniffer
    window.addEventListener('click', this.handleClick.bind(this));
    
    // Periodic Flush Insurance
    this.flushInterval = setInterval(() => this.flush(), 5000);
  }

  stop() {
    this.active = false;
    window.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    window.removeEventListener('click', this.handleClick.bind(this));
    clearInterval(this.flushInterval);
    this.flush();
    console.log('[75² Nexus Tracker] Disengaged.');
  }

  handleMouseMove(e) {
    if (!this.active) return;
    const now = Date.now();
    if (now - this.lastTrackTime < this.THROTTLE_MS) return;
    
    this.lastTrackTime = now;
    this.pushEvent('move', e.clientX, e.clientY);
  }

  handleClick(e) {
    if (!this.active) return;
    this.pushEvent('click', e.clientX, e.clientY);
  }

  pushEvent(type, x, y) {
    this.buffer.push({
      domain: this.domain,
      session_id: this.sessionId,
      event_type: type,
      x_coord: x,
      y_coord: y,
      viewport_width: window.innerWidth
    });

    if (this.buffer.length >= this.MAX_BUFFER_SIZE) {
      this.flush();
    }
  }

  async flush() {
    if (this.buffer.length === 0) return;
    
    // Clone and clear
    const payload = [...this.buffer];
    this.buffer = [];

    // Quietly dump into Supabase
    try {
      const { error } = await supabase.from('tracking_events').insert(payload);
      if (error) {
         console.warn("[75² Nexus Tracker] Drop failure:", error);
      }
    } catch (err) {
       // Fail silently to prevent console spam
    }
  }
}

// Export singleton instance
const Tracker = new PerformanceTrackingEngine();
export default Tracker;
