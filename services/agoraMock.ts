
// This simulates the AgoraRTC Web SDK behavior for the Voice Club
// In a real app, this would use 'agora-rtc-sdk-ng'

import { NetworkQuality } from "../types";

type EventCallback = (data: any) => void;

export class AgoraMockService {
  private isConnected = false;
  private currentChannel: string | null = null;
  private listeners: Record<string, EventCallback[]> = {};
  private volumeInterval: any = null;
  private networkInterval: any = null;

  constructor() {
    this.listeners = {
      'user-published': [],
      'user-unpublished': [],
      'user-joined': [],
      'user-left': [],
      'volume-indicator': [],
      'network-quality': [],
      'connection-state-change': []
    };
  }

  // --- PUBLIC API (Mimics AgoraRTCClient) ---

  async join(appId: string, channel: string, token: string | null, uid: string) {
    console.log(`[AgoraMock] Joining channel: ${channel} with UID: ${uid}`);
    this.emit('connection-state-change', { curState: 'CONNECTING' });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    this.isConnected = true;
    this.currentChannel = channel;
    this.emit('connection-state-change', { curState: 'CONNECTED' });

    // Start simulating indicators
    this.startSimulations(uid);

    return uid;
  }

  async leave() {
    console.log(`[AgoraMock] Leaving channel`);
    this.isConnected = false;
    this.currentChannel = null;
    this.emit('connection-state-change', { curState: 'DISCONNECTED' });
    this.stopSimulations();
  }

  async publish(tracks: any[]) {
    if (!this.isConnected) throw new Error('Client not joined');
    console.log('[AgoraMock] Publishing local tracks');
    // In real SDK this publishes audio/video. Here we just log.
  }

  async unpublish() {
    console.log('[AgoraMock] Unpublishing local tracks');
  }

  // --- EVENT HANDLING ---

  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: EventCallback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  // --- SIMULATION LOGIC ---

  private startSimulations(localUid: string) {
    // 1. Volume Indicator Simulation (Active Speakers)
    this.volumeInterval = setInterval(() => {
      // Create random volume levels for active speakers
      const speakers = [
        { uid: localUid, level: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : 0 },
        { uid: '1', level: Math.random() > 0.3 ? Math.floor(Math.random() * 80) : 0 }, // Sheikh Ahmed
        { uid: '3', level: Math.random() > 0.7 ? Math.floor(Math.random() * 60) : 0 }, // Brother Ali
      ];
      this.emit('volume-indicator', speakers);
    }, 500);

    // 2. Network Quality Simulation
    this.networkInterval = setInterval(() => {
        // Agora Quality: 0=Unknown, 1=Excellent, 2=Good, 3=Poor, 4=Bad, 5=VBad, 6=Down
        const qualities: Record<string, NetworkQuality> = {
            [localUid]: 1,
            '1': 1, // Host usually has good internet
            '2': 2,
            '3': Math.random() > 0.8 ? 3 : 1, // Simulate occasional packet loss
            '4': 1,
            '5': 4  // Listener with bad internet
        };
        this.emit('network-quality', qualities);
    }, 2000);
  }

  private stopSimulations() {
    if (this.volumeInterval) clearInterval(this.volumeInterval);
    if (this.networkInterval) clearInterval(this.networkInterval);
  }

  // --- AUDIO EFFECTS (Mock) ---
  
  async enableAudioVolumeIndicator() {
    console.log('[AgoraMock] Audio volume indicator enabled');
  }

  async setClientRole(role: 'host' | 'audience') {
    console.log(`[AgoraMock] Role changed to ${role}`);
  }
}

export const agoraService = new AgoraMockService();
