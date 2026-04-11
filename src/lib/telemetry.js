import { supabase } from './supabaseClient';

class TelemetryEngine {
  /**
   * Dispatches a frontend UI or unhandled exception directly to the Supabase sre_logs table.
   * 
   * @param {string} source Component or module where the error originated (e.g. "EmailDashboard.jsx")
   * @param {string} message Short, human-readable error summary.
   * @param {object} payload Complete error object, state variables, or stack trace for SRE context.
   * @param {string} severity "critical", "fatal", "warning" (Defaults to critical)
   */
  static async dispatchException(source, message, payload = {}, severity = 'critical') {
    try {
      const activeDomain = localStorage.getItem('nexus_tenant_domain') || '75squared.com';
      
      const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload, Object.getOwnPropertyNames(payload));

      const logRecord = {
         log_id: `ERR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
         domain: activeDomain,
         severity: severity,
         source: source,
         message: message,
         payload: payloadString,
         timestamp: new Date().toISOString(),
         status: 'queued', // Picked up by Auto-Healing SRE queue
         sre_action: 'Awaiting Autonomous SRE Assessment...'
      };

      // Suppress any errors internally so the telemetry engine doesn't accidentally crash the app
      await supabase.from('sre_logs').insert([logRecord]);
      console.warn(`[Telemetry Dispatch]: Anointed new ${severity.toUpperCase()} log for ${source}.`);
    } catch (e) {
      console.error('[Telemetry Fatal Error] Could not connect to SRE node:', e);
    }
  }
}

export default TelemetryEngine;
