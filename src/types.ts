export type MemoryCategory = 'Knowledge' | 'Experience' | 'Lesson' | 'Mistake';
export type MemoryVisibility = 'private' | 'public';

export interface Memory {
  id: string;
  title: string;
  category: MemoryCategory;
  content: string;
  visibility: MemoryVisibility;
  userId: string | null;
  authorEmail: string | null;
  timestamp: number;
  dateAdded: string;
}
