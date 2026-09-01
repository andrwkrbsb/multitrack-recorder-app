import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useAudioStore from '../store/audioStore';

const TransportControls = ({ onRecord, onPlay, onStop }) => {
  const { isRecording, isPlaying, currentTime, totalDuration } =
    useAudioStore();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeDisplay}>
        <Text style={styles.time}>{formatTime(currentTime)}</Text>
        <Text style={styles.separator}>/</Text>
        <Text style={styles.time}>{formatTime(totalDuration)}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          onPress={onRecord}
          style={[
            styles.button,
            styles.recordButton,
            isRecording && styles.buttonActive,
          ]}
        >
          <Text style={styles.buttonText}>{isRecording ? '■' : '●'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPlay}
          style={[
            styles.button,
            styles.playButton,
            isPlaying && styles.buttonActive,
          ]}
        >
          <Text style={styles.buttonText}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onStop}
          style={[styles.button, styles.stopButton]}
        >
          <Text style={styles.buttonText}>⏹</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0a',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  timeDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  time: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  separator: {
    fontSize: 24,
    color: '#404040',
    marginHorizontal: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  recordButton: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff4444',
  },
  playButton: {
    backgroundColor: '#51cf66',
    borderColor: '#37b24d',
  },
  stopButton: {
    backgroundColor: '#495057',
    borderColor: '#303840',
  },
  buttonActive: {
    opacity: 0.7,
    borderWidth: 3,
  },
  buttonText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default TransportControls;