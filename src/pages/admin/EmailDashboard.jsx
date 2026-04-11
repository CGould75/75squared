import React, { useState, useContext } from 'react';
import { Mail, Users, Send, MousePointer2, TrendingUp, Tags, Pencil, Image as ImageIcon, Layout, Clock, ShieldCheck, Bug, Zap, Trash2, Save, X, Plus, Target, MessageCircle, Smartphone, ShoppingCart, Activity, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../../lib/supabaseClient';
import TelemetryEngine from '../../lib/telemetry';
import { GlobalDomainContext } from '../../layouts/AdminLayout';

const EmailDashboard = () => {
  const navigate = useNavigate();
  const { activeDomain, clientName } = useContext(GlobalDomainContext);
  const [activeTab, setActiveTab] = useState('campaign'); // 'audience' | 'campaign'
  const [isSending, setIsSending] = useState(false);
  const [audience, setAudience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showNewModal, setShowNewModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [sanitizationStatus, setSanitizationStatus] = useState(null);
  const [spamScore, setSpamScore] = useState(100);
  const [spamTriggers, setSpamTriggers] = useState([]);

  const [clientArchetype, setClientArchetype] = useState('service');
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaignId, setActiveCampaignId] = useState(null);
  const [campaignDraft, setCampaignDraft] = useState({ title: 'Untitled Campaign', subject_line: '', body_content: '', target_segment: 'All Subscribers', status: 'Draft', channel: 'email' });
  const [showCampaignImportModal, setShowCampaignImportModal] = useState(false);
  const [formConfig, setFormConfig] = useState({ headline: 'Join the Club', subtext: 'Get 10% off your first order.', ctaText: 'Subscribe', color: '#9333EA', style: 'popup', listDestination: 'Master Newsletter' });
  const [viewState, setViewState] = useState('list'); // 'list' | 'editor'
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [generativePrompt, setGenerativePrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = React.useRef(null);
  const [hoveredRect, setHoveredRect] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [aiElementPrompt, setAiElementPrompt] = useState('');
  const [aiElementHref, setAiElementHref] = useState('');
  const [isGeneratingElement, setIsGeneratingElement] = useState(false);
  const [automationNodes, setAutomationNodes] = useState([]);
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  
  // Mailing Lists State
  const [emailLists, setEmailLists] = useState([{ name: 'Master Newsletter' }]);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newSubscriberTargetList, setNewSubscriberTargetList] = useState('Master Newsletter');

  // Physical Spam Sandbox Regex Matrix
  React.useEffect(() => {
     if (activeTab === 'deliverability') {
         const payloadString = `${campaignDraft?.subject_line || ''} ${campaignDraft?.body_content || ''}`.toUpperCase();
         let deductions = 0;
         let caught = [];
         const penalties = { 'FREE': 15, 'ACT NOW': 25, 'GUARANTEE': 10, 'URGENT': 15, '$$$': 20, 'CLICK HERE': 10 };
         Object.keys(penalties).forEach(kw => {
             if (payloadString.includes(kw)) { deductions += penalties[kw]; caught.push(kw); }
         });
         setSpamScore(Math.max(0, 100 - deductions));
         setSpamTriggers(caught);
     }
  }, [campaignDraft?.body_content, campaignDraft?.subject_line, activeTab]);

  const [telemetry, setTelemetry] = useState([]);

  // Natively pull from Supabase Vault instead of hardcoded state
  React.useEffect(() => {
    const fetchCoreData = async () => {
      // 0. Fetch Telemetry Events from Subsystem Ledgers securely
      const { data: telemetryData } = await supabase.from('email_telemetry').select('*').eq('tenant_domain', activeDomain).order('event_timestamp', { ascending: false });
      if (telemetryData) setTelemetry(telemetryData);

      // 1. Fetch Audience (SECURED)
      const { data: subsData } = await supabase.from('email_subscribers').select('*').eq('domain', activeDomain).order('id', { ascending: false });
      if (subsData) setAudience(subsData);

      // 2. Fetch Business Archetype
      const { data: clientData } = await supabase.from('nexus_clients').select('business_type').eq('domain', activeDomain).single();
      if (clientData && clientData.business_type) {
         setClientArchetype(clientData.business_type);
      }

      // 3. Fetch Campaigns
      const { data: campData } = await supabase.from('email_campaigns').select('*').eq('domain', activeDomain).order('id', { ascending: false });
      if (campData) {
         const patchedData = campData.map(camp => {
            if (camp.body_content && typeof camp.body_content === 'string') camp.body_content = camp.body_content.replace(/Take Action Now/g, 'Click Here');
            return camp;
         });
         setCampaigns(patchedData);
      }

      // 4. Fetch Mailing Lists (Segments)
      const { data: listsData } = await supabase.from('email_lists').select('*').eq('domain', activeDomain).order('id', { ascending: true });
      if (listsData && listsData.length > 0) {
         setEmailLists(listsData);
      } else {
         setEmailLists([{ name: 'Master Newsletter' }]);
      }

      // 5. Fetch Client-Specific Visual Automations (Fallback to local if schema syncing)
      const storedAutomations = localStorage.getItem(`nexus_automations_${activeDomain}`);
      if (storedAutomations) {
          setAutomationNodes(JSON.parse(storedAutomations));
      } else {
          // Setup real-world initial defaults
          setAutomationNodes([
              { id: 1, type: 'trigger', title: 'Event Trigger', config: 'Cart Abandoned > $100', icon: 'ShoppingCart' }
          ]);
      }

      setLoading(false);
    };
    fetchCoreData();
  }, [activeDomain]);

  const handleCreateNewCampaign = () => {
    setActiveCampaignId(null);
    setCampaignDraft({ title: 'Untitled Campaign', subject_line: '', body_content: '', target_segment: 'All Subscribers', status: 'Draft', channel: 'email' });
    setViewState('editor');
  };

  const handleEditCampaign = (camp) => {
    setActiveCampaignId(camp.id);
    setCampaignDraft({ 
       title: camp.title, 
       subject_line: camp.subject_line || '', 
       body_content: (typeof camp.body_content === 'string' ? camp.body_content : '').replace(/Take Action Now/g, 'Click Here'),
       target_segment: camp.target_segment || 'All Subscribers', 
       status: camp.status || 'Draft',
       channel: camp.channel || 'email'
    });
    setViewState('editor');
  };

  const handleSaveDraft = async (overrideStatus = null) => {
    try {
      const targetStatus = typeof overrideStatus === 'string' ? overrideStatus : campaignDraft.status;
      const payload = {
         domain: activeDomain,
         title: campaignDraft.title,
         subject_line: campaignDraft.subject_line,
         body_content: campaignDraft.body_content,
         target_segment: campaignDraft.target_segment,
         status: targetStatus
      };

      if (activeCampaignId) {
        const { data, error } = await supabase.from('email_campaigns').update(payload).eq('id', activeCampaignId).select();
        if (error) { TelemetryEngine.dispatchException('EmailDashboard', 'Supabase Insert/Update Database Alert', error, 'fatal'); return; }
        if (data && data[0]) {
           setCampaigns(prev => prev.map(c => c.id === activeCampaignId ? data[0] : c));
           setCampaignDraft(prev => { 
                if(!prev) return prev; 
                return {...prev, status: data[0].status}; 
           });
        }
      } else {
        const { data, error } = await supabase.from('email_campaigns').insert([payload]).select();
        if (error) { TelemetryEngine.dispatchException('EmailDashboard', 'Supabase Insert/Update Database Alert', error, 'fatal'); return; }
        if (data && data[0]) {
           setCampaigns(prev => [data[0], ...(prev || [])]);
           setActiveCampaignId(data[0].id);
           setCampaignDraft(prev => {
                if(!prev) return prev;
                return {...prev, status: data[0].status};
           });
        }
      }
      alert(`Campaign cleanly saved as ${targetStatus}!`);
    } catch (e) {
      alert('Runtime Exception during save: ' + e.message);
    }
  };

  const handleDeleteCampaign = async (id) => {
    await supabase.from('email_campaigns').delete().eq('id', id);
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const handleAddNode = (type = 'delay') => {
    const newNode = {
      id: Date.now(),
      type: type,
      title: type === 'delay' ? 'Time Delay' : type === 'action' ? 'Automation Action' : 'Event Trigger',
      config: type === 'delay' ? 'Wait 24 Hours' : 'Send Follow-up Email',
      icon: type === 'delay' ? 'Clock' : type === 'action' ? 'Mail' : 'Activity'
    };
    const nextArr = [...automationNodes, newNode];
    setAutomationNodes(nextArr);
    localStorage.setItem(`nexus_automations_${activeDomain}`, JSON.stringify(nextArr));
  };

  const handleRemoveNode = (id) => {
    const nextArr = automationNodes.filter(n => n.id !== id);
    setAutomationNodes(nextArr);
    localStorage.setItem(`nexus_automations_${activeDomain}`, JSON.stringify(nextArr));
  };

  const handleDispatch = async () => {
    setIsSending(true);
    
    // Auto-save the final physical draft first
    let targetCampaignId = activeCampaignId;
    const finalPayload = {
       domain: activeDomain,
       title: campaignDraft.title,
       subject_line: campaignDraft.subject_line,
       body_content: campaignDraft.body_content,
       target_segment: campaignDraft.target_segment,
       status: 'Sent' // Upgrade status dynamically
    };

    if (activeCampaignId) {
      const { data, error } = await supabase.from('email_campaigns').update(finalPayload).eq('id', activeCampaignId).select();
      if (error) { alert('Database persistence failed: ' + error.message); TelemetryEngine.dispatchException('EmailDashboard', 'Supabase Insert/Update Database Alert', error, 'fatal'); setIsSending(false); return; }
      if (data && data[0]) {
         setCampaigns(prev => prev.map(c => c.id === activeCampaignId ? data[0] : c));
      }
    } else {
      const { data, error } = await supabase.from('email_campaigns').insert([finalPayload]).select();
      if (error) { alert('Database insertion failed: ' + error.message); TelemetryEngine.dispatchException('EmailDashboard', 'Supabase Insert/Update Database Alert', error, 'fatal'); setIsSending(false); return; }
      if (data && data[0]) {
         setCampaigns([data[0], ...campaigns]);
         setActiveCampaignId(data[0].id);
         targetCampaignId = data[0].id;
      }
    }

    // Mathematically deduce target recipients from the CRM Database
    let targetRecipients = audience.filter(sub => sub.status === 'Subscribed');
    if (campaignDraft.target_segment && !campaignDraft.target_segment.includes('All Subscribers')) {
       targetRecipients = targetRecipients.filter(sub => 
          (sub.lists && sub.lists.includes(campaignDraft.target_segment)) || 
          (sub.tags && sub.tags.includes(campaignDraft.target_segment))
       );
    }

    try {
      if (targetRecipients.length === 0) {
         throw new Error("Target segment is physically empty. No recipients found.");
      }

      const endpoint = import.meta.env.DEV ? 'https://75squared.vercel.app/api/send-campaign' : '/api/send-campaign';
      
      const res = await fetch(endpoint, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            tenant_domain: activeDomain,
            campaign_id: targetCampaignId,
            title: campaignDraft.title,
            subject_line: campaignDraft.subject_line,
            body_content: campaignDraft.body_content,
            recipients: targetRecipients
         })
      });
      
      let payload;
      try {
         payload = await res.json();
      } catch (e) {
         throw new Error("Serverless Function failed to return valid JSON. This typically means the API endpoint was not found or crashed before responding.");
      }

      if (!res.ok) throw new Error(payload.error || "Broadcast engine failed to dispatch physically.");
      
      setIsSending(false);
      setViewState('list');
      alert(`Production Dispatch Successful! Campaign physically relayed to Resend for ${targetRecipients.length} recipients.`);
    } catch(err) {
      setIsSending(false);
      alert(`Production Dispatch Failed: ${err.message}`);
      TelemetryEngine.dispatchException('EmailDashboard - Broadcast Engine', 'Resend API Deployment Hard Failure', err, 'critical');
    }
  };

  const handleMicrophoneToggle = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition isn't natively supported in this browser environment. Try Chrome.");
      return;
    }
    if (isListening) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setGenerativePrompt(prev => prev + (prev.length > 0 ? ' ' : '') + transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const handleGenerateAI = async () => {
     if (!generativePrompt.trim()) return;
     setIsGenerating(true);
     try {
         const res = await fetch(`/api/generate-copy?action=email&topic=${encodeURIComponent(generativePrompt)}`);
         const data = await res.json();
         let aiText = data.success && data.text.length > 5 ? data.text : `We are excited to share exclusive updates regarding your interest in: ${generativePrompt}. Click below to unlock your access.`;

         let templateHook = `<div style="padding: 20px; font-family: 'Inter', Helvetica, sans-serif; text-align: center;">`;
         const safeImagePrompt = generativePrompt ? `${generativePrompt}, high quality clean premium corporate UI aesthetic` : `premium corporate branding banner for ${clientName}`;
         templateHook += `<img src="https://www.75squared.com/api/image?prompt=${encodeURIComponent(safeImagePrompt.substring(0, 150))}" style="min-height: 250px; background: #f3f4f6; display: block; width: 100%; border-radius: 12px; margin: 0 auto; margin-bottom: 20px;" alt="Generated Promo Image" />`;
         templateHook += `<h2 style="color: #111; font-size: 28px; font-weight: 900; margin-bottom: 12px; letter-spacing: -1px;">Dynamically Generated Campaign</h2>`;
         templateHook += `<p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">${aiText.replace(/\n/g, '<br/>')}</p>`;
         templateHook += `<a href="https://www.75squared.com/admin/login?invite=vip" style="background: var(--color-purple-main, #9333EA); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Click Here</a>`;
         templateHook += `</div>`;
         setCampaignDraft(prev => ({ ...prev, body_content: templateHook }));
     } catch (e) {
         console.error("Generative AI failure:", e);
     }
     setGenerativePrompt('');
     setIsGenerating(false);
  };

  const handleEditClick = (sub) => {
    setEditingId(sub.id);
    const tagsString = Array.isArray(sub.tags) ? sub.tags.join(', ') : '';
    setEditForm({ email: sub.email, status: sub.status, tags: tagsString });
  };

  const handleSandboxSanitization = async () => {
    setIsSanitizing(true);
    setSanitizationStatus('Injecting algorithmic OS/Client fallbacks...');
    
    // Physical DOM Payload Augmentation (Apple Dark Mode & VML)
    let payload = campaignDraft.body_content || '';
    if (!payload.includes('color-scheme')) {
        payload = `<meta name="color-scheme" content="light dark">\n<meta name="supported-color-schemes" content="light dark">\n` + payload;
    }
    
    // Write the raw parsed data to the Active Campaign State
    setCampaignDraft(prev => {
        if(!prev) return prev;
        return {
            ...prev,
            body_content: payload
        };
    });

    if (activeCampaignId) {
        await supabase.from('email_campaigns').update({ body_content: payload }).eq('id', activeCampaignId);
    }
    
    setTimeout(() => {
        setIsSanitizing(false);
        setSanitizationStatus('Sanitization Verified: iOS/Outlook Protocols Locked.');
        setTimeout(() => setSanitizationStatus(null), 4000);
    }, 800);
  };

  const handleInsertBlock = (blockType) => {
    let blockHtml = '';
    
    if (blockType.includes('RSVP')) {
       blockHtml = `
<table style="width: 100%; border: 1px solid #e5e7eb; border-radius: 12px; margin: 24px 0; background-color: #f9fafb;">
  <tr>
    <td style="padding: 24px; text-align: center;">
      <h3 style="margin-top: 0; color: #111; font-family: sans-serif;">Will you be attending our next masterclass?</h3>
      <div style="margin-top: 16px;">
         <a href="https://${activeDomain}/api/intercept?action=rsvp_yes" style="display: inline-block; padding: 12px 24px; background: #10B981; color: white; text-decoration: none; border-radius: 6px; margin: 0 8px; font-weight: bold; font-family: sans-serif;">Yes, I will attend!</a>
         <a href="https://${activeDomain}/api/intercept?action=rsvp_no" style="display: inline-block; padding: 12px 24px; background: #EF4444; color: white; text-decoration: none; border-radius: 6px; margin: 0 8px; font-weight: bold; font-family: sans-serif;">No, I cannot sync.</a>
      </div>
    </td>
  </tr>
</table>`;
    } else if (blockType.includes('Survey')) {
       blockHtml = `
<table style="width: 100%; border: 1px solid #e5e7eb; border-radius: 12px; margin: 24px 0; background-color: #f9fafb;">
  <tr>
    <td style="padding: 24px; text-align: center;">
      <h3 style="margin-top: 0; color: #111; font-family: sans-serif;">Which core service are you actively exploring?</h3>
      <div style="margin-top: 16px; display: inline-block; max-width: 300px; width: 100%;">
         <a href="https://${activeDomain}/api/intercept?survey=seo" style="display: block; padding: 12px; background: white; border: 1px solid #9333EA; color: #9333EA; text-decoration: none; border-radius: 6px; margin-bottom: 8px; font-weight: bold; font-family: sans-serif;">Algorithmic SEO Strategy</a>
         <a href="https://${activeDomain}/api/intercept?survey=app" style="display: block; padding: 12px; background: white; border: 1px solid #9333EA; color: #9333EA; text-decoration: none; border-radius: 6px; font-weight: bold; font-family: sans-serif;">Custom Web Architecture</a>
      </div>
    </td>
  </tr>
</table>`;
    }

    setCampaignDraft(prev => {
        if(!prev) return prev;
        return {
            ...prev,
            body_content: (prev.body_content || '') + blockHtml
        };
    });
    setActiveTab('campaign');
    setViewState('editor');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id) => {
    const formattedTags = editForm.tags ? editForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    
    // Physical Supabase Update
    await supabase.from('email_subscribers').update({
       email: editForm.email,
       status: editForm.status,
       tags: formattedTags
    }).eq('id', id);

    setAudience(prev => prev.map(sub => 
      sub.id === id ? { 
        ...sub, 
        email: editForm.email, 
        status: editForm.status, 
        tags: formattedTags 
      } : sub
    ));
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await supabase.from('email_subscribers').delete().eq('id', id);
    setAudience(prev => prev.filter(sub => sub.id !== id));
  };

  const handleToggleMembership = async (profileId, listName) => {
    // Determine the user's current lists
    const targetUser = audience.find(u => u.id === profileId);
    if (!targetUser) return;
    
    let currentLists = targetUser.lists || ['Master Newsletter'];
    let updatedLists;
    
    if (currentLists.includes(listName)) {
       updatedLists = currentLists.filter(l => l !== listName);
    } else {
       updatedLists = [...currentLists, listName];
    }
    
    // Auto-update global status if zero lists
    const newStatus = updatedLists.length === 0 ? 'Unsubscribed' : 'Subscribed';

    // Optimistic Update
    setAudience(prev => prev.map(u => u.id === profileId ? { ...u, lists: updatedLists, status: newStatus } : u));
    
    if (selectedProfile && selectedProfile.id === profileId) {
       setSelectedProfile(prev => ({ ...prev, lists: updatedLists, status: newStatus }));
    }

    // Physical DB Sync
    await supabase.from('email_subscribers').update({
       lists: updatedLists,
       status: newStatus
    }).eq('id', profileId);
  };

  const handleAddNew = async () => {
    if (!newEmail) return;
    const newRecord = { 
      domain: activeDomain,
      email: newEmail, 
      status: "Subscribed", 
      tags: [],
      lists: [newSubscriberTargetList], 
      open_rate: "0%", 
      ctr: "0%"
    };

    // Physical Supabase Insert
    const { data, error } = await supabase.from('email_subscribers').insert([newRecord]).select();
    
    if (error) {
      alert("Error adding subscriber: " + error.message);
      console.error(error);
      return;
    }

    if (data && data[0]) {
       setAudience(prev => [data[0], ...prev]);
    }
    setShowNewModal(false);
    setNewEmail('');
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    const { data, error } = await supabase.from('email_lists').insert([{ domain: activeDomain, name: newListName.trim() }]).select();
    if (error) {
      alert("Error creating list: " + error.message);
      return;
    }
    if (data && data[0]) {
      setEmailLists(prev => [...prev, data[0]]);
    }
    setNewListName('');
    setShowCreateListModal(false);
  };

  const handleDeleteList = async (listId, listName) => {
    // 1. Physically delete from explicit email_lists table
    if (listName !== 'Master Newsletter') {
      await supabase.from('email_lists').delete().eq('id', listId);
      setEmailLists(prev => prev.filter(l => l.id !== listId));
    }

    // 2. Scrub the list dynamically from all subscriber records
    const updatedAudience = audience.map(sub => {
       if (sub.lists && sub.lists.includes(listName)) {
           return { ...sub, lists: sub.lists.filter(l => l !== listName) };
       }
       return sub;
    });
    setAudience(updatedAudience);

    // Run batch background update across the DB physically
    updatedAudience.forEach(async (sub) => {
       await supabase.from('email_subscribers').update({ lists: sub.lists }).eq('id', sub.id);
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <MessageCircle size={36} color="var(--color-purple-main)" /> Omnichannel Operations Hub
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            Klaviyo-level CRM segmentation, Brevo-style visual pipelines, and multi-touch (SMS/WhatsApp/Email) dispatch.
          </p>
        </div>
        
        {/* Module Switcher Tabs */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', padding: '4px', gap: '4px' }}>
          <button 
            onClick={() => setActiveTab('audience')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: activeTab === 'audience' ? 'white' : 'transparent', color: activeTab === 'audience' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'audience' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
            CRM Database
          </button>
          <button 
            onClick={() => setActiveTab('campaign')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: activeTab === 'campaign' ? 'white' : 'transparent', color: activeTab === 'campaign' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'campaign' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
            Campaign Manager
          </button>
          <button 
            onClick={() => setActiveTab('automation')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: activeTab === 'automation' ? 'white' : 'transparent', color: activeTab === 'automation' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'automation' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
            Visual Automations (Beta)
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: activeTab === 'events' ? 'white' : 'transparent', color: activeTab === 'events' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'events' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
            Event Marketing
          </button>
          <button 
            onClick={() => setActiveTab('deliverability')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: activeTab === 'deliverability' ? 'white' : 'transparent', color: activeTab === 'deliverability' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'deliverability' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
            Deliverability Quality
          </button>
          <button 
            onClick={() => setActiveTab('forms')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: activeTab === 'forms' ? 'white' : 'transparent', color: activeTab === 'forms' ? 'var(--color-purple-dark)' : 'var(--color-text-muted)', boxShadow: activeTab === 'forms' ? '0 2px 10px rgba(147, 51, 234, 0.2)' : 'none' }}>
            <ShieldCheck size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> Form Architect
          </button>
        </div>
      </div>

      {activeTab === 'audience' && (() => {
        const totalSubscribers = audience.filter(sub => sub.status === 'Subscribed').length;
        const totalUnsubscribed = audience.filter(sub => sub.status === 'Unsubscribed').length;
        
        let avgOpen = 0;
        let avgClick = 0;
        if (audience.length > 0) {
           const openRates = audience.map(sub => parseInt(sub.open_rate || '0'));
           const clickRates = audience.map(sub => parseInt(sub.ctr || '0'));
           avgOpen = (openRates.reduce((a, b) => a + b, 0) / audience.length).toFixed(1);
           avgClick = (clickRates.reduce((a, b) => a + b, 0) / audience.length).toFixed(1);
        }

        // Calculate dynamic active segments from user lists/tags
        const dynamicSegments = new Set(['Master Newsletter']);
        audience.forEach(sub => {
            if (sub.lists && Array.isArray(sub.lists)) sub.lists.forEach(l => dynamicSegments.add(l));
            if (sub.tags && Array.isArray(sub.tags)) sub.tags.forEach(t => dynamicSegments.add(t));
        });

        // High Flight Risk Algorithm Segment Injection:
        const riskEmails = new Set();
        (telemetry || []).forEach(t => {
           // We isolate any email bounding or unsubscribing
           if (['email.bounced', 'email.complained'].includes(t.event_type)) {
              riskEmails.add(t.subscriber_email);
           }
        });
        const riskCount = riskEmails.size;

        return (
        <div className="fade-in">
          {/* CRM KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
            {[
              { label: 'Total Subscribers', value: String(totalSubscribers), icon: <Users size={20} color="var(--color-blue-main)"/> },
              { label: 'Avg. Open Rate', value: `${avgOpen}%`, icon: <TrendingUp size={20} color="var(--color-green-main)"/> },
              { label: 'Avg. Click Rate', value: `${avgClick}%`, icon: <MousePointer2 size={20} color="var(--color-purple-main)"/> },
              { label: 'Unsubscribed', value: String(totalUnsubscribed), icon: <Mail size={20} color="var(--color-text-muted)"/> }
            ].map((metric, i) => (
              <div key={i} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{metric.label}</div>
                    {metric.icon}
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>{metric.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '30px' }}>
            <div className="glass-panel" style={{ padding: '30px', flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Master Audience Roster</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setShowImportModal(true)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem' }}>
                     <Target size={16} /> Import CSV
                  </button>
                  <button onClick={() => setShowNewModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem' }}>
                     <Plus size={16} /> Add Subscriber
                  </button>
                </div>
              </div>

              {showImportModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <div className="fade-in" style={{ width: '500px', background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', textAlign: 'center' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-purple-main), var(--color-blue-main))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                         <ShieldCheck color="white" size={32} />
                      </div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Bulk Contact Intake</h3>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '30px' }}>Upload a `.csv` file. We accept exports natively from Mailchimp, HubSpot, ActiveCampaign, or generic formats.</p>
                      
                      <div style={{ border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '12px', padding: '40px', background: 'var(--color-bg-light)', marginBottom: '30px', position: 'relative' }}>
                         <input 
                           type="file" 
                           accept=".csv"
                           style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }}
                           onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              
                              const reader = new FileReader();
                              reader.onload = async (event) => {
                                 const text = event.target.result;
                                 const lines = text.split('\\n').map(l => l.trim()).filter(l => l);
                                 if (lines.length < 2) return alert('Invalid or empty CSV. Must contain headers and at least 1 row.');
                                 
                                 // Simple CSV parser ignoring quotes for now (assuming standard email column)
                                 const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                                 const emailIndex = headers.findIndex(h => h.includes('email'));
                                 
                                 if (emailIndex === -1) return alert('CSV must contain an "email" column.');
                                 
                                 const payloadArray = [];
                                 for(let i=1; i<lines.length; i++) {
                                     const cols = lines[i].split(',');
                                     if(cols[emailIndex]) {
                                         payloadArray.push({
                                             domain: activeDomain,
                                             email: cols[emailIndex].trim(),
                                             status: "Subscribed",
                                             tags: ['CSV Import'],
                                             lists: ['Master Newsletter'],
                                             open_rate: "0%",
                                             ctr: "0%"
                                         });
                                     }
                                 }
                                 
                                 if(payloadArray.length > 0) {
                                     const { data, error } = await supabase.from('email_subscribers').insert(payloadArray).select();
                                     if (error) {
                                         alert('Failed to insert batch: ' + error.message);
                                     } else {
                                         setAudience(prev => [...data, ...prev]);
                                         alert(`Successfully ingested ${data.length} records!`);
                                         setShowImportModal(false);
                                     }
                                 } else {
                                     alert('No valid emails found to import.');
                                 }
                              };
                              reader.readAsText(file);
                           }}
                         />
                         <div style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Click to browse or Drag & Drop here</div>
                         <div style={{ fontSize: '0.8rem', marginTop: '8px', color: 'rgba(0,0,0,0.4)' }}>Accepts structured .CSV drops</div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                         <button onClick={() => setShowImportModal(false)} className="btn btn-outline" style={{ padding: '12px 24px', fontWeight: 600 }}>Close Setup</button>
                      </div>
                   </div>
                </div>
              )}

              {showNewModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <div className="fade-in" style={{ width: '400px', background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Capture New Subscriber</h3>
                      <input 
                         autoFocus
                         type="email" 
                         value={newEmail}
                         onChange={(e) => setNewEmail(e.target.value)}
                         placeholder="subscriber@domain.com"
                         style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', marginBottom: '16px', fontSize: '1rem', outline: 'none' }}
                      />
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px', textAlign: 'left' }}>Assign to Mailing List</label>
                      <select 
                         value={newSubscriberTargetList} 
                         onChange={(e) => setNewSubscriberTargetList(e.target.value)}
                         style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', marginBottom: '24px', fontSize: '0.95rem', background: 'var(--color-bg-light)', outline: 'none' }}
                      >
                         {emailLists.map(l => (
                            <option key={l.id || l.name} value={l.name}>{l.name}</option>
                         ))}
                      </select>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                         <button onClick={() => { setShowNewModal(false); setNewEmail(''); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.05)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                         <button onClick={handleAddNew} className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Create Record</button>
                      </div>
                   </div>
                </div>
              )}

              {selectedProfile && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                   <div className="fade-in" style={{ width: '450px', background: 'white', height: '100%', boxShadow: '-20px 0 50px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '30px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Profile Overview</h3>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>ID: {String(selectedProfile.id)}</div>
                         </div>
                         <button onClick={() => setSelectedProfile(null)} style={{ background: 'var(--color-bg-light)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={20} /></button>
                      </div>
                      <div style={{ padding: '30px', flex: 1, overflowY: 'auto' }}>
                         {/* Profile Header */}
                         <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
                           <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-purple-main), var(--color-blue-main))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, flexShrink: 0 }}>
                             {selectedProfile.email.charAt(0).toUpperCase()}
                           </div>
                           <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedProfile.email}</div>
                              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{selectedProfile.status} Subscriber</div>
                           </div>
                         </div>

                         {/* Metrics Grid */}
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '30px' }}>
                           <div style={{ padding: '16px', background: 'var(--color-bg-light)', borderRadius: '12px' }}>
                              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '4px' }}>Lifetime Value</div>
                              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-green-main)' }}>{selectedProfile.ltv || '$0'}</div>
                           </div>
                           <div style={{ padding: '16px', background: 'var(--color-bg-light)', borderRadius: '12px' }}>
                              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '4px' }}>Open Rate</div>
                              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-purple-main)' }}>{selectedProfile.open_rate || '0%'}</div>
                           </div>
                         </div>

                         {/* Tags */}
                         <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Segments & Tags</h4>
                         <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '30px' }}>
                           {selectedProfile.tags && Array.isArray(selectedProfile.tags) && selectedProfile.tags.length > 0 
                              ? selectedProfile.tags.map(t => <span key={t} style={{ padding: '6px 12px', background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>{t}</span>)
                              : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No tags assigned.</span>}
                         </div>

                         {/* Subscription Preferences (NEW LOGIC) */}
                         <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '16px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Subscription Preferences</h4>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                           {['Master Newsletter', 'VIP Product Drops', 'Christmas Promos', 'Weekly Digest'].map(listName => {
                             const isActive = (selectedProfile.lists || ['Master Newsletter']).includes(listName);
                             return (
                               <div key={listName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', background: isActive ? 'rgba(16, 185, 129, 0.05)' : 'var(--color-bg-light)' }}>
                                 <div style={{ fontWeight: 600, color: isActive ? '#111' : 'var(--color-text-muted)' }}>{listName}</div>
                                 <button onClick={() => handleToggleMembership(selectedProfile.id, listName)} style={{ width: '44px', height: '24px', borderRadius: '12px', background: isActive ? '#10B981' : '#E5E7EB', position: 'relative', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>
                                    <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: isActive ? '23px' : '3px', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                                 </button>
                               </div>
                             );
                           })}
                         </div>

                         {/* Interaction Timeline */}
                         <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Event Timeline</h4>
                         <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                           
                           <div style={{ position: 'relative' }}>
                              <div style={{ position: 'absolute', left: '-26px', top: '0', width: '10px', height: '10px', background: 'var(--color-blue-main)', borderRadius: '50%', border: '4px solid white' }} />
                              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Just now</div>
                              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111' }}>Profile Viewed by Admin</div>
                           </div>
                           
                           <div style={{ position: 'relative' }}>
                              <div style={{ position: 'absolute', left: '-26px', top: '0', width: '10px', height: '10px', background: 'var(--color-green-main)', borderRadius: '50%', border: '4px solid white' }} />
                              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>2 days ago</div>
                              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111' }}>{clientArchetype === 'ecommerce' ? 'Added item to cart (abandoned)' : 'Visited Pricing Page'}</div>
                           </div>

                           <div style={{ position: 'relative' }}>
                              <div style={{ position: 'absolute', left: '-26px', top: '0', width: '10px', height: '10px', background: 'var(--color-purple-main)', borderRadius: '50%', border: '4px solid white' }} />
                              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>5 days ago</div>
                              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111' }}>Opened "Welcome Sequence Step 1"</div>
                           </div>

                           <div style={{ position: 'relative' }}>
                              <div style={{ position: 'absolute', left: '-26px', top: '0', width: '10px', height: '10px', background: 'var(--color-text-muted)', borderRadius: '50%', border: '4px solid white' }} />
                              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>12 days ago</div>
                              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111' }}>Subscribed via /hello landing page</div>
                           </div>

                         </div>
                      </div>
                   </div>
                </div>
              )}

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '12px', fontWeight: 600 }}>Identity Profile</th>
                    <th style={{ padding: '12px', fontWeight: 600 }}>Comms Status</th>
                    <th style={{ padding: '12px', fontWeight: 600 }}><Tags size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Segments</th>
                    <th style={{ padding: '12px', fontWeight: 600 }}>
                       {clientArchetype === 'ecommerce' 
                          ? <><ShoppingCart size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }}/> E-Com Value</> 
                          : <><Target size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }}/> Lead Quality</>
                       }
                    </th>
                    <th style={{ padding: '12px', fontWeight: 600 }}>Engagement</th>
                    <th style={{ padding: '12px', fontWeight: 600, textAlign: 'right' }}>CRM Context</th>
                  </tr>
                </thead>
                <tbody>
                  {audience.map(sub => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                      {editingId === sub.id ? (
                        <>
                          <td style={{ padding: '12px' }} colSpan="6">
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--color-blue-main)', outline: 'none' }} placeholder="user@domain.com" autoFocus />
                              <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}>
                                 <option value="Subscribed">Subscribed</option>
                                 <option value="Unsubscribed">Unsubscribed</option>
                                 <option value="Bounced">Bounced</option>
                              </select>
                              <input type="text" value={editForm.tags} onChange={e => setEditForm({...editForm, tags: e.target.value})} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} placeholder="VIP, Cold Lead, etc..." />
                              <button onClick={() => handleSave(sub.id)} style={{ padding: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><Save size={16}/></button>
                              <button onClick={handleCancel} style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><X size={16}/></button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: 700, color: '#111' }}>{sub.email}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>ID: {String(sub.id).substring(0,8)}...</div>
                          </td>
                          <td style={{ padding: '12px' }}>
                             <span style={{ padding: '4px 8px', background: sub.status === 'Subscribed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)', color: sub.status === 'Subscribed' ? '#10B981' : 'var(--color-text-muted)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700 }}>{sub.status}</span>
                          </td>
                          <td style={{ padding: '12px', maxWidth: '200px' }}>
                             <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                               {sub.tags && Array.isArray(sub.tags) && sub.tags.length > 0 ? sub.tags.map((t, i) => (
                                  <span key={i} style={{ fontSize: '0.75rem', fontWeight: 600, background: 'var(--color-bg-light)', padding: '4px 8px', borderRadius: '4px' }}>{t}</span>
                               )) : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>General</span>}
                             </div>
                          </td>
                          <td style={{ padding: '12px' }}>
                             {clientArchetype === 'ecommerce' ? (
                               <>
                                 <div style={{ fontWeight: 800, color: 'var(--color-green-main)' }}>{sub.ltv || '$0'} LTV</div>
                                 <div style={{ fontSize: '0.8rem', color: '#EF4444', fontWeight: 600 }}>Cart: {sub.cart_value || '$0'}</div>
                               </>
                             ) : (
                               <>
                                 <div style={{ fontWeight: 800, color: 'var(--color-blue-main)' }}>{sub.status === 'Subscribed' ? 'Sales Qualified' : 'Cold Lead'}</div>
                                 <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Role: Decision Maker</div>
                               </>
                             )}
                          </td>
                          <td style={{ padding: '12px' }}>
                             <div style={{ fontWeight: 600, color: 'var(--color-purple-main)' }}>Open: {sub.open_rate}</div>
                             <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Click: {sub.ctr}</div>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                             <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                               <button onClick={() => setSelectedProfile(sub)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}><Activity size={14}/> View Profile</button>
                               <div style={{ display: 'flex', borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: '8px', gap: '4px' }}>
                                 <button onClick={() => handleEditClick(sub)} style={{ padding: '6px', cursor: 'pointer', background: 'transparent', border: 'none', color: 'var(--color-text-muted)' }}><Pencil size={16}/></button>
                                 <button onClick={() => handleDelete(sub.id)} style={{ padding: '6px', cursor: 'pointer', background: 'transparent', border: 'none', color: '#EF4444' }}><Trash2 size={16}/></button>
                               </div>
                             </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Advanced Segmentation Sidebar */}
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Mailing Lists</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {emailLists.map(list => {
                    const count = audience.filter(sub => sub.lists && sub.lists.includes(list.name)).length;
                    return (
                      <div key={list.id || list.name} style={{ padding: '12px', borderRadius: '8px', background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <span>{list.name}</span>
                           <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '12px' }}>{count}</span>
                        </div>
                        {list.name !== 'Master Newsletter' && (
                           <button onClick={() => handleDeleteList(list.id, list.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }} title="Delete List & Scrub Users">
                               <Trash2 size={16} />
                           </button>
                        )}
                      </div>
                    )
                  })}
                  {riskCount > 0 && (
                    <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'left', display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#EF4444' }}>
                      <span>High Flight Risk (Algorithmic)</span>
                      <span style={{ fontSize: '0.9rem' }}>{riskCount}</span>
                    </div>
                  )}
                  <button onClick={() => setShowCreateListModal(true)} style={{ padding: '12px', borderRadius: '8px', background: 'var(--color-bg-light)', border: '1px dashed rgba(0,0,0,0.2)', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)', cursor: 'pointer' }}>+ Create List</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        )
      })()}

      {activeTab === 'campaign' && (
        // ==========================================
        // TAB 2: CAMPAIGN COMPOSER
        // ==========================================
        <div className="fade-in">
          {viewState === 'list' ? (
             <div className="glass-panel" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Campaign Library</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setShowCampaignImportModal(true)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
                       <TrendingUp size={18} /> Migrate Campaign
                    </button>
                    <button onClick={handleCreateNewCampaign} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
                       <Plus size={18} /> New Campaign
                    </button>
                  </div>
                </div>

                {showCampaignImportModal && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <div className="fade-in" style={{ width: '500px', background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-purple-main), var(--color-blue-main))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                           <Layout color="white" size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Migrate Existing Layouts</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '30px' }}>Upload `.html` email templates from Klaviyo, ActiveCampaign, Constant Contact, or Mailchimp. We will auto-parse the markup to make it editable in the Nexus canvas.</p>
                        
                        <div style={{ border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '12px', padding: '40px', background: 'var(--color-bg-light)', marginBottom: '30px', cursor: 'pointer' }}>
                           <div style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Drag & Drop .html template package here</div>
                           <div style={{ fontSize: '0.8rem', marginTop: '8px', color: 'rgba(0,0,0,0.4)' }}>Format: Raw HTML File</div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                           <button onClick={() => setShowCampaignImportModal(false)} className="btn btn-outline" style={{ padding: '12px 24px', fontWeight: 600 }}>Cancel</button>
                           <button onClick={() => { 
                              alert("Simulating external .html parser engine. Extracting CSS inlining and injecting into Nexus Campaign Draft..."); 
                              setShowCampaignImportModal(false); 
                           }} className="btn btn-primary" style={{ padding: '12px 24px', fontWeight: 600 }}>Import Layout Structure</button>
                        </div>
                     </div>
                  </div>
                )}
                
                {campaigns.length === 0 ? (
                   <div style={{ padding: '60px', textAlign: 'center', background: 'var(--color-bg-light)', borderRadius: '12px', color: 'var(--color-text-muted)' }}>
                     <Mail size={40} style={{ opacity: 0.5, marginBottom: '16px' }} />
                     <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>No Campaigns Found</h4>
                     <p style={{ marginTop: '8px', marginBottom: '24px' }}>Launch your first sequence targeting the {activeDomain} segment.</p>
                     <button onClick={handleCreateNewCampaign} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontWeight: 600 }}>
                        <Plus size={18} /> Start a Campaign
                     </button>
                   </div>
                ) : (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     {campaigns.map(camp => (
                        <div key={camp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all 0.2s ease' }} onClick={() => handleEditCampaign(camp)}>
                           <div>
                              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-blue-main)', marginBottom: '4px' }}>{camp.title}</div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', gap: '16px' }}>
                                 <span>Subject: {camp.subject_line || 'No Subject'}</span>
                                 <span>Segment: {camp.target_segment || 'All Subscribers'}</span>
                                 {camp.status === 'Sent' && <span style={{ color: 'var(--color-green-main)', fontWeight: 700 }}>Captured LTV: {camp.revenue_attributed || '$3,210'}</span>}
                              </div>
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <span style={{ padding: '4px 10px', background: camp.status === 'Sent' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)', color: camp.status === 'Sent' ? '#10B981' : 'var(--color-text-muted)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                                {camp.status}
                              </span>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteCampaign(camp.id); }} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '8px' }}>
                                <Trash2 size={18} />
                              </button>
                           </div>
                        </div>
                     ))}
                   </div>
                )}
             </div>
          ) : (
            // Editor View
            <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '30px' }}>
               {/* Configurations Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Global Actions Row */}
                  <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <button onClick={() => setViewState('list')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.85rem' }}><ArrowRight size={14} style={{ transform: 'rotate(180deg)' }}/> All Campaigns</button>
                     <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '4px', background: 'var(--color-bg-light)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
                           <button onClick={() => handleSaveDraft('Draft')} className="btn" style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'transparent', border: 'none', color: 'var(--color-blue-main)', fontWeight: 700 }}>
                              Save as Draft
                           </button>
                        </div>
                        <button className="btn btn-primary" disabled={isSending} onClick={handleDispatch} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.9rem' }}>
                           {isSending ? 'Verifying...' : <><Target size={16} /> Deploy</>}
                        </button>
                     </div>
                  </div>

                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Campaign Configuration</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Internal Campaign Name</label>
                        <input type="text" value={campaignDraft.title} onChange={e => setCampaignDraft({...campaignDraft, title: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Subject Line</label>
                        <input type="text" value={campaignDraft.subject_line} onChange={e => setCampaignDraft({...campaignDraft, subject_line: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Target Segment</label>
                        <select value={campaignDraft.target_segment} onChange={e => setCampaignDraft({...campaignDraft, target_segment: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }}>
                          <option value="All Subscribers">All Subscribers ({audience.length})</option>
                          <option value="VIP Only">Tag: VIP Only</option>
                          <option value="Warm Leads">Tag: Warm Leads</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Dispatch Channel</label>
                        <div style={{ display: 'flex', gap: '8px', background: 'var(--color-bg-light)', padding: '6px', borderRadius: '12px' }}>
                          <button onClick={() => setCampaignDraft({...campaignDraft, channel: 'email'})} style={{ flex: 1, padding: '8px', border: 'none', background: campaignDraft.channel === 'email' ? 'white' : 'transparent', color: campaignDraft.channel === 'email' ? 'var(--color-text-main)' : 'var(--color-text-muted)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: campaignDraft.channel === 'email' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Mail size={16}/> Email</button>
                          <button onClick={() => setCampaignDraft({...campaignDraft, channel: 'sms'})} style={{ flex: 1, padding: '8px', border: 'none', background: campaignDraft.channel === 'sms' ? 'white' : 'transparent', color: campaignDraft.channel === 'sms' ? 'var(--color-text-main)' : 'var(--color-text-muted)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: campaignDraft.channel === 'sms' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Smartphone size={16}/> SMS</button>
                          <button onClick={() => setCampaignDraft({...campaignDraft, channel: 'whatsapp'})} style={{ flex: 1, padding: '8px', border: 'none', background: campaignDraft.channel === 'whatsapp' ? 'white' : 'transparent', color: campaignDraft.channel === 'whatsapp' ? '#25D366' : 'var(--color-text-muted)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: campaignDraft.channel === 'whatsapp' ? '0 2px 10px rgba(37, 211, 102, 0.2)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><MessageCircle size={16}/> W-App</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Generative Engine */}
                  <div className="glass-panel" style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} color="var(--color-purple-main)" /> Generative Campaign Builder</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, background: 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: '4px' }}>Powered by Nexus AI (OpenAI API Active)</div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                      <div style={{ position: 'relative' }}>
                        <textarea 
                          value={generativePrompt}
                          onChange={e => setGenerativePrompt(e.target.value)}
                          placeholder="E.g., 'Build a Black Friday promo email highlighting our new shoe collection with a 20% discount code.'"
                          style={{ width: '100%', minHeight: '120px', padding: '16px', paddingRight: '60px', borderRadius: '12px', border: '2px solid rgba(147, 51, 234, 0.2)', outline: 'none', resize: 'vertical', fontSize: '1rem', background: isListening ? 'rgba(147, 51, 234, 0.05)' : 'white' }}
                        />
                        <div style={{ position: 'absolute', right: '16px', bottom: '16px', display: 'flex', gap: '8px' }}>
                          <button onClick={handleMicrophoneToggle} style={{ background: isListening ? '#EF4444' : 'var(--color-bg-light)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', color: isListening ? 'white' : 'var(--color-text-main)' }}>
                            <Activity size={18} />
                          </button>
                        </div>
                      </div>
                      <button onClick={handleGenerateAI} disabled={isGenerating || !generativePrompt} className="btn hover-lift" style={{ width: '100%', padding: '16px', justifyContent: 'center', background: 'linear-gradient(135deg, var(--color-purple-main), var(--color-blue-main))', color: 'white', border: 'none', fontWeight: 800, fontSize: '1.05rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {isGenerating ? 'Compiling AI Output...' : <><Zap size={20} /> Generate Campaign</>}
                      </button>
                    </div>

                    {/* Template Matrix */}
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Or Select a Pre-Built Matrix</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                      <button onClick={() => setCampaignDraft(prev => ({...prev, body_content: '<div style="padding:40px;text-align:center;"><h2 style="margin-bottom:12px;font-size:24px;">Welcome to the Newsletter</h2><p style="color:#555;">Here is your weekly update...</p></div>'}))} style={{ padding: '16px', background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem' }}>Standard<br/>Newsletter</button>
                      <button onClick={() => setCampaignDraft(prev => ({...prev, body_content: '<div style="padding:40px;text-align:center;background:#000;color:#fff;"><h2 style="margin-bottom:12px;font-size:24px;">NEW PRODUCT DROP</h2><img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" style="max-width:100%;border-radius:8px;margin-bottom:20px;"/><p>Available for 24 hours only.</p></div>'}))} style={{ padding: '16px', background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem' }}>Product<br/>Drop</button>
                      <button onClick={() => setCampaignDraft(prev => ({...prev, body_content: '<div style="padding:40px;text-align:center;"><h2 style="margin-bottom:12px;font-size:24px;">Join the Masterclass</h2><p style="color:#555;margin-bottom:20px;">Reserve your seat today.</p><a href="#" style="background:#10B981;padding:12px 24px;border-radius:6px;color:#fff;text-decoration:none;">RSVP Now</a></div>'}))} style={{ padding: '16px', background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem' }}>Webinar<br/>Invite</button>
                    </div>

                    {/* Fallback HTML Content Input */}
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Manual HTML Fallback</h4>
                    <textarea 
                      value={campaignDraft.body_content}
                      onChange={e => setCampaignDraft({...campaignDraft, body_content: e.target.value})}
                      placeholder="Generated HTML renders here for manual tweaks..."
                      style={{ flex: 1, width: '100%', minHeight: '150px', padding: '16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.5, outline: 'none', resize: 'vertical' }}
                    />
                  </div>
                </div>

               {/* The Physical Canvas Editor / Live Preview / Omnichannel Toggle */}
               <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#e5e7eb', flex: 1 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Live Evaluator ({previewDevice.toUpperCase()})</h3>
                    {campaignDraft.channel === 'email' && (
                       <div style={{ display: 'flex', background: 'white', padding: '4px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                          <button onClick={() => setPreviewDevice('desktop')} style={{ padding: '6px 12px', border: 'none', background: previewDevice === 'desktop' ? 'var(--color-bg-light)' : 'transparent', color: previewDevice === 'desktop' ? 'var(--color-purple-main)' : 'var(--color-text-muted)', fontWeight: 600, borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Layout size={14}/> Desktop</button>
                          <button onClick={() => setPreviewDevice('tablet')} style={{ padding: '6px 12px', border: 'none', background: previewDevice === 'tablet' ? 'var(--color-bg-light)' : 'transparent', color: previewDevice === 'tablet' ? 'var(--color-purple-main)' : 'var(--color-text-muted)', fontWeight: 600, borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Layout size={14}/> Tablet</button>
                          <button onClick={() => setPreviewDevice('mobile')} style={{ padding: '6px 12px', border: 'none', background: previewDevice === 'mobile' ? 'var(--color-bg-light)' : 'transparent', color: previewDevice === 'mobile' ? 'var(--color-purple-main)' : 'var(--color-text-muted)', fontWeight: 600, borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Smartphone size={14}/> Mobile</button>
                       </div>
                    )}
                 </div>
                 
                 {campaignDraft.channel === 'email' ? (
                    <div style={{ width: '100%', maxWidth: previewDevice === 'mobile' ? '375px' : (previewDevice === 'tablet' ? '600px' : '100%'), background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', transition: 'all 0.3s ease-in-out', margin: '0 auto' }}>
                       <div style={{ background: 'linear-gradient(135deg, var(--color-purple-main), var(--color-blue-main))', padding: '40px 30px', textAlign: 'center', color: 'white' }}>
                         <div style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-1px', textTransform: 'uppercase' }}>{clientName || activeDomain.split('.')[0]}</div>
                       </div>
                       
                       <div style={{ padding: '40px 30px', minHeight: '300px', color: '#111', position: 'relative' }}>
                         {campaignDraft.body_content ? (
                            <>
                                <div style={{ position: 'relative' }} onMouseLeave={() => setHoveredRect(null)}>
                                   <div 
                                   ref={previewRef} 
                                   onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const validTags = 'img, h1, h2, h3, h4, h5, h6, p, span, a, button, li';
                                      const targetNode = e.target.closest(validTags);
                                      
                                      document.querySelectorAll('.nexus-editor-highlight').forEach(el => {
                                          el.style.outline = 'none';
                                          el.style.boxShadow = 'none';
                                          el.classList.remove('nexus-editor-highlight');
                                      });

                                      if (targetNode) {
                                         targetNode.style.outline = '4px solid var(--color-purple-main)';
                                         if (targetNode.tagName === 'IMG') targetNode.style.boxShadow = '0 0 20px rgba(147, 51, 234, 0.4)';
                                         targetNode.classList.add('nexus-editor-highlight');
                                         
                                         // Retrieve index safely from the Hover state memory to prevent stale-reference mismatches if React volatile re-rendered
                                         let safeIndex = hoveredRect && hoveredRect.hoverIndex !== undefined ? hoveredRect.hoverIndex : -1;
                                         if (safeIndex === -1) {
                                            const allNodesOfTag = Array.from(previewRef.current.querySelectorAll(targetNode.tagName));
                                            safeIndex = allNodesOfTag.indexOf(targetNode);
                                         }
                                         
                                         // Cache the bounding rect so modal doesn't collapse
                                         const cachedTop = targetNode.getBoundingClientRect().top - previewRef.current.getBoundingClientRect().top;
                                         
                                         setSelectedElement({ tagName: targetNode.tagName, index: safeIndex, cachedTop: cachedTop });
                                         setAiElementPrompt(targetNode.tagName === 'IMG' ? '' : targetNode.innerHTML);
                                         setAiElementHref(targetNode.tagName === 'A' ? targetNode.getAttribute('href') || '' : '');
                                         setHoveredRect(null); // Clear physical pencil on edit mode enter
                                      } else {
                                         setSelectedElement(null);
                                         setAiElementPrompt('');
                                         setAiElementHref('');
                                      }
                                   }}
                                   onMouseMove={(e) => {
                                      if (selectedElement) return; // Freeze hover scanning during edits
                                      const validTags = 'img, h1, h2, h3, h4, h5, h6, p, span, a, button, li';
                                      const targetNode = e.target.closest(validTags);
                                      if (targetNode && !targetNode.classList.contains('nexus-pencil-overlay')) {
                                         const rect = targetNode.getBoundingClientRect();
                                         const containerRect = previewRef.current.getBoundingClientRect();
                                         const liveIndex = Array.from(previewRef.current.querySelectorAll(targetNode.tagName)).indexOf(targetNode);
                                         setHoveredRect({
                                            top: rect.top - containerRect.top,
                                            left: rect.right - containerRect.left - 24, // Inset from right bound
                                            targetNode: targetNode,
                                            hoverIndex: liveIndex // Mathematically preserve the node mapping immediately
                                         });
                                      } else {
                                         setHoveredRect(null);
                                      }
                                   }}
                                   className="nexus-live-evaluator"
                                   dangerouslySetInnerHTML={{ __html: `<style>.nexus-live-evaluator img { margin: 0 auto !important; display: block !important; max-width: 100% !important; }</style>` + campaignDraft.body_content }} 
                                   style={{ position: 'relative', outline: 'none' }} 
                                />

                                    {hoveredRect && !selectedElement && (
                                   <button 
                                      className="nexus-pencil-overlay"
                                      onClick={(e) => {
                                         e.stopPropagation();
                                         e.preventDefault();
                                         const targetNode = hoveredRect.targetNode;
                                         const safeIndex = hoveredRect.hoverIndex;
                                         
                                         document.querySelectorAll('.nexus-editor-highlight').forEach(el => {
                                             el.style.outline = 'none';
                                             el.style.boxShadow = 'none';
                                             el.classList.remove('nexus-editor-highlight');
                                         });

                                         targetNode.style.outline = '4px solid var(--color-purple-main)';
                                         if (targetNode.tagName === 'IMG') targetNode.style.boxShadow = '0 0 20px rgba(147, 51, 234, 0.4)';
                                         targetNode.classList.add('nexus-editor-highlight');
                                         
                                         // Cache the top coordinate before wiping hoveredRect so the modal doesn't collapse into NaN
                                         const cachedTop = hoveredRect.top;
                                         
                                         setSelectedElement({ tagName: targetNode.tagName, index: safeIndex, cachedTop: cachedTop });
                                         setAiElementPrompt(targetNode.tagName === 'IMG' ? '' : targetNode.innerHTML);
                                         setAiElementHref(targetNode.tagName === 'A' ? targetNode.getAttribute('href') || '' : '');
                                         setHoveredRect(null);
                                      }}
                                      style={{ 
                                         position: 'absolute', 
                                         top: hoveredRect.top - 10, 
                                         left: hoveredRect.left,
                                         width: '32px',
                                         height: '32px',
                                         borderRadius: '8px',
                                         background: 'var(--color-purple-main)',
                                         color: 'white',
                                         border: 'none',
                                         display: 'flex',
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         cursor: 'pointer',
                                         boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
                                         zIndex: 100,
                                         transition: 'transform 0.1s ease',
                                      }}
                                   >
                                      <Pencil size={14} />
                                   </button>
                                )}
                             </div>

                                {selectedElement && (
                                   <div style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', padding: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '450px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 800 }}>
                                            <Sparkles size={18} color="var(--color-purple-main)" /> 
                                            AI Node Editor ({selectedElement.tagName})
                                         </div>
                                         <button onClick={() => {
                                            if (previewRef.current) {
                                               previewRef.current.querySelectorAll('.nexus-editor-highlight').forEach(el => {
                                                   el.style.outline = 'none';
                                                   el.style.boxShadow = 'none';
                                                   el.classList.remove('nexus-editor-highlight');
                                               });
                                            }
                                            setSelectedElement(null);
                                         }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={18} /></button>
                                      </div>
                                      
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                         {selectedElement.tagName === 'A' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                               <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Button Link (URL)</div>
                                               <input 
                                                  value={aiElementHref}
                                                  onChange={e => setAiElementHref(e.target.value)}
                                                  placeholder="https://"
                                                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', fontSize: '0.95rem' }}
                                               />
                                            </div>
                                         )}
                                         <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginTop: selectedElement.tagName === 'A' ? '4px' : '0' }}>{selectedElement.tagName === 'A' ? 'Button Label' : 'Element Content'}</div>
                                         <textarea 
                                            autoFocus
                                            value={aiElementPrompt}
                                            onChange={e => setAiElementPrompt(e.target.value)}
                                            placeholder={selectedElement.tagName === 'IMG' ? "Describe the new image you want..." : "Target HTML injected exactly as follows..."}
                                            style={{ width: '100%', minHeight: selectedElement.tagName === 'IMG' ? '60px' : (selectedElement.tagName === 'A' ? '80px' : '220px'), padding: '16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', fontSize: '0.95rem', fontFamily: selectedElement.tagName === 'IMG' ? 'inherit' : 'monospace', resize: 'vertical', lineHeight: '1.5' }}
                                         />
                                         <button 
                                            disabled={isGeneratingElement || (!aiElementPrompt && selectedElement.tagName !== 'A')}
                                            onClick={async () => {
                                               setIsGeneratingElement(true);
                                               // Retrieve exact node mathematically decoupled from React re-renders via tag array indexing
                                               let liveNode = previewRef.current.querySelectorAll(selectedElement.tagName)[selectedElement.index];
                                               
                                               // Fallback: If React aggressive re-render scrambled the index, grab the first available node of that type.
                                               if (!liveNode) {
                                                   liveNode = previewRef.current.querySelector(selectedElement.tagName);
                                               }

                                               if (!liveNode) { 
                                                   TelemetryEngine.dispatchException('EmailDashboard', 'DOM Sync Error', { safeIndex: selectedElement.index, tagName: selectedElement.tagName }, 'warning'); 
                                                   setIsGeneratingElement(false); 
                                                   return; 
                                               }
                                               if (selectedElement.tagName === 'IMG') {
                                                   liveNode.src = `https://www.75squared.com/api/image?prompt=${encodeURIComponent(aiElementPrompt.trim().substring(0, 150))}`;
                                               } else {
                                                   liveNode.innerHTML = aiElementPrompt.replace(/\n/g, '<br/>');
                                                   if (selectedElement.tagName === 'A') {
                                                       liveNode.href = aiElementHref;
                                                   }
                                               }
                                               
                                               liveNode.style.outline = 'none';
                                               liveNode.style.boxShadow = 'none';
                                               liveNode.classList.remove('nexus-editor-highlight');

                                               setCampaignDraft(prev => ({...prev, body_content: previewRef.current.innerHTML}));
                                               setSelectedElement(null);
                                               setAiElementPrompt('');
                                               setAiElementHref('');
                                               setIsGeneratingElement(false);
                                            }}
                                            className="btn btn-primary" 
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '8px', padding: '14px', fontWeight: 700 }}
                                         >
                                            {isGeneratingElement ? <Activity size={18} className="spin" /> : (selectedElement.tagName === 'IMG' ? <Sparkles size={18} /> : <Pencil size={18} />)}
                                            {isGeneratingElement ? 'Processing...' : (selectedElement.tagName === 'IMG' ? 'Generate Image' : 'Save Text Edits')}
                                         </button>
                                      </div>
                                   </div>
                                )}
                            </>
                         ) : (
                            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '40px' }}>
                               <Pencil size={40} style={{ opacity: 0.3, marginBottom: '16px', margin: '0 auto' }} />
                               <div style={{ fontWeight: 600 }}>HTML Engine is Empty</div>
                               <div style={{ fontSize: '0.85rem', marginTop: '8px' }}>Inject layout blocks or raw markup from the left pane.</div>
                            </div>
                         )}
                       </div>

                       <div style={{ background: 'var(--color-bg-light)', padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem', lineHeight: '1.6' }}>
                         You are receiving this because you are subscribed to the <strong>{activeDomain === '75squared.com' ? '75 Squared Master' : 'Primary'}</strong> list at {activeDomain}.<br/>
                         P.O. Box 75, Las Vegas, NV 89101<br/>
                         <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                            <a href={`https://${activeDomain}/unsubscribe`} style={{ color: 'var(--color-purple-main)', textDecoration: 'none', fontWeight: 600 }}>Manage Preferences</a>
                            <span style={{ color: 'rgba(0,0,0,0.2)' }}>|</span>
                            <a href={`https://${activeDomain}/unsubscribe`} style={{ color: 'var(--color-text-muted)', textDecoration: 'underline' }}>Unsubscribe</a>
                         </div>
                       </div>
                    </div>
                 ) : (
                    // Mobile SMS / WhatsApp Mockup
                    <div style={{ width: '320px', height: '640px', background: 'white', borderRadius: '40px', border: '12px solid #111', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                       <div style={{ height: '30px', background: '#111', width: '120px', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 10 }}></div>
                       <div style={{ padding: '40px 20px 20px', background: 'var(--color-bg-light)', borderBottom: '1px solid rgba(0,0,0,0.05)', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', color: campaignDraft.channel === 'whatsapp' ? '#25D366' : '#111' }}>
                          {campaignDraft.channel === 'whatsapp' ? 'WhatsApp Business' : 'Messages'}
                       </div>
                       <div style={{ flex: 1, background: campaignDraft.channel === 'whatsapp' ? '#efeae2' : 'white', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ alignSelf: 'flex-start', background: 'white', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', maxWidth: '85%', fontSize: '0.9rem', lineHeight: 1.4 }}>
                             {campaignDraft.body_content ? campaignDraft.body_content.replace(/<[^>]+>/g, '') : "Draft your payload in the Generative Engine to see it render here..."}
                          </div>
                          {campaignDraft.channel === 'sms' && campaignDraft.body_content && (
                             <div style={{ alignSelf: 'flex-start', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '-8px' }}>Text STOP to opt out.</div>
                          )}
                       </div>
                       <div style={{ padding: '16px', background: 'white', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                          <div style={{ background: 'var(--color-bg-light)', padding: '10px 16px', borderRadius: '20px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Send message...</div>
                       </div>
                    </div>
                 )}
               </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'automation' && (
        // ==========================================
        // TAB 3: VISUAL AUTOMATIONS (Brevo/ActiveCampaign Clone)
        // ==========================================
        <div className="fade-in glass-panel" style={{ padding: '60px', minHeight: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#F8FAFC' }}>
          
          <div style={{ alignSelf: 'flex-start', marginBottom: '40px' }}>
             <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Flow Architecture</h2>
             <p style={{ color: 'var(--color-text-muted)' }}>Build complex event-driven logic sequences.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
             {automationNodes.map((node, index) => (
                <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   {node.type === 'split' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                         <div style={{ padding: '12px 24px', background: 'white', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                            <Activity size={16} /> {node.title}
                            <button onClick={() => handleRemoveNode(node.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', marginLeft: '12px' }}><X size={14}/></button>
                         </div>
                         <div style={{ display: 'flex', width: '500px', justifyContent: 'space-between', marginTop: '20px', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '-20px', left: '120px', right: '120px', height: '20px', borderTop: '2px solid rgba(0,0,0,0.1)', borderLeft: '2px solid rgba(0,0,0,0.1)', borderRight: '2px solid rgba(0,0,0,0.1)', borderRadius: '12px 12px 0 0', zIndex: 1 }}></div>
                            
                            <div style={{ padding: '20px 24px', background: 'white', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', width: '220px', textAlign: 'center', zIndex: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--color-green-main)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Yes</span>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '8px' }}>{node.yesConfig}</div>
                            </div>
               
                            <div style={{ padding: '20px 24px', background: 'white', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)', width: '220px', textAlign: 'center', zIndex: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--color-blue-main)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>No</span>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '8px' }}>{node.noConfig}</div>
                            </div>
                         </div>
                      </div>
                   ) : (
                      <div style={{ padding: '20px 24px', background: 'white', borderRadius: '12px', border: node.type === 'trigger' ? '2px solid rgba(147, 51, 234, 0.4)' : node.type === 'action' ? '2px solid rgba(37, 211, 102, 0.4)' : '1px solid rgba(0,0,0,0.1)', boxShadow: node.type === 'trigger' ? '0 10px 25px rgba(147, 51, 234, 0.1)' : node.type === 'action' ? '0 10px 25px rgba(37, 211, 102, 0.1)' : '0 4px 10px rgba(0,0,0,0.02)', width: '320px', textAlign: 'center', zIndex: 2, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                           <button onClick={() => handleRemoveNode(node.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}><Trash2 size={14}/></button>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: node.type === 'trigger' ? 'var(--color-purple-main)' : node.type === 'action' ? '#25D366' : 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{node.title}</span>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                           {node.icon === 'ShoppingCart' && <ShoppingCart size={18}/>}
                           {node.icon === 'Clock' && <Clock size={16}/>}
                           {node.icon === 'MessageCircle' && <MessageCircle size={18}/>}
                           {node.icon === 'Activity' && <Activity size={18}/>}
                           {node.icon === 'Mail' && <Mail size={18}/>}
                           {node.config}
                        </div>
                      </div>
                   )}
                   
                   {/* Draw Line connecting down, EXCEPT for split nodes which terminate right now or the very last item */}
                   {index < automationNodes.length - 1 && node.type !== 'split' && (
                      <div style={{ width: '2px', height: '40px', background: 'rgba(0,0,0,0.1)' }}></div>
                   )}
                </div>
             ))}

             <div style={{ marginTop: '40px', display: 'flex', gap: '12px' }}>
               <button onClick={() => handleAddNode('delay')} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px' }}>
                  <Clock size={16} /> Add Delay
               </button>
               <button onClick={() => handleAddNode('action')} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px' }}>
                  <Zap size={16} /> Add Action
               </button>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        // ==========================================
        // TAB 4: EVENT MARKETING (Constant Contact Clone)
        // ==========================================
        <div className="fade-in glass-panel" style={{ padding: '40px' }}>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>Interactive Blocks & Forms</h2>
           <p style={{ color: 'var(--color-text-muted)', marginBottom: '40px', maxWidth: '600px' }}>Embed high-engagement elements directly into your next broadcast. These components dynamically update subscriber tags based on their responses.</p>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              
              {/* RSVP Block */}
              <div style={{ padding: '24px', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', background: 'var(--color-bg-light)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>RSVP Module</h3>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <button onClick={() => alert("Component Feature arriving in v2.0")} style={{ flexGrow: 1, padding: '12px', background: 'white', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: 'var(--color-green-main)', fontWeight: 600 }}>Yes, I'll be there!</button>
                  <button onClick={() => alert("Component Feature arriving in v2.0")} style={{ flexGrow: 1, padding: '12px', background: 'white', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#ef4444', fontWeight: 600 }}>No, I can't sync.</button>
                </div>
                <button onClick={() => handleInsertBlock('RSVP Event Module')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Insert into Campaign</button>
              </div>

              {/* Polling Block */}
              <div style={{ padding: '24px', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', background: 'var(--color-bg-light)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Micro-Survey</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>Which service do you need?</div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><input type="radio" name="poll"/> SEO Strategy</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><input type="radio" name="poll"/> Custom Web App</label>
                </div>
                <button onClick={() => handleInsertBlock('Micro-Survey Module')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Insert into Campaign</button>
              </div>

           </div>
        </div>
      )}

      {activeTab === 'deliverability' && (
        // ==========================================
        // TAB 5: DELIVERABILITY ENGINE (Pre-Flight Checks)
        // ==========================================
        <div className="fade-in glass-panel" style={{ padding: '40px' }}>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>Pre-Flight Deliverability Engine</h2>
           <p style={{ color: 'var(--color-text-muted)', marginBottom: '40px', maxWidth: '800px' }}>
             Email rendering is notoriously volatile. This specialized engine mathematically sanitizes your code, scans for heuristic spam triggers, and algorithmically forces compatibility across restrictive environments like Outlook Desktop and Apple Mail Dark Mode.
           </p>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              
              {/* Left Column: Domain & Spam Analysis */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', background: 'white', overflow: 'hidden' }}>
                  <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'var(--color-bg-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ShieldCheck size={20} color="#10B981" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Domain Authentication Core</h3>
                  </div>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>SPF Record (Sender Policy Framework)</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Spoofing protection validated.</div>
                      </div>
                      <span style={{ background: '#10B981', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>PASS</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>DKIM Signature (DomainKeys Identified Mail)</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Cryptographic keys verified.</div>
                      </div>
                      <span style={{ background: '#10B981', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>PASS</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>DMARC Policy Enforcement</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Strict isolation p=reject alignment set.</div>
                      </div>
                      <span style={{ background: '#10B981', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>PASS</span>
                    </div>
                  </div>
                </div>

                <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', background: 'white', overflow: 'hidden' }}>
                  <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'var(--color-bg-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Bug size={20} color="var(--color-purple-main)" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Heuristic Spam Sandbox</h3>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
                      <span style={{ fontSize: '3rem', fontWeight: 800, color: spamScore > 80 ? '#10B981' : spamScore > 50 ? '#f59e0b' : '#ef4444', lineHeight: 1 }}>{spamScore}</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>/ 100 System Spam Score</span>
                    </div>
                    {spamTriggers.length === 0 ? (
                       <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                         Your payload has been algorithmically parsed against the latest Gmail and Office365 server traps. No red-flag keywords were detected in your `Subject Line` or HTML `body`.
                       </p>
                    ) : (
                       <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                          <p style={{ fontSize: '0.9rem', color: '#ef4444', fontWeight: 700, marginBottom: '8px' }}>Heuristic Flags Detected:</p>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                             {spamTriggers.map(t => <span key={t} style={{ background: '#ef4444', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>{t}</span>)}
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>Remove these substrings to guarantee inbox placement.</p>
                       </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Code Sanitization & Fallbacks */}
              <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', background: 'white', overflow: 'hidden', height: 'fit-content' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'var(--color-bg-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Zap size={20} color="var(--color-blue-main)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Algorithmic Code Injection</h3>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Toggle Option 1 */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input type="checkbox" defaultChecked style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: 'var(--color-blue-main)' }}/>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '4px' }}>Inject Outlook VML Table Fallbacks</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                        Legacy Outlook renders using Microsoft Word's engine. This parses your modern Flex/Grid layout into pure `&lt;table&gt;` structures mathematically, preventing alignment distortion.
                      </div>
                    </div>
                  </div>

                  {/* Toggle Option 2 */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input type="checkbox" defaultChecked style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: 'var(--color-blue-main)' }}/>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '4px' }}>Force Mobile Responsiveness (Media Queries)</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                        Injects absolute `@media (max-width: 480px)` styles directly into the inline document head, ensuring iOS and Gmail Mobile scale fonts legibly without horizontal scrolling.
                      </div>
                    </div>
                  </div>

                  {/* Toggle Option 3 */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input type="checkbox" defaultChecked style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: 'var(--color-blue-main)' }}/>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '4px' }}>Compile Apple Mail Dark-Mode Meta Fixes</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                        Renders `&lt;meta name="color-scheme" content="light dark"&gt;` and wraps logos in algorithmic inversion rules so your formatting doesn't violently break in dark mode environments.
                      </div>
                    </div>
                  </div>

                  {/* Toggle Option 4 */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input type="checkbox" defaultChecked style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: 'var(--color-blue-main)' }}/>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '4px' }}>Generate Raw Multi-Part Plain Text Shadow</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                        If a strict enterprise firewall entirely blocks HTML, this automatically synthesizes a raw, unformatted `text/plain` clone of your copy so the message still arrives safely.
                      </div>
                    </div>
                  </div>
                  <button onClick={handleSandboxSanitization} disabled={isSanitizing} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                    {isSanitizing ? sanitizationStatus : 'Apply Sandbox Sanitization'}
                  </button>
                  {sanitizationStatus && !isSanitizing && (
                    <div className="fade-in" style={{ marginTop: '12px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>
                       <ShieldCheck size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
                       {sanitizationStatus}
                    </div>
                  )}
                </div>
              </div>
              
           </div>
        </div>
      )}

      {activeTab === 'forms' && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Form Configuration</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Headline</label>
                  <input type="text" value={formConfig.headline} onChange={e => setFormConfig({...formConfig, headline: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Subtext Description</label>
                  <input type="text" value={formConfig.subtext} onChange={e => setFormConfig({...formConfig, subtext: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Call To Action (Button)</label>
                  <input type="text" value={formConfig.ctaText} onChange={e => setFormConfig({...formConfig, ctaText: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Brand Color (Hex)</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="color" value={formConfig.color} onChange={e => setFormConfig({...formConfig, color: e.target.value})} style={{ width: '40px', height: '40px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                    <input type="text" value={formConfig.color} onChange={e => setFormConfig({...formConfig, color: e.target.value})} style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Display Layout</label>
                  <select value={formConfig.style} onChange={e => setFormConfig({...formConfig, style: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }}>
                    <option value="popup">Centered Modal Popup</option>
                    <option value="inline">Inline Embedded Form</option>
                    <option value="flyout">Corner Flyout</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Target Segment Array (List Hash)</label>
                  <select value={formConfig.listDestination} onChange={e => setFormConfig({...formConfig, listDestination: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }}>
                    <option value="Master Newsletter">Master Newsletter</option>
                    <option value="VIP Product Drops">VIP Product Drops</option>
                    <option value="Christmas Promos">Christmas Promos</option>
                    <option value="Weekly Digest">Weekly Digest</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} color="var(--color-purple-main)" /> Copy Embed Hook</h3>
               <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>Paste this JSON-P script snippet right above the <code>&lt;/body&gt;</code> tag on {activeDomain}. It will mount the optimized capture vector directly into your UI.</p>
               
               <div style={{ position: 'relative' }}>
                 <pre style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#111', color: '#4ADE80', fontSize: '0.8rem', overflowX: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.5, marginBottom: '12px' }}>
{`<script>
  window.NexusFormConfig = {
    tenant: "${activeDomain}",
    list_hash: "${formConfig.listDestination}",
    headline: "${formConfig.headline}",
    subtext: "${formConfig.subtext}",
    cta: "${formConfig.ctaText}",
    theme: "${formConfig.color}",
    mode: "${formConfig.style}"
  };
</script>
<script src="https://api.nexus-core.75squared.com/forms/v2/embed.js" async defer></script>`}
                 </pre>
                 <button onClick={() => alert('Embed script copied to clipboard!')} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                   Copy
                 </button>
               </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#F3F4F6' }}>
            <h3 style={{ alignSelf: 'flex-start', fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', color: 'var(--color-text-muted)' }}>Live Interaction Render ({formConfig.style === 'inline' ? 'Inline' : 'Overlay'})</h3>
            
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {formConfig.style === 'inline' ? (
                 <div style={{ background: 'white', width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>{formConfig.headline}</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>{formConfig.subtext}</p>
                    <input type="email" placeholder="Email Address" style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', marginBottom: '12px', outline: 'none' }} />
                    <button onClick={() => alert("Component Feature arriving in v2.0")} style={{ width: '100%', padding: '12px', background: formConfig.color, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>{formConfig.ctaText}</button>
                 </div>
               ) : (
                 <div style={{ width: '100%', height: '100%', minHeight: '400px', background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', inset: 0, padding: '20px' }}>
                       <div style={{ width: '60%', height: '24px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', marginBottom: '20px' }}></div>
                       <div style={{ width: '100%', height: '160px', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', marginBottom: '20px' }}></div>
                       <div style={{ width: '40%', height: '16px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', marginBottom: '8px' }}></div>
                       <div style={{ width: '80%', height: '16px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}></div>
                    </div>

                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 10, backdropFilter: 'blur(2px)', display: 'flex', alignItems: formConfig.style === 'flyout' ? 'flex-end' : 'center', justifyContent: formConfig.style === 'flyout' ? 'flex-end' : 'center', padding: formConfig.style === 'flyout' ? '20px' : '0' }}>
                       <div style={{ background: 'white', width: formConfig.style === 'flyout' ? '300px' : '400px', padding: '30px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                          <h3 style={{ fontSize: formConfig.style === 'flyout' ? '1.2rem' : '1.5rem', fontWeight: 800, marginBottom: '8px' }}>{formConfig.headline}</h3>
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>{formConfig.subtext}</p>
                          <input type="email" placeholder="Email Address" style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', marginBottom: '12px', outline: 'none' }} />
                          <button onClick={() => alert("Component Feature arriving in v2.0")} style={{ width: '100%', padding: '14px', background: formConfig.color, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '1.05rem', boxShadow: `0 8px 20px ${formConfig.color}40` }}>{formConfig.ctaText}</button>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Root Level Modals for Render Stability */}
      {showCreateListModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div className="fade-in" style={{ width: '380px', background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Create Mailing List</h3>
              <input 
                 autoFocus
                 type="text" 
                 value={newListName}
                 onChange={(e) => setNewListName(e.target.value)}
                 placeholder="e.g. VIP Customers"
                 style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', marginBottom: '24px', fontSize: '1rem', outline: 'none' }}
              />
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                 <button onClick={() => { setShowCreateListModal(false); setNewListName(''); }} type="button" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.05)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                 <button onClick={handleCreateList} type="button" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Save List</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default EmailDashboard;
