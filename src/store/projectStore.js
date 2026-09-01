import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useProjectStore = create((set, get) => ({
  // Projects
  projects: [],
  currentProjectId: null,
  
  // Load projects from storage
  loadProjects: async () => {
    try {
      const stored = await AsyncStorage.getItem('projects');
      if (stored) {
        const projects = JSON.parse(stored);
        set({ projects });
        if (projects.length > 0) {
          set({ currentProjectId: projects[0].id });
        }
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  },

  // Create new project
  createProject: async (projectName) => {
    const newProject = {
      id: Date.now().toString(),
      name: projectName,
      createdAt: new Date().toISOString(),
      tracks: Array.from({ length: 8 }, (_, i) => ({
        id: i,
        name: `Track ${i + 1}`,
        volume: 0.8,
        pan: 0,
        muted: false,
        solo: false,
        audioUri: null,
        duration: 0,
      })),
      masterVolume: 0.9,
      masterPan: 0,
      reverbAmount: 0.2,
      delayAmount: 0.1,
      delayTime: 0.5,
      eqLow: 0,
      eqMid: 0,
      eqHigh: 0,
    };

    set((state) => {
      const updated = [...state.projects, newProject];
      AsyncStorage.setItem('projects', JSON.stringify(updated));
      return { projects: updated, currentProjectId: newProject.id };
    });

    return newProject;
  },

  // Load specific project
  loadProject: (projectId) => {
    const project = get().projects.find(p => p.id === projectId);
    if (project) {
      set({ currentProjectId: projectId });
      return project;
    }
    return null;
  },

  // Delete project
  deleteProject: async (projectId) => {
    set((state) => {
      const updated = state.projects.filter(p => p.id !== projectId);
      AsyncStorage.setItem('projects', JSON.stringify(updated));
      
      let newCurrentId = state.currentProjectId;
      if (projectId === state.currentProjectId && updated.length > 0) {
        newCurrentId = updated[0].id;
      } else if (updated.length === 0) {
        newCurrentId = null;
      }
      
      return { projects: updated, currentProjectId: newCurrentId };
    });
  },

  // Update current project
  updateCurrentProject: async (updates) => {
    set((state) => {
      const updated = state.projects.map(p =>
        p.id === state.currentProjectId ? { ...p, ...updates } : p
      );
      AsyncStorage.setItem('projects', JSON.stringify(updated));
      return { projects: updated };
    });
  },

  // Get current project
  getCurrentProject: () => {
    const { projects, currentProjectId } = get();
    return projects.find(p => p.id === currentProjectId);
  },

  // Save project to storage
  saveProject: async () => {
    const { projects } = get();
    try {
      await AsyncStorage.setItem('projects', JSON.stringify(projects));
      return true;
    } catch (error) {
      console.error('Failed to save project:', error);
      return false;
    }
  },
}));

export default useProjectStore;
