import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { initAudioEngine, startRecording, stopRecording, playTrackAudio, stopAllAudio } from './src/engine/audioEngine';
import useAudioStore from './src/store/audioStore';
import TransportControls from './src/components/TransportControls';
import TrackFader from './src/components/TrackFader';
import MasterControls from './src/components/MasterControls';

const App = () => {
  const { tracks, setTrackRecording, setTrackAudio, setRecording, isRecording, isPlaying, setPlaying } = useAudioStore();
  const [activeRecordings, setActiveRecordings] = useState({});
  const [activePlayers, setActivePlayers] = useState({});

  useEffect(() => {
    const initEngine = async () => {
      const success = await initAudioEngine();
      if (success) {
        console.log('Audio engine initialized');
      }
    };

    initEngine();

    return () => {
      stopAllAudio();
    };
  }, []);

  const handleRecordTrack = async (trackId) => {
    const track = tracks.find(t => t.id === trackId);

    if (track.recording) {
      // Stop recording
      const recording = activeRecordings[trackId];
      if (recording) {
        const uri = await stopRecording(recording);
        if (uri) {
          setTrackAudio(trackId, uri, 0, []);
        }
        setActiveRecordings(prev => {
          const updated = { ...prev };
          delete updated[trackId];
          return updated;
        });
      }
      setTrackRecording(trackId, false);
    } else {
      // Start recording
      const recording = await startRecording(trackId);
      if (recording) {
        setActiveRecordings(prev => ({ ...prev, [trackId]: recording }));
        setTrackRecording(trackId, true);
        setRecording(true);
      }
    }
  };

  const handlePlay = async () => {
    if (isPlaying) {
      await stopAllAudio();
      setPlaying(false);
      setActivePlayers({});
    } else {
      // Play all tracks with audio
      const players = {};
      for (const track of tracks) {
        if (track.audioUri && !track.muted) {
          const sound = await playTrackAudio(track.id, track.audioUri, track.volume);
          if (sound) {
            players[track.id] = sound;
          }
        }
      }
      setActivePlayers(players);
      setPlaying(true);
    }
  };

  const handleStop = async () => {
    await stopAllAudio();
    setPlaying(false);
    setRecording(false);
    setActiveRecordings({});
    setActivePlayers({});
  };

  const handleRecord = () => {
    // This toggles master record mode
    if (isRecording) {
      handleStop();
    } else {
      setRecording(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TransportControls
        onRecord={handleRecord}
        onPlay={handlePlay}
        onStop={handleStop}
      />

      <ScrollView style={styles.tracksContainer}>
        <View style={styles.tracksGrid}>
          {tracks.map((track) => (
            <TrackFader 
              key={track.id} 
              trackId={track.id} 
              track={track}
              onRecord={handleRecordTrack}
            />
          ))}
        </View>
      </ScrollView>

      <MasterControls />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  tracksContainer: {
    flex: 1,
  },
  tracksGrid: {
    padding: 12,
  },
});

export default App;