import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import useAudioStore from '../store/audioStore';

const TrackFader = ({ trackId, track, onRecord }) => {
  const { setTrackVolume, setTrackPan, setTrackMuted, setTrackSolo } =
    useAudioStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.trackName}>{track.name}</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            onPress={() => setTrackSolo(trackId, !track.solo)}
            style={[
              styles.button,
              track.solo && styles.buttonActive,
            ]}
          >
            <Text style={styles.buttonText}>S</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTrackMuted(trackId, !track.muted)}
            style={[
              styles.button,
              track.muted && styles.buttonActive,
            ]}
          >
            <Text style={styles.buttonText}>M</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onRecord(trackId)}
            style={[
              styles.button,
              track.recording && styles.recordButtonActive,
            ]}
          >
            <Text style={styles.buttonText}>R</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.faderSection}>
        <View style={styles.panSection}>
          <Text style={styles.label}>Pan</Text>
          <Slider
            style={styles.slider}
            minimumValue={-1}
            maximumValue={1}
            value={track.pan}
            onValueChange={(value) => setTrackPan(trackId, value)}
            minimumTrackTintColor="#ff6b6b"
            maximumTrackTintColor="#51cf66"
            thumbTintColor="#ffffff"
          />
          <Text style={styles.value}>{track.pan.toFixed(1)}</Text>
        </View>

        <View style={styles.volumeSection}>
          <Text style={styles.label}>Volume</Text>
          <Slider
            style={styles.verticalSlider}
            minimumValue={0}
            maximumValue={1}
            value={track.volume}
            onValueChange={(value) => setTrackVolume(trackId, value)}
            minimumTrackTintColor="#4dabf7"
            maximumTrackTintColor="#1a1a1a"
            thumbTintColor="#ffffff"
          />
          <Text style={styles.value}>{(track.volume * 100).toFixed(0)}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4dabf7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trackName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#404040',
  },
  buttonActive: {
    backgroundColor: '#4dabf7',
    borderColor: '#4dabf7',
  },
  recordButtonActive: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  faderSection: {
    gap: 10,
  },
  panSection: {
    marginBottom: 8,
  },
  volumeSection: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#a0a0a0',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  slider: {
    width: '100%',
    height: 30,
  },
  verticalSlider: {
    width: 40,
    height: 100,
  },
  value: {
    fontSize: 12,
    color: '#4dabf7',
    marginTop: 4,
  },
});

export default TrackFader;