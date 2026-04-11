import { useState, useRef, useEffect, useCallback } from 'react'
import { Video, VideoOff, Mic, MicOff, MonitorUp, PhoneOff, Settings, Copy, Check, MousePointer2, MessageSquare, Maximize, ExternalLink, X, Send, Paperclip, File as FileIcon, Download, CheckCircle2, Mail, Calendar } from 'lucide-react'
import { useWebRTC } from '../hooks/useWebRTC'
import '../index.css'

function App() {
  const [inMeeting, setInMeeting] = useState(false)
  const [meetingIdInput, setMeetingIdInput] = useState('')
  const [myId, setMyId] = useState('Generating ID...')

  
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isMicEnabled, setIsMicEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [dataConnection, setDataConnection] = useState(null)

  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  
  // File Transfer State
  const [activeTransfer, setActiveTransfer] = useState(null) 
  // { direction: 'send'|'receive', fileId, fileName, progress: 0-100, status: 'offering'|'transferring' }

  const previewVideoRef = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const messagesEndRef = useRef(null)
  
  const fileInputRef = useRef(null)
  const currentFileRef = useRef(null)
  const fileStreamRef = useRef(null)
  const chunksRef = useRef([])

  // Setup data connection listeners cleanly
  const setupDataConnectionListeners = (conn) => {
    conn.on('data', async (data) => {
      if (data.type === 'remote-control') {
        console.log(`[Remote Control Event] Type: ${data.event}, X:${data.x}, Y:${data.y}`)
        if (window.electronAPI) {
            window.electronAPI.performAction({ type: data.event, x: parseFloat(data.x), y: parseFloat(data.y) })
        }
      } 
      else if (data.type === 'chat') {
        setMessages(prev => [...prev, { type: 'chat', text: data.text, timestamp: data.timestamp, sender: 'Remote' }])
      }
      else if (data.type === 'host-command' && data.command === 'mute-remote-mic') {
        setIsMicEnabled(false)
        if (localStream) {
            localStream.getAudioTracks().forEach(t => t.enabled = false)
        }
      }
      else if (data.type === 'file-offer') {
        setMessages(prev => [...prev, { 
          type: 'offer', 
          fileId: data.fileId, 
          fileName: data.fileName, 
          fileSize: data.fileSize, 
          sender: 'Remote' 
        }])
      }
      else if (data.type === 'file-accept') {
        setActiveTransfer(prev => ({ ...prev, status: 'transferring' }))
        startSendingFile(data.fileId, currentFileRef.current, conn)
      }
      else if (data.type === 'file-chunk') {
        if (fileStreamRef.current) {
           await fileStreamRef.current.write(data.chunk)
        } else {
           chunksRef.current.push(data.chunk)
        }
        const progress = Math.min(100, Math.round(((data.offset + data.chunk.byteLength) / data.fileSize) * 100))
        setActiveTransfer({ direction: 'receive', fileName: data.fileName, progress, status: 'transferring' })
      }
      else if (data.type === 'file-end') {
        if (fileStreamRef.current) {
           await fileStreamRef.current.close()
           fileStreamRef.current = null
           setMessages(prev => [...prev, { type: 'chat', text: `Successfully saved ${data.fileName} directly to your disk.`, sender: 'System' }])
        } else {
           const blob = new Blob(chunksRef.current)
           const url = URL.createObjectURL(blob)
           setMessages(prev => [...prev, { type: 'file-download', url, fileName: data.fileName, sender: 'System' }])
           chunksRef.current = []
        }
        setActiveTransfer(null)
      }
    })
  }

  // Custom abstract WebRTC hook mapping to Supabase
  const handleDataChannel = useCallback((conn) => {
    setDataConnection(conn)
    setupDataConnectionListeners(conn)
  }, [setupDataConnectionListeners])
  
  const handleRemoteStream = useCallback((rStream) => {
    setRemoteStream(rStream)
  }, [])
  
  const { myId: generatedId, initializeHost, joinMeeting, cleanup, pcRef, isHostRef, waitingGuests, admitGuest } = useWebRTC(localStream, handleDataChannel, handleRemoteStream)

  // Generate ID and act as listening host natively
  useEffect(() => {
    const newId = Math.random().toString(36).substring(2, 11)
    setMyId(newId)
    const cleanupHost = initializeHost(newId)
    
    return () => {
      cleanup()
      if (cleanupHost) cleanupHost()
    }
  }, [initializeHost, cleanup])

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isChatOpen, activeTransfer])

  // Removed automatic media stream bindings on mount to prevent auto-starting camera.

  useEffect(() => {
    if (!inMeeting && previewVideoRef.current && localStream) {
      previewVideoRef.current.srcObject = localStream
    } else if (inMeeting && localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [inMeeting, localStream])

  useEffect(() => {
    if (inMeeting && remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [inMeeting, remoteStream])

  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = isVideoEnabled)
      localStream.getAudioTracks().forEach(track => track.enabled = isMicEnabled)
    }
  }, [isVideoEnabled, isMicEnabled, localStream])

  const createDummyStream = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, 1, 1);
    const stream = canvas.captureStream(1);
    
    // Create silent audio track
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        const ctxAudio = new AudioContext();
        const dst = ctxAudio.createMediaStreamDestination();
        const audioTrack = dst.stream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = false;
            stream.addTrack(audioTrack);
        }
    }
    return stream;
  }

  const handleJoin = (e) => {
    e.preventDefault()
    if (!meetingIdInput) return
    
    // In the new architecture, logic relies on joinMeeting configuring the peer natively
    joinMeeting(meetingIdInput)
    setInMeeting(true)
  }

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        if (localVideoRef.current) localVideoRef.current.srcObject = stream
        const videoTrack = stream.getVideoTracks()[0]
        if (pcRef.current) {
            const sender = pcRef.current.getSenders().find(s => s.track && s.track.kind === 'video')
            if (sender) sender.replaceTrack(videoTrack)
        }
        videoTrack.onended = () => stopScreenShare()
        setIsScreenSharing(true)
      } catch (err) {
        console.error("Error sharing screen:", err)
      }
    } else {
      stopScreenShare()
    }
  }

  const stopScreenShare = () => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream
      const videoTrack = localStream.getVideoTracks()[0]
      if (pcRef.current) {
        const sender = pcRef.current.getSenders().find(s => s.track && s.track.kind === 'video')
        if (sender) sender.replaceTrack(videoTrack)
      }
    }
    setIsScreenSharing(false)
  }

  const endMeeting = () => {
    setInMeeting(false)
    setRemoteStream(null)
    setMessages([])
    setActiveTransfer(null)
    if (dataConnection) {
      dataConnection.close()
      setDataConnection(null)
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!chatInput.trim() || !dataConnection) return
    dataConnection.send({ type: 'chat', text: chatInput, timestamp: Date.now() })
    setMessages(prev => [...prev, { type: 'chat', text: chatInput, timestamp: Date.now(), sender: 'You' }])
    setChatInput('')
  }

  // File Transfer Handlers
  const onFileSelected = (e) => {
    const file = e.target.files[0]
    if (!file || !dataConnection) return
    currentFileRef.current = file
    const fileId = Math.random().toString(36).substr(2, 9)
    
    setMessages(prev => [...prev, { type: 'chat', text: `Offered file: ${file.name} (${(file.size/1024/1024).toFixed(2)} MB)`, sender: 'You' }])
    setActiveTransfer({ direction: 'send', fileId, fileName: file.name, progress: 0, status: 'offering' })
    
    dataConnection.send({ type: 'file-offer', fileId, fileName: file.name, fileSize: file.size })
    e.target.value = null
  }

  const acceptFileTransfer = async (fileId, fileName) => {
    setActiveTransfer({ direction: 'receive', fileId, fileName, progress: 0, status: 'connecting' })
    try {
        if ('showSaveFilePicker' in window) {
            const handle = await window.showSaveFilePicker({ suggestedName: fileName })
            fileStreamRef.current = await handle.createWritable()
        } else {
            chunksRef.current = [] // fallback to RAM
        }
        dataConnection.send({ type: 'file-accept', fileId })
    } catch (err) {
        console.error("Save picker cancelled", err)
        setActiveTransfer(null)
    }
  }

  function startSendingFile(fileId, file, conn) {
    const CHUNK_SIZE = 65536 // 64KB max recommended for data channels
    let offset = 0
    
    const readSlice = (o) => {
        if (o >= file.size) {
            conn.send({ type: 'file-end', fileId, fileName: file.name })
            setActiveTransfer(null)
            setMessages(prev => [...prev, { type: 'chat', text: `Sent ${file.name} successfully.`, sender: 'System' }])
            return
        }

        const slice = file.slice(o, o + CHUNK_SIZE)
        const reader = new FileReader()
        reader.onload = (e) => {
            conn.send({ type: 'file-chunk', fileId, fileName: file.name, fileSize: file.size, offset: o, chunk: e.target.result })
            offset += CHUNK_SIZE
            setActiveTransfer(prev => prev ? { ...prev, progress: Math.min(100, Math.round((offset / file.size) * 100)) } : null)
            
            // Timeout to prevent overflowing WebRTC internal buffers
            setTimeout(() => readSlice(offset), 2)
        }
        reader.readAsArrayBuffer(slice)
    }
    readSlice(0)
  }

  // Remote Control capture 
  const handleRemoteInteraction = useCallback((e, type) => {
    if (!dataConnection) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    dataConnection.send({ type: 'remote-control', event: type, x: x.toFixed(4), y: y.toFixed(4) })
  }, [dataConnection])

  const formatTime = (ts) => new Intl.DateTimeFormat('default', { hour: 'numeric', minute: 'numeric' }).format(new Date(ts))

  // PRE-JOIN SCREEN
  if (!inMeeting) {
    return (
      <div className="app-container">
        <div className="pre-join-wrapper">
          <div className="glass-panel pre-join-card">
            <h1 className="text-center mb-2">Sync Space</h1>
            <p className="text-center text-secondary mb-8">Video Meetings & Remote Control</p>
            
            <div className="video-preview" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {(!localStream || (!localStream.getVideoTracks().length && !localStream.getAudioTracks().length)) ? (
                 <div className="flex flex-col items-center justify-center p-8 text-center bg-black/40 rounded-lg w-full h-full" style={{ minHeight: '200px' }}>
                    <p className="text-secondary mb-6 text-sm max-w-xs" style={{ fontSize: '1rem', lineHeight: '1.5' }}>Enable your camera or microphone to prepare for the meeting.</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        className="btn-icon" 
                        style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: '#ef4444', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', width: '100px', borderRadius: '12px' }}
                        onClick={() => {
                          navigator.mediaDevices.getUserMedia({ audio: true })
                            .then((stream) => {
                              setLocalStream(prev => prev ? new MediaStream([...prev.getVideoTracks(), ...stream.getAudioTracks()]) : stream)
                              setIsMicEnabled(true)
                            })
                            .catch(err => console.error("Failed to get audio stream", err))
                        }}
                        title="Enable Mic"
                      >
                        <MicOff size={28} color="#ef4444" />
                        <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>Audio</span>
                      </button>
                      <button 
                        className="btn-icon" 
                        style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: '#ef4444', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', width: '100px', borderRadius: '12px' }}
                        onClick={() => {
                          navigator.mediaDevices.getUserMedia({ video: true })
                            .then((stream) => {
                              setLocalStream(prev => prev ? new MediaStream([...prev.getAudioTracks(), ...stream.getVideoTracks()]) : stream)
                              setIsVideoEnabled(true)
                            })
                            .catch(err => console.error("Failed to get video stream", err))
                        }}
                        title="Enable Camera"
                      >
                        <VideoOff size={28} color="#ef4444" />
                        <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>Video</span>
                      </button>
                    </div>
                 </div>
              ) : (
                <>
                  <video ref={previewVideoRef} autoPlay muted playsInline style={{ display: localStream && localStream.getVideoTracks().length > 0 ? 'block' : 'none', width: '100%', height: '100%', objectFit: 'cover' }} />
                  
                  {(!localStream.getVideoTracks().length) && (
                     <div className="flex flex-col items-center justify-center p-8 text-center bg-black/40 rounded-lg w-full h-full" style={{ position: 'absolute', inset: 0 }}>
                        <VideoOff size={48} className="text-secondary opacity-50" />
                     </div>
                  )}

                  <div className="video-preview-overlay" style={{ bottom: '1rem', background: 'rgba(0,0,0,0.6)', padding: '0.5rem', borderRadius: '999px', display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className={`btn-icon`} 
                      style={!isMicEnabled || !localStream?.getAudioTracks().length ? { background: '#ef4444', borderColor: '#ef4444' } : {}}
                      onClick={() => {
                        if (localStream?.getAudioTracks().length) {
                          setIsMicEnabled(!isMicEnabled)
                        } else {
                          navigator.mediaDevices.getUserMedia({ audio: true })
                            .then((stream) => {
                              setLocalStream(prev => prev ? new MediaStream([...prev.getVideoTracks(), ...stream.getAudioTracks()]) : stream)
                              setIsMicEnabled(true)
                            })
                            .catch(err => console.error("Failed to get audio stream", err))
                        }
                      }}
                      title={localStream?.getAudioTracks().length ? "Toggle Mic" : "Enable Mic"}
                    >
                      {isMicEnabled && localStream?.getAudioTracks().length ? <Mic size={20} /> : <MicOff size={20} />}
                    </button>
                    
                    <button 
                      className={`btn-icon`} 
                      style={!isVideoEnabled || !localStream?.getVideoTracks().length ? { background: '#ef4444', borderColor: '#ef4444' } : {}}
                      onClick={() => {
                        if (localStream?.getVideoTracks().length) {
                          setIsVideoEnabled(!isVideoEnabled)
                        } else {
                          navigator.mediaDevices.getUserMedia({ video: true })
                            .then((stream) => {
                              setLocalStream(prev => prev ? new MediaStream([...prev.getAudioTracks(), ...stream.getVideoTracks()]) : stream)
                              setIsVideoEnabled(true)
                            })
                            .catch(err => console.error("Failed to get video stream", err))
                        }
                      }}
                      title={localStream?.getVideoTracks().length ? "Toggle Camera" : "Enable Camera"}
                    >
                      {isVideoEnabled && localStream?.getVideoTracks().length ? <Video size={20} /> : <VideoOff size={20} />}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-secondary" style={{ fontSize: '0.875rem' }}>Your Meeting ID</span>
                  <div className="flex gap-2">
                    <button className="btn-icon" style={{ padding: '0.25rem', border: 'none', background: 'transparent' }} onClick={() => { 
                      const subject = encodeURIComponent("Join my SyncSpace Virtual Room");
                      const body = encodeURIComponent(`Hey! I'm starting a secure conferencing session.\n\nMeeting ID: ${generatedId}\nLink: ${window.location.origin}\n\nJust pop in the ID to join.`);
                      window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    }} title="Email Invite">
                      <Mail size={16} />
                    </button>
                    <button className="btn-icon" style={{ padding: '0.25rem', border: 'none', background: 'transparent' }} onClick={() => { 
                      const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:SyncSpace Virtual Room\nDESCRIPTION:Join my secure video conference.\\n\\nMeeting ID: ${generatedId}\\nLink: ${window.location.origin}\nDTSTART:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\nDTEND:${new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z\nEND:VEVENT\nEND:VCALENDAR`;
                      const blob = new Blob([icsData], { type: 'text/calendar' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'syncspace-invite.ics';
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }} title="Download Event">
                      <Calendar size={16} />
                    </button>
                    <button className="btn-icon" style={{ padding: '0.25rem', border: 'none', background: 'transparent' }} onClick={() => { navigator.clipboard.writeText(generatedId); setCopied(true); setTimeout(() => setCopied(false), 2000) }} title="Copy ID">
                      {copied ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', letterSpacing: '1px', color: generatedId === 'Generating ID...' ? '#9ca3af' : '#fff' }}>
                  {generatedId}
                </div>
              </div>

              <form onSubmit={handleJoin} className="flex gap-2 mt-2">
                <input type="text" className="input-field" placeholder="Enter Meeting ID to join" value={meetingIdInput} onChange={(e) => setMeetingIdInput(e.target.value)} />
                <button type="submit" className="btn btn-primary" disabled={!meetingIdInput.trim() || myId === 'Generating ID...'}>Join</button>
              </form>
              
              <div className="flex justify-center mt-2"><span className="text-secondary" style={{ fontSize: '0.875rem' }}>or</span></div>
              <button className="btn btn-primary w-full" onClick={() => setInMeeting(true)} disabled={myId === 'Generating ID...'}>Start New Meeting</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // MEETING ROOM
  return (
    <div className="app-container">
      <div className="meeting-room">
        <header className="meeting-header">
          <div className="flex items-center gap-2">
            <Video size={24} color="#6366f1" />
            <span style={{ fontWeight: 600 }}>Sync Space</span>
          </div>
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '0.875rem' }}>ID:</span>
            <span style={{ fontFamily: 'monospace' }}>{generatedId}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn-icon" style={{ border: 'none', background: 'transparent' }} onClick={() => setIsChatOpen(!isChatOpen)}>
              <MessageSquare size={20} color={isChatOpen ? "#6366f1" : "white"} />
            </button>
          </div>
        </header>

        {isHostRef.current && waitingGuests && waitingGuests.length > 0 && (
          <div style={{ background: 'rgba(99, 102, 241, 0.9)', backdropFilter: 'blur(10px)', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontWeight: 600 }}>{waitingGuests.length} Guest(s) waiting in the Lobby...</span>
            <button className="btn-primary" onClick={() => admitGuest(waitingGuests[0])} style={{ background: 'white', color: '#6366f1', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              Admit Next Guest
            </button>
          </div>
        )}

        <div className="meeting-content">
          <main className="meeting-grid">
            <div className="video-tile">
              <div className="video-tile-badge">You {isScreenSharing && "(Sharing Screen)"}</div>
              {(isVideoEnabled || isScreenSharing) ? (
                <video ref={localVideoRef} autoPlay muted playsInline style={{ objectFit: 'cover' }} />
              ) : (
                <div className="flex flex-col items-center gap-2 text-secondary">
                  <VideoOff size={48} opacity={0.5} />
                  <span>Camera Off</span>
                </div>
              )}
            </div>
            
            <div className="video-tile" 
                style={{ cursor: dataConnection ? 'crosshair' : 'default' }}
                onClick={(e) => handleRemoteInteraction(e, 'click')}
                onMouseMove={(e) => handleRemoteInteraction(e, 'move')}
            >
              {remoteStream ? (
                <>
                  <div className="video-tile-badge flex items-center gap-2">
                    Remote User
                    {dataConnection && <MousePointer2 size={12} color="#22c55e" title="Remote Control Active" />}
                  </div>
                  
                  <div className="video-tile-actions">
                    {isHostRef.current && dataConnection && (
                      <button className="btn-icon" style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.8)', backdropFilter: 'blur(4px)', color: 'white' }} onClick={() => {
                        dataConnection.send({ type: 'host-command', command: 'mute-remote-mic' })
                      }} title="Force Mute Remote Microphone">
                        <MicOff size={16} />
                      </button>
                    )}
                    <button className="btn-icon" style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={async () => { if (document.pictureInPictureElement) await document.exitPictureInPicture(); else await remoteVideoRef.current.requestPictureInPicture() }} title="Picture in Picture">
                      <ExternalLink size={16} />
                    </button>
                    <button className="btn-icon" style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={async () => { if (document.fullscreenElement) await document.exitFullscreen(); else await remoteVideoRef.current.requestFullscreen() }} title="Fullscreen">
                      <Maximize size={16} />
                    </button>
                  </div>

                  <video ref={remoteVideoRef} autoPlay playsInline style={{ objectFit: 'contain' }} />
                  
                  {dataConnection && (
                    <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', color: 'var(--text-secondary)', pointerEvents: 'none', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} className="animate-pulse"></div>
                      Transmitting Control Signals
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="video-tile-badge">Waiting for others...</div>
                  <div className="flex flex-col items-center gap-4 text-secondary">
                    <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <span>Share your ID to invite people</span>
                  </div>
                </>
              )}
            </div>
          </main>

          {isChatOpen && (
            <aside className="chat-sidebar">
              <div className="chat-header">
                <h3>Meeting Chat</h3>
                <button className="btn-icon" style={{ padding: '0.25rem', border: 'none', background: 'transparent' }} onClick={() => setIsChatOpen(false)}><X size={20} /></button>
              </div>
              
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-secondary" style={{ fontSize: '0.875rem' }}>No messages yet. Say hi!</div>
                ) : (
                  messages.map((msg, idx) => {
                    if (msg.type === 'offer') {
                       return (
                         <div key={idx} className="chat-message offer flex flex-col gap-2">
                           <div className="flex items-center gap-2">
                             <FileIcon size={16} color="#6366f1" />
                             <span style={{ fontWeight: 600 }}>Incoming File Transfer</span>
                           </div>
                           <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{msg.fileName} ({(msg.fileSize / 1024 / 1024).toFixed(2)} MB)</div>
                           {activeTransfer?.fileId === msg.fileId && activeTransfer?.direction === 'receive' ? (
                             <div className="text-secondary mt-1" style={{ fontSize: '0.75rem' }}>Transfer in progress...</div>
                           ) : (
                             <button className="btn btn-primary mt-2" onClick={() => acceptFileTransfer(msg.fileId, msg.fileName)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                               Accept & Download
                             </button>
                           )}
                         </div>
                       )
                    }
                    if (msg.type === 'file-download') {
                       return (
                         <div key={idx} className="chat-message remote flex flex-col gap-2">
                           <div className="flex items-center gap-2">
                             <CheckCircle2 size={16} color="#22c55e" />
                             <span>File Received</span>
                           </div>
                           <a href={msg.url} download={msg.fileName} className="btn btn-primary" style={{ textDecoration: 'none', padding: '0.4rem 0.75rem', fontSize: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                             <Download size={14} /> Save {msg.fileName}
                           </a>
                         </div>
                       )
                    }
                    
                    const isSystem = msg.sender === 'System'
                    return (
                      <div key={idx} className={`chat-message ${isSystem ? 'system text-center text-secondary w-full' : (msg.sender === 'You' ? 'you' : 'remote')}`} style={isSystem ? { background: 'transparent', fontSize: '0.75rem', margin: '0.5rem 0' } : {}}>
                        {msg.text}
                        {!isSystem && <div className="chat-message-time">{formatTime(msg.timestamp)}</div>}
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {activeTransfer && (
                <div className={`transfer-banner ${activeTransfer.direction === 'send' ? 'sending' : ''}`}>
                   <div className="flex justify-between items-center" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                     <span>{activeTransfer.direction === 'send' ? 'Uploading' : 'Receiving'}: {activeTransfer.fileName}</span>
                     <span>{activeTransfer.progress}%</span>
                   </div>
                   <div className="progress-bar-container">
                     <div className="progress-bar" style={{ width: `${activeTransfer.progress}%` }}></div>
                   </div>
                   {activeTransfer.status === 'offering' && <div className="text-secondary text-center mt-1" style={{ fontSize: '0.65rem' }}>Waiting for recipient to accept...</div>}
                </div>
              )}

              <form className="chat-input-container" onSubmit={handleSendMessage}>
                <div className="chat-input-wrapper">
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={onFileSelected} />
                  <button type="button" className="btn-icon" style={{ borderRadius: '8px' }} onClick={() => fileInputRef.current?.click()} disabled={!dataConnection || activeTransfer}>
                    <Paperclip size={18} />
                  </button>
                  <input type="text" className="input-field" placeholder="Type a message..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} disabled={!dataConnection} />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} disabled={!dataConnection || !chatInput.trim()}>
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </aside>
          )}
        </div>

        <footer className="meeting-controls">
          <button className="btn-icon" onClick={() => setIsMicEnabled(!isMicEnabled)} style={!isMicEnabled ? { background: '#ef4444', borderColor: '#ef4444' } : {}}>
            {isMicEnabled ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          
          <button className="btn-icon" onClick={() => setIsVideoEnabled(!isVideoEnabled)} style={!isVideoEnabled ? { background: '#ef4444', borderColor: '#ef4444' } : {}} disabled={isScreenSharing}>
            {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
          </button>
          
          <button className="btn-icon" title="Share Screen" onClick={toggleScreenShare} style={isScreenSharing ? { background: '#22c55e', borderColor: '#22c55e' } : {}}>
            <MonitorUp size={24} />
          </button>
          
          <button className="btn-icon" style={{ background: '#ef4444', borderColor: '#ef4444', marginLeft: '1rem', padding: '0.75rem 2rem', borderRadius: '32px' }} onClick={endMeeting}>
            <PhoneOff size={24} />
          </button>
        </footer>
      </div>
    </div>
  )
}

export default App
