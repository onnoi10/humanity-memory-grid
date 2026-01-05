import { Memory } from '../types';

const STORAGE_KEY = 'humanity_memory_grid';

export const loadMemories = (): Memory[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load memories:', error);
    return [];
  }
};

export const saveMemories = (memories: Memory[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch (error) {
    console.error('Failed to save memories:', error);
  }
};

export const addMemory = (memory: Omit<Memory, 'id' | 'timestamp' | 'dateAdded'>): Memory => {
  const memories = loadMemories();
  const newMemory: Memory = {
    ...memory,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    dateAdded: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
  };

  memories.unshift(newMemory);
  saveMemories(memories);

  return newMemory;
};

export const exportMemories = (): void => {
  const memories = loadMemories();
  const dataStr = JSON.stringify(memories, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `humanity-memory-grid-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
