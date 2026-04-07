import React, { useState, useEffect, useContext } from 'react';
import { PenTool, CheckCircle, Target, Type, Image as ImageIcon, Link as LinkIcon, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { GlobalDomainContext } from '../../layouts/AdminLayout';

const ContentStudio = () => {
  const [content, setContent] = useState('');
  const [score, setScore] = useState(12); // Base score
  const [keywords, setKeywords] = useState([]);
  const { activeDomain } = useContext(GlobalDomainContext);

  useEffect(() => {
    const fetchTargets = async () => {
      const { data } = await supabase.from('content_nlp_targets').select('*').eq('client_id', activeDomain);
      if (data) {
        // Initialize the tracking state natively
        const initializedTargets = data.map(kw => ({ ...kw, used: 0 }));
        setKeywords(initializedTargets);
      } else {
        setKeywords([]);
      }
    };
    fetchTargets();
  }, [activeDomain]);

  // Structural targets
  const targetWords = 1500;
  const targetHeadings = 8;
  const targetImages = 3;

  // Real-time NLP Analysis Algorithm
  useEffect(() => {
    const text = content.toLowerCase();
    
    // 1. Calculate Keyword Density
    let newKeywords = [...keywords];
    let keywordScoreContribution = 0;
    
    newKeywords.forEach(kw => {
      // Massive Regex to count occurrences of specific phrases
      const regex = new RegExp(`\\b${kw.word}\\b`, 'g');
      const matchCount = (text.match(regex) || []).length;
      kw.used = matchCount;

      // Scoring logic: Give points up to the target amount
      if (kw.used > 0) {
        const structuralWeight = kw.essential ? 8 : 4;
        const fullness = Math.min((kw.used / kw.target), 1);
        keywordScoreContribution += (fullness * structuralWeight);
      }
    });
    setKeywords(newKeywords);

    // 2. Word Count Analytics
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    const wordScoreContribution = Math.min((wordCount / targetWords), 1) * 30; // 30% of total score

    // 3. Fake Structural Scoring (Base 12 + dynamic calculations)
    let calculatedScore = 12 + wordScoreContribution + keywordScoreContribution;
    setScore(Math.min(Math.round(calculatedScore), 100)); // Cap at 100

  }, [content]);

  // Determine Gauge Color
  const getScoreColor = (s) => {
    if (s < 40) return 'var(--color-text-muted)';
    if (s < 70) return '#eab308'; // yellow
    return 'var(--color-green-main)';
  };

  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div style={{ display: 'flex', gap: '30px', height: 'calc(100vh - 120px)' }}>
      
      {/* ----------------------------- */}
      {/* LEFT HEMISPHERE: The Editor */}
      {/* ----------------------------- */}
      <div className="glass-panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Editor Toolbar */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-purple-main), var(--color-blue-main))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <PenTool size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Generative Engine Canvas</h2>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Keyword Target: "Gourmet Popcorn"</div>
            </div>
          </div>
          
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} /> Auto-Optimize Text
          </button>
        </div>

        {/* Text Area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Begin writing, or paste your AI drafted content here to initialize the algorithm..."
          style={{
            flexGrow: 1, padding: '40px', background: 'transparent', border: 'none', 
            outline: 'none', fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text-main)',
            resize: 'none', overflowY: 'auto', fontFamily: 'var(--font-main)'
          }}
        />
      </div>


      {/* ----------------------------- */}
      {/* RIGHT HEMISPHERE: NLP Engine */}
      {/* ----------------------------- */}
      <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingRight: '10px' }}>
        
        {/* Massive Optimization Gauge */}
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px' }}>Content Score</h3>
          
          <div style={{ 
            width: '180px', height: '180px', borderRadius: '50%', background: 'white', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            background: `conic-gradient(${getScoreColor(score)} ${(score/100)*360}deg, #f1f5f9 0deg)`
          }}>
            <div style={{ 
              width: '140px', height: '140px', borderRadius: '50%', background: 'var(--color-bg-light)', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
            }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, lineHeight: '1', color: getScoreColor(score) }}>{score}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>/ 100</span>
            </div>
          </div>
          
          <p style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
            {score < 40 ? 'Your content structure is critically lacking semantic depth.' : 
             score < 70 ? 'You are approaching page 1 competitor parity.' : 
             'Excellent. Your content is algorithmically optimized for top rankings.'}
          </p>
        </div>

        {/* Structural Analysis */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="var(--color-purple-main)" /> Content Structure
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Type size={14}/> Words</span>
                <span style={{ color: wordCount >= targetWords ? 'var(--color-green-main)' : 'var(--color-text-muted)'}}>{wordCount} / {targetWords}</span>
              </div>
              <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min((wordCount/targetWords)*100, 100)}%`, height: '100%', background: wordCount >= targetWords ? 'var(--color-green-main)' : 'var(--color-purple-main)', transition: 'width 0.3s ease' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Type size={14}/> Headings</span>
                <span style={{ color: 'var(--color-text-muted)' }}>0 / {targetHeadings}</span>
              </div>
              <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `0%`, height: '100%', background: 'var(--color-purple-main)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ImageIcon size={14}/> Media</span>
                <span style={{ color: 'var(--color-text-muted)' }}>0 / {targetImages}</span>
              </div>
              <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `0%`, height: '100%', background: 'var(--color-purple-main)' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Semantic Keyword Clusters */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Semantic Terms</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>Based on NLP analysis of top 10 competitors.</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {keywords.map(kw => {
              const limitReached = kw.used >= kw.target;
              
              return (
                <div key={kw.word} style={{ 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: 600,
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  background: limitReached ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.03)',
                  color: limitReached ? 'var(--color-green-main)' : 'var(--color-text-main)',
                  border: `1px solid ${limitReached ? 'rgba(16, 185, 129, 0.2)' : 'transparent'}`,
                  transition: 'all 0.2s ease'
                }}>
                  {limitReached && <CheckCircle size={12} />}
                  {kw.word}
                  <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>{kw.used}/{kw.target}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ContentStudio;
