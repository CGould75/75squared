import { useState, useRef, useCallback } from 'react'
import { supabase } from '../supabase'

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' }
  ]
}

// Emulate PeerJS DataConnection for seamless replacement
class SafeDataConnection {
  constructor(dc) {
    this.dc = dc
    this.callbacks = {}
    
    this.dc.onmessage = async (event) => {
        let data
        if (typeof event.data === 'string') {
           data = JSON.parse(event.data)
           // If it's a file chunk encoded as base64, decode it
           if (data.type === 'file-chunk') {
              const binaryString = window.atob(data.chunk)
              const len = binaryString.length
              const bytes = new Uint8Array(len)
              for (let i = 0; i < len; i++) {
                 bytes[i] = binaryString.charCodeAt(i)
              }
              data.chunk = bytes.buffer
           }
        } else {
           console.log("Received raw binary on data channel, unhandled in this version.")
        }
        
        if (this.callbacks['data']) {
           this.callbacks['data'](data)
        }
    }
  }

  on(event, cb) {
    this.callbacks[event] = cb
    if (event === 'open' && this.dc.readyState === 'open') {
      cb()
    } else if (event === 'open') {
      this.dc.onopen = cb
    }
  }

  send(data) {
    if (this.dc.readyState !== 'open') return
    const payload = { ...data }
    
    // Convert ArrayBuffer chunks to Base64 for safe JSON transport over standard RTC
    if (payload.type === 'file-chunk' && payload.chunk instanceof ArrayBuffer) {
        let binary = ''
        const bytes = new Uint8Array(payload.chunk)
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        payload.chunk = window.btoa(binary)
    }
    
    this.dc.send(JSON.stringify(payload))
  }
  
  close() {
    this.dc.close()
  }
}

export function useWebRTC(localStream, onDataConnection, onStream) {
  const [myId, setMyId] = useState('Generating ID...')
  const [waitingGuests, setWaitingGuests] = useState([])
  const pcRef = useRef(null)
  const channelRef = useRef(null)
  const isHostRef = useRef(false)
  const remoteIdRef = useRef(null)

  const setupPeerConnection = useCallback((remoteHostId) => {
    if (pcRef.current) pcRef.current.close()
    
    const pc = new RTCPeerConnection(ICE_SERVERS)
    pcRef.current = pc

    // Add local tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream)
      })
    }

    // Handle remote tracks
    pc.ontrack = (event) => {
      onStream(event.streams[0])
    }

    // Handle ICE Candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'webrtc-ice',
          payload: { candidate: event.candidate, to: remoteHostId }
        })
      }
    }

    return pc
  }, [localStream, onStream])

  // HOST: Initialize a new room
  const initializeHost = useCallback((generatedId) => {
    setMyId(generatedId)
    isHostRef.current = true
    
    const channel = supabase.channel(`room:${generatedId}`)
    channelRef.current = channel

    channel.on('broadcast', { event: 'guest-join' }, async ({ payload }) => {
      setWaitingGuests(prev => {
         if (!prev.includes(payload.from)) return [...prev, payload.from];
         return prev;
      });
    })

    channel.on('broadcast', { event: 'webrtc-answer' }, async ({ payload }) => {
      if (pcRef.current && pcRef.current.signalingState !== 'stable') {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(payload.sdp))
      }
    })

    channel.on('broadcast', { event: 'webrtc-ice' }, async ({ payload }) => {
      if (pcRef.current) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate)).catch(e => console.log(e))
      }
    })

    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [setupPeerConnection, onDataConnection])

  // GUEST: Join an existing room
  const joinMeeting = useCallback(async (roomId) => {
    const guestId = Math.random().toString(36).substring(2, 9)
    const channel = supabase.channel(`room:${roomId}`)
    channelRef.current = channel

    channel.on('broadcast', { event: 'webrtc-offer' }, async ({ payload }) => {
      if (payload.to !== guestId) return
      
      const pc = setupPeerConnection(roomId)
      
      // Guest receives Data Channel
      pc.ondatachannel = (event) => {
        const safeConn = new SafeDataConnection(event.channel)
        onDataConnection(safeConn)
      }

      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      channel.send({
        type: 'broadcast',
        event: 'webrtc-answer',
        payload: { sdp: answer, from: guestId }
      })
    })

    channel.on('broadcast', { event: 'webrtc-ice' }, async ({ payload }) => {
      if (payload.to !== guestId && isHostRef.current) return // Filter ICE
      if (pcRef.current) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate)).catch(e => console.log(e))
      }
    })

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channel.send({
          type: 'broadcast',
          event: 'guest-join',
          payload: { from: guestId }
        })
      }
    })

    return () => { supabase.removeChannel(channel) }
  }, [setupPeerConnection, onDataConnection])

  const cleanup = useCallback(() => {
    if (pcRef.current) pcRef.current.close()
    if (channelRef.current) supabase.removeChannel(channelRef.current)
  }, [])
  
  const admitGuest = useCallback(async (guestId) => {
      setWaitingGuests(prev => prev.filter(id => id !== guestId))
      remoteIdRef.current = guestId
      
      const pc = setupPeerConnection(guestId)
      
      // Host creates Data Channel
      const dc = pc.createDataChannel('sync-space-data')
      const safeConn = new SafeDataConnection(dc)
      onDataConnection(safeConn)

      // Host Creates Offer
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      
      if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'webrtc-offer',
            payload: { sdp: offer, to: guestId }
          })
      }
  }, [setupPeerConnection, onDataConnection])

  return { myId, initializeHost, joinMeeting, cleanup, pcRef, isHostRef, waitingGuests, admitGuest }
}
