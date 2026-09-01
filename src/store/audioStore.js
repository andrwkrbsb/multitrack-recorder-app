import { create } from 'zustand';

const useAudioStore = create((set, get) => ({
  tracks: Array.from({ length: 8 }, (_, i) => ({
    id: i,
    name: `Track ${i + 1}`,
    volume: 0.8,
    pan: 0,
    muted: false,
    solo: false,
    recording: false,
    playing: false,
    audioUri: null,
    duration: 0,
    waveform: [],
  })),

  isRecording: false,
  isPlaying: false,
  currentTime: 0,
  totalDuration: 0,

  // FX state
  masterVolume: 0.9,
  masterPan: 0,
  reverbAmount: 0.2,
  delayAmount: 0.1,
  delayTime: 0.5,
  eqLow: 0,
  eqMid: 0,
  eqHigh: 0,

  // Actions
  setTrackVolume: (trackId, volume) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId ? { ...t, volume } : t
      ),
    })),

  setTrackPan: (trackId, pan) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId ? { ...t, pan } : t
      ),
    })),

  setTrackMuted: (trackId, muted) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId ? { ...t, muted } : t
      ),
    })),

  setTrackSolo: (trackId, solo) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId ? { ...t, solo } : t
      ),
    })),

  setTrackRecording: (trackId, recording) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId ? { ...t, recording } : t
      ),
    })),

  setTrackAudio: (trackId, audioUri, duration, waveform) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId ? { ...t, audioUri, duration, waveform } : t
      ),
    })),

  setRecording: (recording) => set({ isRecording: recording }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setTotalDuration: (duration) => set({ totalDuration: duration }),

  setMasterVolume: (volume) => set({ masterVolume: volume }),
  setMasterPan: (pan) => set({ masterPan: pan }),
  setReverbAmount: (amount) => set({ reverbAmount: amount }),
  setDelayAmount: (amount) => set({ delayAmount: amount }),
  setDelayTime: (time) => set({ delayTime: time }),
  setEQ: (low, mid, high) => set({ eqLow: low, eqMid: mid, eqHigh: high }),

  resetAll: () =>
    set({
      tracks: Array.from({ length: 8 }, (_, i) => ({
        id: i,
        name: `Track ${i + 1}`,
        volume: 0.8,
        pan: 0,
        muted: false,
        solo: false,
        recording: false,
        playing: false,
        audioUri: null,
        duration: 0,
        waveform: [],
      })),
      isRecording: false,
      isPlaying: false,
      currentTime: 0,
      totalDuration: 0,
    }),
}));

export default useAudioStore;