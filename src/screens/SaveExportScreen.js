import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import useProjectStore from '../store/projectStore';
import { exportToWAV, shareWAVFile } from '../utils/audioExport';

const SaveExportScreen = ({ navigation, route }) => {
  const { getCurrentProject, updateCurrentProject } = useProjectStore();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const currentProject = getCurrentProject();

  if (!currentProject) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No project loaded</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Projects')}
        >
          <Text style={styles.backButtonText}>← Back to Projects</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSaveProject = async () => {
    try {
      setIsSaving(true);
      await updateCurrentProject(currentProject);
      Alert.alert('Success', '✅ Project saved!');
      setShowSaveModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save project');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportToWAV = async () => {
    try {
      setIsExporting(true);
      
      // Combine all tracks into one audio file
      const masterAudio = combineTracks(currentProject);
      
      // Export to WAV
      const wavPath = await exportToWAV(masterAudio);
      
      // Share/Download
      await shareWAVFile(wavPath);
      
      Alert.alert('Success', '✅ Recording exported as WAV!');
      setShowExportModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to export recording');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const combineTracks = (project) => {
    // Simple mix: combine all tracks with their volume and pan
    // This is a simplified version - you'd need actual audio data
    const mixedAudio = new Float32Array(44100 * 60); // 60 seconds max
    
    project.tracks.forEach((track) => {
      if (track.audioUri && !track.muted) {
        // Apply volume and pan
        const volume = track.volume * project.masterVolume;
        const pan = track.pan + project.masterPan;
        
        // Mixing logic here (requires actual audio buffer data)
        // This is a placeholder
      }
    });
    
    return mixedAudio;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.projectName}>{currentProject.name}</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Project Options</Text>

        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={() => setShowSaveModal(true)}
        >
          <Text style={styles.actionButtonIcon}>💾</Text>
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonTitle}>Save Project</Text>
            <Text style={styles.actionButtonDesc}>Save your current project</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.exportButton]}
          onPress={() => setShowExportModal(true)}
        >
          <Text style={styles.actionButtonIcon}>📥</Text>
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonTitle}>Export as WAV</Text>
            <Text style={styles.actionButtonDesc}>Download your recording</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.newButton]}
          onPress={() => navigation.navigate('Projects')}
        >
          <Text style={styles.actionButtonIcon}>➕</Text>
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonTitle}>New Project</Text>
            <Text style={styles.actionButtonDesc}>Create a new recording</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Save Modal */}
      <Modal visible={showSaveModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Project?</Text>
            <Text style={styles.modalDescription}>
              Save "{currentProject.name}" with all your recordings and settings
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSaveModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSaveProject}
                disabled={isSaving}
              >
                <Text style={styles.modalButtonText}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Export Modal */}
      <Modal visible={showExportModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Export Recording?</Text>
            <Text style={styles.modalDescription}>
              Export your recording as a WAV file. You'll be able to download or share it.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowExportModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleExportToWAV}
                disabled={isExporting}
              >
                <Text style={styles.modalButtonText}>
                  {isExporting ? 'Exporting...' : 'Export'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  projectName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  saveButton: {
    backgroundColor: '#2a4a2a',
    borderLeftColor: '#4ade80',
  },
  exportButton: {
    backgroundColor: '#2a3a4a',
    borderLeftColor: '#60a5fa',
  },
  newButton: {
    backgroundColor: '#4a2a3a',
    borderLeftColor: '#f472b6',
  },
  actionButtonIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  actionButtonContent: {
    flex: 1,
  },
  actionButtonTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  actionButtonDesc: {
    color: '#999',
    fontSize: 13,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  backButton: {
    backgroundColor: '#ff6b6b',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    width: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalDescription: {
    color: '#999',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  confirmButton: {
    backgroundColor: '#ff6b6b',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SaveExportScreen;
