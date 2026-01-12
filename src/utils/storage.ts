import { Memory, MemoryVisibility } from '../types';
import { supabase } from '../lib/supabase';

// Helper function to transform database row to Memory interface
const transformDbRowToMemory = (row: any): Memory => {
  return {
    id: row.id,
    title: row.title,
    category: row.category as Memory['category'],
    content: row.content,
    visibility: row.visibility as MemoryVisibility,
    userId: row.user_id,
    authorEmail: row.author_email,
    timestamp: row.timestamp,
    dateAdded: row.date_added,
  };
};

// Helper function to transform Memory interface to database row
const transformMemoryToDbRow = (memory: Omit<Memory, 'id' | 'timestamp' | 'dateAdded'> & { id?: string; timestamp?: number; dateAdded?: string }) => {
  return {
    id: memory.id,
    title: memory.title,
    category: memory.category,
    content: memory.content,
    visibility: memory.visibility,
    user_id: memory.userId,
    author_email: memory.authorEmail,
    timestamp: memory.timestamp,
    date_added: memory.dateAdded,
  };
};

/**
 * Load public memories - no authentication required
 * Query: SELECT * FROM memories WHERE visibility = 'public' ORDER BY timestamp DESC
 */
export const loadPublicMemories = async (): Promise<Memory[]> => {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('visibility', 'public')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Failed to load public memories:', error);
      return [];
    }

    if (!data) return [];

    // Transform database rows to Memory interface
    return data.map(transformDbRowToMemory);
  } catch (error) {
    console.error('Failed to load public memories:', error);
    return [];
  }
};

/**
 * Load private memories for authenticated user
 * Query: SELECT * FROM memories WHERE visibility = 'private' AND user_id = $userId ORDER BY timestamp DESC
 * Requires: User must be authenticated
 */
export const loadPrivateMemories = async (userId: string): Promise<Memory[]> => {
  try {
    if (!userId) {
      console.warn('Cannot load private memories: user ID is required');
      return [];
    }

    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('visibility', 'private')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Failed to load private memories:', error);
      return [];
    }

    if (!data) return [];

    // Transform database rows to Memory interface
    return data.map(transformDbRowToMemory);
  } catch (error) {
    console.error('Failed to load private memories:', error);
    return [];
  }
};

/**
 * Load all memories (public + private for authenticated user)
 * This is a convenience function that calls both loadPublicMemories and loadPrivateMemories
 * @deprecated Consider using loadPublicMemories() and loadPrivateMemories() separately for better clarity
 */
export const loadMemories = async (userId: string | null = null): Promise<Memory[]> => {
  try {
    // Always load public memories (no auth required)
    const publicMemories = await loadPublicMemories();

    // Load private memories only if user is authenticated
    const privateMemories = userId ? await loadPrivateMemories(userId) : [];

    // Combine and return
    return [...publicMemories, ...privateMemories];
  } catch (error) {
    console.error('Failed to load memories:', error);
    return [];
  }
};

export const addMemory = async (
  memory: Omit<Memory, 'id' | 'timestamp' | 'dateAdded' | 'visibility' | 'userId' | 'authorEmail'> & { visibility?: MemoryVisibility },
  authorEmail: string | null = null
): Promise<Memory> => {
  // Get the authenticated session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error('Failed to get authentication session');
  }

  // Ensure user is authenticated
  if (!session || !session.user) {
    throw new Error('User must be authenticated to create memories');
  }

  // Get user_id from the authenticated session
  const userId = session.user.id;

  // Validate all required fields are present
  if (!memory.title || !memory.title.trim()) {
    throw new Error('Title is required');
  }

  if (!memory.content || !memory.content.trim()) {
    throw new Error('Content is required');
  }

  if (!memory.category) {
    throw new Error('Category is required');
  }

  // Ensure visibility is set (default to private)
  const visibility = memory.visibility ?? 'private';
  
  // Only store author email for public memories (for attribution)
  // Private memories should not expose author details
  const authorEmailForMemory = visibility === 'public' ? authorEmail : null;

  const timestamp = Date.now();
  const dateAdded = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Ensure all required fields are included in the insert
  const dbRow = {
    title: memory.title.trim(),
    content: memory.content.trim(),
    category: memory.category,
    visibility,
    user_id: userId, // Always taken from authenticated session
    author_email: authorEmailForMemory,
    timestamp,
    date_added: dateAdded,
  };

  const { data, error } = await supabase
    .from('memories')
    .insert(dbRow)
    .select()
    .single();

  if (error) {
    console.error('Failed to add memory:', error);
    throw error;
  }

  return transformDbRowToMemory(data);
};

export const exportMemories = async (userId: string | null = null): Promise<void> => {
  try {
    const memories = await loadMemories(userId);
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
  } catch (error) {
    console.error('Failed to export memories:', error);
    throw error;
  }
};
