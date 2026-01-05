export type MemoryCategory = 'Knowledge' | 'Experience' | 'Lesson' | 'Mistake';

export interface Memory {
  id: string;
  title: string;
  category: MemoryCategory;
  content: string;
  timestamp: number;
  dateAdded: string;
}
