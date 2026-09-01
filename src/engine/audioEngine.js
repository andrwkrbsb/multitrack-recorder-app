import { Audio } from 'expo-av';

let audioContext = null;
let masterGain = null;
let masterPan = null;
let delayNode = null;
let feedbackGain = null;
let eqLow = null;
let eqMid = null;
let eqHigh = null;

const trackPlayers = new Map();
const trackRecordings = new Map();

export const initAudioEngine = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    if (typeof AudioContext !== 'undefined') {
      audioContext = new AudioContext();
      setupAudioGraph();
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize audio engine:', error);
    return false;
  }
};

const setupAudioGraph = () => {
  if (!audioContext) return;

  masterGain = audioContext.createGain();
  masterGain.gain.value = 0.9;
  masterGain.connect(audioContext.destination);

  masterPan = audioContext.createStereoPanner();
  masterPan.pan.value = 0;
  masterPan.connect(masterGain);

  eqLow = audioContext.createBiquadFilter();
  eqLow.type = 'lowshelf';
  eqLow.frequency.value = 200;
  eqLow.gain.value = 0;

  eqMid = audioContext.createBiquadFilter();
  eqMid.type = 'peaking';
  eqMid.frequency.value = 1000;
  eqMid.Q.value = 0.5;
  eqMid.gain.value = 0;

  eqHigh = audioContext.createBiquadFilter();
  eqHigh.type = 'highshelf';
  eqHigh.frequency.value = 5000;
  eqHigh.gain.value = 0;

  eqLow.connect(eqMid);
  eqMid.connect(eqHigh);

  delayNode = audioContext.createDelay(5);
  delayNode.delayTime.value = 0.5;

  feedbackGain = audioContext.createGain();
  feedbackGain.gain.value = 0.5;
  delayNode.connect(feedbackGain);
  feedbackGain.connect(delayNode);

  eqHigh.connect(masterPan);
};

export const startRecording = async (trackId) => {
  try {
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await recording.startAsync();
    trackRecordings.set(trackId, recording);
    return recording;
  } catch (error) {
    console.error('Failed to start recording:', error);
    return null;
  }
};

export const stopRecording = async (trackId) => {
  try {
    const recording = trackRecordings.get(trackId);
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      trackRecordings.delete(trackId);
      return uri;
    }
    return null;
  } catch (error) {
    console.error('Failed to stop recording:', error);
    return null;
  }
};

export const playTrackAudio = async (trackId, audioUri, volume = 0.8) => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      { shouldPlay: true, volume }
    );
    trackPlayers.set(trackId, sound);
    return sound;
  } catch (error) {
    console.error('Failed to play audio:', error);
    return null;
  }
};

export const stopTrackAudio = async (trackId) => {
  try {
    const sound = trackPlayers.get(trackId);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      trackPlayers.delete(trackId);
    }
  } catch (error) {
    console.error('Failed to stop audio:', error);
  }
};

export const stopAllAudio = async () => {
  for (const [trackId] of trackPlayers) {
    await stopTrackAudio(trackId);
  }
};

export const setMasterVolume = (volume) => {
  if (masterGain) {
    masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }
};

export const setMasterPan = (pan) => {
  if (masterPan) {
    masterPan.pan.value = Math.max(-1, Math.min(1, pan));
  }
};

export const setDelayAmount = (amount) => {
  if (feedbackGain) {
    feedbackGain.gain.value = Math.max(0, Math.min(1, amount));
  }
};

export const setDelayTime = (time) => {
  if (delayNode) {
    delayNode.delayTime.value = Math.max(0.1, Math.min(5, time));
  }
};

export const setEQ = (low, mid, high) => {
  if (eqLow) eqLow.gain.value = low;
  if (eqMid) eqMid.gain.value = mid;
  if (eqHigh) eqHigh.gain.value = high;
};

export const updateTrackVolume = async (trackId, volume) => {
  const sound = trackPlayers.get(trackId);
  if (sound) {
    await sound.setVolumeAsync(volume);
  }
};