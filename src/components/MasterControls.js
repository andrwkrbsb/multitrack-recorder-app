import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import useAudioStore from '../store/audioStore';

const MasterControls = () => {
  const {
    masterVolume,
    masterPan,
    reverbAmount,
    delayAmount,
    delayTime,
    eqLow,
    eqMid,
    eqHigh,
    setMasterVolume,
    setMasterPan,
    setReverbAmount,
    setDelayAmount,
    setDelayTime,
    setEQ,
  } = useAudioStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Master & FX</Text>

      <View style={styles.section}>
        <View style={styles.control}>
          <Text style={styles.label}>Master Volume</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={masterVolume}
            onValueChange={setMasterVolume}
            minimumTrackTintColor="#ffd43b"
            maximumTrackTintColor="#1a1a1a"
            thumbTintColor="#ffffff"
          />
          <Text style={styles.value}>{(masterVolume * 100).toFixed(0)}%</Text>
        </View>

        <View style={styles.control}>
          <Text style={styles.label}>Master Pan</Text>
          <Slider
            style={styles.slider}
            minimumValue={-1}
            maximumValue={1}
            value={masterPan}
            onValueChange={setMasterPan}
            minimumTrackTintColor="#ff6b6b"
            maximumTrackTintColor="#51cf66"
            thumbTintColor="#ffffff"
          />
          <Text style={styles.value}>{masterPan.toFixed(1)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Effects</Text>

        <View style={styles.control}>
          <Text style={styles.label}>Reverb</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={reverbAmount}
            onValueChange={setReverbAmount}
            minimumTrackTintColor="#748ffc"
            maximumTrackTintColor="#1a1a1a"
            thumbTintColor="#ffffff"
          />
          <Text style={styles.value}>{(reverbAmount * 100).toFixed(0)}%</Text>
        </View>

        <View style={styles.control}>
          <Text style={styles.label}>Delay Amount</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={delayAmount}
            onValueChange={setDelayAmount}
            minimumTrackTintColor="#748ffc"
            maximumTrackTintColor="#1a1a1a"
            thumbTintColor="#ffffff"
          />
          <Text style={styles.value}>{(delayAmount * 100).toFixed(0)}%</Text>
        </View>

        <View style={styles.control}>
          <Text style={styles.label}>Delay Time</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.1}
            maximumValue={2}
            value={delayTime}
            onValueChange={setDelayTime}
            minimumTrackTintColor="#748ffc"
            maximumTrackTintColor="#1a1a1a"
            thumbTintColor="#ffffff"
          />
          <Text style={styles.value}>{delayTime.toFixed(2)}s</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equalizer</Text>
        <View style={styles.eqRow}>
          <View style={styles.eqControl}>
            <Text style={styles.eqLabel}>Low</Text>
            <Slider
              style={styles.eqSlider}
              minimumValue={-12}
              maximumValue={12}
              value={eqLow}
              onValueChange={(val) => setEQ(val, eqMid, eqHigh)}
              minimumTrackTintColor="#e599f7"
              maximumTrackTintColor="#1a1a1a"
              thumbTintColor="#ffffff"
            />
            <Text style={styles.eqValue}>{eqLow.toFixed(0)}dB</Text>
          </View>

          <View style={styles.eqControl}>
            <Text style={styles.eqLabel}>Mid</Text>
            <Slider
              style={styles.eqSlider}
              minimumValue={-12}
              maximumValue={12}
              value={eqMid}
              onValueChange={(val) => setEQ(eqLow, val, eqHigh)}
              minimumTrackTintColor="#e599f7"
              maximumTrackTintColor="#1a1a1a"
              thumbTintColor="#ffffff"
            />
            <Text style={styles.eqValue}>{eqMid.toFixed(0)}dB</Text>
          </View>

          <View style={styles.eqControl}>
            <Text style={styles.eqLabel}>High</Text>
            <Slider
              style={styles.eqSlider}
              minimumValue={-12}
              maximumValue={12}
              value={eqHigh}
              onValueChange={(val) => setEQ(eqLow, eqMid, val)}
              minimumTrackTintColor="#e599f7"
              maximumTrackTintColor="#1a1a1a"
              thumbTintColor="#ffffff"
            />
            <Text style={styles.eqValue}>{eqHigh.toFixed(0)}dB</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#404040',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a0a0a0',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  control: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#a0a0a0',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  slider: {
    width: '100%',
    height: 30,
  },
  value: {
    fontSize: 11,
    color: '#ffd43b',
    marginTop: 4,
    textAlign: 'right',
  },
  eqRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  eqControl: {
    flex: 1,
    alignItems: 'center',
  },
  eqLabel: {
    fontSize: 11,
    color: '#a0a0a0',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  eqSlider: {
    width: 40,
    height: 100,
  },
  eqValue: {
    fontSize: 10,
    color: '#e599f7',
    marginTop: 6,
  },
});

export default MasterControls;