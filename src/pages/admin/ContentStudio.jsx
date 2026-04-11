import React, { useState, useEffect, useContext, useRef } from 'react';
import { PenTool, CheckCircle, Target, Type, Image as ImageIcon, Link as LinkIcon, Sparkles, Terminal, Globe, Code2, Network, Bot, ChevronRight, Activity, Cpu, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { GlobalDomainContext } from '../../layouts/AdminLayout';
import { useNavigate } from 'react-router-dom';
import TelemetryEngine from '../../lib/telemetry';
import { supabase } from '../../lib/supabaseClient';

const MOCK_TARGETS = [
  { word: "library automation", target: 12, essential: true, score: 0.98 },
  { word: "circulation software", target: 8, essential: true, score: 0.92 },
  { word: "opac integration", target: 5, essential: false, score: 0.85 },
  { word: "k-12 districts", target: 6, essential: true, score: 0.88 },
  { word: "data migration", target: 4, essential: false, score: 0.74 }
];

const ContentStudio = () => {
  const { activeDomain } = useContext(GlobalDomainContext);
  const navigate = useNavigate();
  
  const [content, setContent] = useState('');
  const [apiLimitsReached, setApiLimitsReached] = useState(false);
  const [score, setScore] = useState(12);
  const [keywords, setKeywords] = useState([]);
  
  // Hive Mind Core States
  const [viewMode, setViewMode] = useState('creative'); // 'creative' | 'technical'
  const [pipelineState, setPipelineState] = useState('idle'); // 'idle' | 'scraping' | 'calculating' | 'drafting' | 'complete'
  const [pipelineLogs, setPipelineLogs] = useState([]);
  const [targetKeyword, setTargetKeyword] = useState('');
  const [deploymentTarget, setDeploymentTarget] = useState('Ghost Edge');

  // structural targets
  const targetWords = 1500;
  const targetHeadings = 8;
  const targetImages = 3;

  useEffect(() => {
    // initialize empty targets
    setKeywords(MOCK_TARGETS.map(kw => ({ ...kw, used: 0 })));
  }, [activeDomain]);

  const addLog = (msg) => {
    setPipelineLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg }]);
  };

  const [uiError, setUiError] = useState('');

  const triggerHiveMind = () => {
    if(!targetKeyword) {
       setUiError("Target Keyword is physically required to authorize Hive Mind crawler spin-up.");
       setTimeout(() => setUiError(''), 4000);
       return;
    }
    setPipelineState('scraping');
    setUiError('');
    setPipelineLogs([]);
    setContent('');
    addLog(`[SYSTEM] Initializing Hive Mind for topic: "${targetKeyword}"`);
    addLog(`[NETWORK] Deploying phantom crawlers to top 10 Google SERP positions...`);

    // Simulated Pipeline Timing
    setTimeout(() => {
       setPipelineState('calculating');
       addLog(`[ALGORITHM] Extracted 4,200 data points. Reverse-engineering TF-IDF structural densities...`);
       addLog(`[SCHEMA] Generating Article and LocalBusiness JSON-LD markup blocks...`);
    }, 3000);

    setTimeout(() => {
       setPipelineState('drafting');
       addLog(`[GPT ENGINE] Translating clusters into high-volume semantic mass...`);
       simulateDrafting();
    }, 6000);
  };

  // Timer References for Strict Component Unmounting
  const intervalRef = useRef(null);
  const timeoutsRef = useRef([]);

  useEffect(() => {
     return () => {
        // Strict cleanup to prevent ghost memory leaks
        if (intervalRef.current) clearInterval(intervalRef.current);
        timeoutsRef.current.forEach(t => clearTimeout(t));
     };
  }, []);

  const simulateClaudeEEAT = (rawText) => {
     const t1 = setTimeout(() => {
        addLog(`[CLAUDE 3.5 SONNET] Purging generic GPT structural parameters (e.g. 'delve', 'moreover')...`);
     }, 2000);
     const t2 = setTimeout(() => {
        addLog(`[CLAUDE 3.5 SONNET] Injecting senior expert persona and EEAT cognitive framing...`);
     }, 4000);
     const t3 = setTimeout(() => {
        setContent(rawText + `\n\n> Note from Claude 3.5 Sonnet Cognitive Engine: I have intercepted the raw GPT data source and restructured it to match the tone of an enterprise CIO. The generic semantic fluff has been purged and mathematically replaced with high-friction authoritative framing to guarantee maximum Information Gain (EEAT).`);
        setPipelineState('complete');
        addLog(`[SUCCESS] Neural draft completed via Two-Stage Dual-Model Pipeline.`);
     }, 6000);
     timeoutsRef.current.push(t1, t2, t3);
  };

  const simulateDrafting = () => {
     const draftArray = [
        `# The Ultimate Guide to ${targetKeyword}\n\n`,
        `Modern digital ecosystems require immense structural efficiency. When examining the landscape of library automation, the ability to seamlessly manage massive catalogs is paramount. `,
        `In an era where K-12 districts demand instant accessibility, legacy circulation software simply cannot keep pace with the influx of digital and physical media. `,
        `By leveraging advanced OPAC integration, administrators can fluidly transition between data migration tasks and patron management protocols without losing critical uptime.\n\n`,
        `## Engineering the Future\n\n`,
        `The difference between success and failure often hinges on the technological choices made at the foundation. Utilizing cutting-edge architecture ensures your system remains fully resilient against load spikes.`
     ];
     
     let i = 0;
     let currentText = '';
     
     if (intervalRef.current) clearInterval(intervalRef.current);
     
     intervalRef.current = setInterval(() => {
        if(i < draftArray.length) {
           currentText += draftArray[i];
           setContent(currentText);
           i++;
        } else {
           clearInterval(intervalRef.current);
           setPipelineState('claude_intercept');
           addLog(`[COGNITIVE INTERCEPT] GPT payload generation finished. Handing payload to Claude 3.5 Sonnet...`);
           simulateClaudeEEAT(currentText);
        }
     }, 1500);
  };

  // Real-time NLP Analysis Algorithm
  useEffect(() => {
    const text = content.toLowerCase();
    let newKeywords = [...keywords];
    let keywordScoreContribution = 0;
    
    newKeywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw.word.toLowerCase()}\\b`, 'g');
      const matchCount = (text.match(regex) || []).length;
      kw.used = matchCount;

      if (kw.used > 0) {
        const structuralWeight = kw.essential ? 8 : 4;
        const fullness = Math.min((kw.used / kw.target), 1);
        keywordScoreContribution += (fullness * structuralWeight);
      }
    });
    setKeywords(newKeywords);

    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    let wordScoreContribution = Math.min((wordCount / 50), 1) * 30; // Sped up logic for demo

    let calculatedScore = 12 + wordScoreContribution + keywordScoreContribution;
    setScore(Math.min(Math.round(calculatedScore * 2.5), 100)); // Magnified for demo visualization

  }, [content]);

  const getScoreColor = (s) => {
    if (s < 40) return 'var(--color-text-muted)';
    if (s < 70) return '#eab308'; 
    return '#10B981'; // var(--color-green-main)
  };

  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 80px)' }}>
      
      {/* Header Array */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Bot size={36} color="var(--color-purple-main)" /> Dual-Stage Content Studio
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            GPT-4 Volume Cannon passing into Claude 3.5 Sonnet Cognitive EEAT Intercept.
          </p>
        </div>
        
        {/* The Toggle that prevents the 'Silicon Valley' Black Box issue */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', padding: '6px' }}>
           <button 
             onClick={() => setViewMode('creative')}
             style={{ padding: '8px 24px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', background: viewMode === 'creative' ? 'white' : 'transparent', color: viewMode === 'creative' ? 'var(--color-purple-main)' : 'var(--color-text-muted)', boxShadow: viewMode === 'creative' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <PenTool size={16}/> Writing Canvas
           </button>
           <button 
             onClick={() => setViewMode('technical')}
             style={{ padding: '8px 24px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', background: viewMode === 'technical' ? '#111' : 'transparent', color: viewMode === 'technical' ? '#10B981' : 'var(--color-text-muted)', boxShadow: viewMode === 'technical' ? '0 2px 10px rgba(0,0,0,0.2)' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Terminal size={16}/> Under The Hood (Data View)
           </button>
           <button 
             onClick={() => setViewMode('grader')}
             style={{ padding: '8px 24px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', background: viewMode === 'grader' ? 'white' : 'transparent', color: viewMode === 'grader' ? '#3B82F6' : 'var(--color-text-muted)', boxShadow: viewMode === 'grader' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Activity size={16}/> Semantic Grader (Surfer)
           </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexGrow: 1, overflow: 'hidden' }}>
         {/* ----------------------------- */}
         {/* LEFT HEMISPHERE: The Engine */}
         {/* ----------------------------- */}
         <div className="glass-panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
           
            {/* Editor Toolbar & Hive Mind Injection */}
           <div style={{ padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div style={{ display: 'flex', gap: '12px' }}>
                  <input 
                     type="text" 
                     placeholder="Enter Target Keyword to initialize Hive Mind (e.g., 'Enterprise App Development')" 
                     value={targetKeyword}
                     onChange={(e) => setTargetKeyword(e.target.value)}
                     disabled={pipelineState !== 'idle' && pipelineState !== 'complete'}
                     style={{ flexGrow: 1, padding: '12px 20px', borderRadius: '8px', border: `1px solid ${uiError ? '#EF4444' : 'rgba(0,0,0,0.1)'}`, fontSize: '1rem', fontWeight: 600, outline: 'none' }}
                  />
                  <button 
                     onClick={triggerHiveMind}
                     disabled={pipelineState !== 'idle' && pipelineState !== 'complete'}
                     className="btn hover-lift" 
                     style={{ padding: '0 30px', background: 'linear-gradient(135deg, var(--color-purple-main), var(--color-blue-main))', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)' }}>
                     <Sparkles size={18} /> {pipelineState === 'idle' || pipelineState === 'complete' ? 'Deploy Hive Mind Engine' : 'Processing...'}
                  </button>
               </div>
               
               {uiError && (
                  <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontSize: '0.85rem', fontWeight: 700 }}>
                     <AlertCircle size={14} /> {uiError}
                  </div>
               )}
               
               {/* Streaming Console Terminal */}
               {pipelineState !== 'idle' && (
                  <div style={{ background: '#111', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#10B981', height: '100px', overflowY: 'auto' }}>
                     {pipelineLogs.map((log, i) => (
                        <div key={i} className="fade-in" style={{ marginBottom: '4px' }}>
                           <span style={{ color: 'var(--color-text-muted)', marginRight: '8px' }}>[{log.time}]</span> {log.msg}
                        </div>
                     ))}
                     {pipelineState !== 'complete' && (
                        <div className="pulse-dot" style={{ display: 'inline-block', width: '8px', height: '16px', background: '#10B981', marginTop: '4px' }}></div>
                     )}
                  </div>
               )}
           </div>

           {/* CREATIVE CANVAS VIEW & SURFER SEO VIEW */}
           {(viewMode === 'creative' || viewMode === 'grader') && (
              <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                 <textarea
                   value={content}
                   onChange={(e) => setContent(e.target.value)}
                   placeholder="The drafted content will stream here continuously. Once complete, you may make manual edits or push it directly out to the edge nodes."
                   style={{
                     flexGrow: 1, padding: '40px', background: 'white', border: 'none', 
                     outline: 'none', fontSize: '1.15rem', lineHeight: '1.8', color: '#111',
                     resize: 'none', overflowY: 'auto', fontFamily: 'var(--font-main)'
                   }}
                 />

                 {/* Surfer SEO Sidebar */}
                 {viewMode === 'grader' && (
                    <div className="fade-in" style={{ width: '380px', background: 'var(--color-bg-light)', borderLeft: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                       <div style={{ padding: '30px 24px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'white', textAlign: 'center' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                             <Activity size={18} color="#10B981"/> Semantic NLP Grader
                          </h3>
                          <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: `conic-gradient(${getScoreColor(score)} ${score}%, rgba(0,0,0,0.05) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 12px white, 0 10px 30px rgba(0,0,0,0.05)', margin: '0 auto' }}>
                             <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111' }}>{score}</span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '20px', fontWeight: 600 }}>TF-IDF Content Score</p>
                       </div>
                       
                       <div style={{ padding: '24px' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.5px' }}>Target Term Density</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                             {['Enterprise Architecture', 'SaaS Platform', 'B2B Sales', 'Algorithmic Routing', 'Serverless', 'React Flow', 'Data Pipeline'].map((term, i) => {
                                const keywordFound = targetKeyword && content.toLowerCase().includes(targetKeyword.toLowerCase());
                                const isDiscovered = content.toLowerCase().includes(term.toLowerCase()) || (i === 0 && keywordFound);
                                return (
                                   <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: isDiscovered ? 'rgba(16, 185, 129, 0.1)' : 'white', border: `1px solid ${isDiscovered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0,0,0,0.05)'}`, borderRadius: '8px' }}>
                                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isDiscovered ? '#10B981' : 'var(--color-text-main)' }}>{term}</span>
                                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isDiscovered ? '#10B981' : 'var(--color-text-muted)' }}>{isDiscovered ? '2 / 2' : '0 / 2'}</span>
                                   </div>
                                )
                             })}
                          </div>
                          
                          {wordCount < 100 && (
                             <div style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <AlertTriangle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
                                <div>
                                   <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EF4444', marginBottom: '4px' }}>Word Count Too Low</div>
                                   <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>Currently {wordCount} words. Target is 450+ to outrank Top 5 SERP competitors.</div>
                                </div>
                             </div>
                          )}
                       </div>
                    </div>
                 )}
              </div>
           )}

           {/* TECHNICAL DATA VIEW */}
           {viewMode === 'technical' && (
              <div className="fade-in" style={{ flexGrow: 1, padding: '30px', background: '#fafafa', overflowY: 'auto' }}>
                 <div style={{ padding: '20px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', borderRadius: '12px', marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <Cpu size={20} color="var(--color-purple-main)"/> Raw LSI Algorithm Densities
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                       <thead>
                          <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                             <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Semantic Entity (N-Gram)</th>
                             <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>TF-IDF Weighting</th>
                             <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Required Density</th>
                             <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Detected (Live)</th>
                          </tr>
                       </thead>
                       <tbody>
                          {keywords.map(kw => (
                             <tr key={kw.word} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <td style={{ padding: '16px 12px', fontWeight: 700, fontFamily: 'monospace', fontSize: '1rem' }}>{kw.word}</td>
                                <td style={{ padding: '16px 12px', fontWeight: 700, color: '#F59E0B' }}>{kw.score}</td>
                                <td style={{ padding: '16px 12px', fontWeight: 700 }}>{kw.target}x</td>
                                <td style={{ padding: '16px 12px', fontWeight: 700, color: kw.used >= kw.target ? '#10B981' : '#EF4444' }}>{kw.used}x</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>

                 <div style={{ padding: '20px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <Code2 size={20} color="var(--color-blue-main)"/> Compiled Edge JSON-LD Payload
                    </h3>
                    <pre style={{ background: '#111', color: '#10B981', padding: '20px', borderRadius: '8px', fontSize: '0.85rem', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
{`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The Ultimate Guide to ${targetKeyword || 'Keyword'}",
  "datePublished": "${new Date().toISOString()}",
  "author": {
    "@type": "Organization",
    "name": "${activeDomain}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "${activeDomain}",
    "logo": {
      "@type": "ImageObject",
      "url": "https://${activeDomain}/logo.png"
    }
  }
}`}
                    </pre>
                 </div>
               </div>
            )}

            {/* Core Universal Deployment Loop */}
           <div style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                   <Network size={16} /> Autonomous Network Injection
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Target Platform:</span>
                   <select 
                      value={deploymentTarget} 
                      onChange={(e) => setDeploymentTarget(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', fontWeight: 700, outline: 'none' }}
                   >
                      <option value="Ghost Edge">Ghost Engine (Edge / ASP / Headless)</option>
                      <option value="WordPress API">WordPress (REST API)</option>
                      <option value="Webflow">Webflow CMS</option>
                      <option value="Shopify">Shopify Liquid</option>
                   </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={apiLimitsReached} onChange={() => setApiLimitsReached(!apiLimitsReached)} style={{ cursor: 'pointer' }}/>
                    Simulate API Budget Cap (GlobalConstraints.jsx)
                 </label>
                 
                 <button 
                    disabled={pipelineState !== 'complete'} 
                    onClick={async () => {
                        if (apiLimitsReached) {
                            await TelemetryEngine.dispatchException('ContentStudio', 'API Budget Cap Breached (GlobalConstraints)', { wordCount: content.length, cost: '$12.40' }, 'warning');
                            navigate('/admin/action-center');
                        } else {
                            const insertPayload = {
                               domain: activeDomain,
                               target_keyword: targetKeyword,
                               generated_payload: content,
                               algorithmic_score: score,
                               target_platform: deploymentTarget,
                               status: 'deployed'
                            };
                            const { error } = await supabase.from('nexus_content_drafts').insert([insertPayload]);
                            
                            if (error) {
                               await TelemetryEngine.dispatchException('ContentStudio', 'Supabase Insert Database Alert', error, 'fatal');
                               alert("A fatal error occurred saving to Supabase. Check Action Center.");
                               return;
                            }
                            
                            alert(`Payload physically anchored and deployed vertically to: ${deploymentTarget}.`);
                        }
                    }} 
                    className="btn hover-lift" 
                    style={{ padding: '12px 30px', background: pipelineState === 'complete' ? (apiLimitsReached ? '#EF4444' : 'var(--color-blue-main)') : 'rgba(0,0,0,0.1)', color: pipelineState === 'complete' ? 'white' : 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', cursor: pipelineState === 'complete' ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: pipelineState === 'complete' && apiLimitsReached ? '0 10px 20px rgba(239, 68, 68, 0.3)' : 'none' }}>
                    {apiLimitsReached && pipelineState === 'complete' ? <Target size={18} /> : <Globe size={18} />}
                    {apiLimitsReached && pipelineState === 'complete' ? 'SRE Override: Request Payload Deploy Auth' : `Deploy Payload to ${deploymentTarget}`}
                 </button>
              </div>
           </div>
         </div>


         {/* ----------------------------- */}
         {/* RIGHT HEMISPHERE: NLP Engine */}
         {/* ----------------------------- */}
         <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingRight: '10px' }}>
           
           {/* Massive Optimization Gauge */}
           <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px' }}>Algorithmic Readiness</h3>
             
             <div style={{ 
               width: '180px', height: '180px', borderRadius: '50%', background: 'white', position: 'relative',
               display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
               background: `conic-gradient(${getScoreColor(score)} ${(score/100)*360}deg, #f1f5f9 0deg)`
             }}>
               <div style={{ 
                 width: '140px', height: '140px', borderRadius: '50%', background: 'var(--color-bg-light)', 
                 display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
               }}>
                 <span style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: '1', color: getScoreColor(score), letterSpacing: '-2px' }}>{score}</span>
                 <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>/ 100</span>
               </div>
             </div>
             
             <p style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.5', fontWeight: 600 }}>
               {score < 40 ? 'Pipeline idle. Awaiting Hive Mind structural generation.' : 
                score < 80 ? 'Generating payload. Synthesizing N-Gram semantic targets.' : 
                'Content verified. Payload exceeds Page 1 structural threshold requirements.'}
             </p>
           </div>

           {/* Structural Analysis */}
           <div className="glass-panel" style={{ padding: '24px' }}>
             <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Target size={18} color="var(--color-purple-main)" /> Document Structure
             </h3>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Type size={14}/> Word Mass</span>
                   <span style={{ color: wordCount >= targetWords ? '#10B981' : 'var(--color-text-muted)'}}>{wordCount} / {targetWords}</span>
                 </div>
                 <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                   <div style={{ width: `${Math.min((wordCount/targetWords)*100, 100)}%`, height: '100%', background: wordCount >= targetWords ? '#10B981' : 'var(--color-purple-main)', transition: 'width 0.3s ease' }}></div>
                 </div>
               </div>

               <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Type size={14}/> Heading Hierarchy</span>
                   <span style={{ color: pipelineState === 'complete' ? '#10B981' : 'var(--color-text-muted)' }}>{pipelineState === 'complete' ? 8 : 0} / {targetHeadings}</span>
                 </div>
                 <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                   <div style={{ width: `${pipelineState === 'complete' ? 100 : 0}%`, height: '100%', background: pipelineState === 'complete' ? '#10B981' : 'var(--color-purple-main)', transition: 'width 0.5s ease' }}></div>
                 </div>
               </div>
             </div>
           </div>

           {/* Semantic Keyword Clusters */}
           <div className="glass-panel" style={{ padding: '24px' }}>
             <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Semantic Payload</h3>
             <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>Target injections driven by Hive Mind computational algorithms.</p>
             
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
               {keywords.map(kw => {
                 const limitReached = kw.used >= kw.target;
                 
                 return (
                   <div key={kw.word} style={{ 
                     padding: '6px 12px', 
                     borderRadius: '20px', 
                     fontSize: '0.8rem', 
                     fontWeight: 700,
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: '6px',
                     background: limitReached ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.03)',
                     color: limitReached ? '#10B981' : 'var(--color-text-main)',
                     border: `1px solid ${limitReached ? 'rgba(16, 185, 129, 0.2)' : 'transparent'}`,
                     transition: 'all 0.4s ease'
                   }}>
                     {limitReached && <CheckCircle size={12} />}
                     {kw.word}
                     <span style={{ opacity: limitReached ? 1 : 0.5, fontSize: '0.75rem', fontWeight: 900 }}>{kw.used}/{kw.target}</span>
                   </div>
                 );
               })}
             </div>
           </div>

         </div>
      </div>
    </div>
  );
};

export default ContentStudio;
