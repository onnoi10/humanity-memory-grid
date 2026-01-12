import { useState, FormEvent } from 'react';
import { User } from '@supabase/supabase-js';
import { AlertCircle, X } from 'lucide-react';
import { MemoryCategory, MemoryVisibility } from '../types';
import { addMemory } from '../utils/storage';

interface AddMemoryProps {
  onNavigate: (page: string) => void;
  user: User | null;
  onMemoryCreated?: () => void;
}

export default function AddMemory({ onNavigate, user, onMemoryCreated }: AddMemoryProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('Knowledge');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<MemoryVisibility>('private');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; category?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: { title?: string; category?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null); // Clear any previous errors

    if (!validateForm()) {
      return;
    }

    if (!content.trim()) {
      return;
    }

    if (!user) {
      // Redirect to login if not authenticated
      onNavigate('login');
      return;
    }

    setIsSubmitting(true);

    try {
      await addMemory({
        title: title.trim(),
        category,
        content: content.trim(),
        visibility,
      }, user.email ?? null);

      // Trigger refresh of memories list
      onMemoryCreated?.();

      setTimeout(() => {
        onNavigate('memories');
      }, 300);
    } catch (error: any) {
      // Log the full error for debugging
      console.error('Failed to add memory:', error);
      
      // Extract user-friendly error message
      let errorMessage = 'Failed to create memory. Please try again.';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Set the error message to display to the user
      setSubmitError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Preserve a Memory
          </h1>
          <p className="text-gray-400">
            Contribute to the collective knowledge of humanity.
            Your memory will be permanently stored in the grid.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error message display */}
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-400 mb-1">Error creating memory</p>
                <p className="text-sm text-red-300">{submitError}</p>
              </div>
              <button
                type="button"
                onClick={() => setSubmitError(null)}
                className="text-red-400 hover:text-red-300 transition-colors"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-lg border border-cyan-900/20 rounded-2xl p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) {
                      setErrors({ ...errors, title: undefined });
                    }
                    // Clear submit error when user starts editing
                    if (submitError) {
                      setSubmitError(null);
                    }
                  }}
                  required
                  placeholder="A concise title for this memory"
                  className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.title
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-700 focus:ring-cyan-500 focus:border-transparent'
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value as MemoryCategory);
                    if (errors.category) {
                      setErrors({ ...errors, category: undefined });
                    }
                    // Clear submit error when user starts editing
                    if (submitError) {
                      setSubmitError(null);
                    }
                  }}
                  required
                  className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.category
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-700 focus:ring-cyan-500 focus:border-transparent'
                  }`}
                >
                  <option value="Knowledge">Knowledge</option>
                  <option value="Experience">Experience</option>
                  <option value="Lesson">Lesson</option>
                  <option value="Mistake">Mistake</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-400">{errors.category}</p>
                )}
              </div>

              <div>
                <label htmlFor="visibility" className="block text-sm font-medium text-gray-300 mb-2">
                  Visibility
                </label>
                <select
                  id="visibility"
                  value={visibility}
                  onChange={(e) => {
                    setVisibility(e.target.value as MemoryVisibility);
                    // Clear submit error when user starts editing
                    if (submitError) {
                      setSubmitError(null);
                    }
                  }}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  <option value="private">Private (only visible to me)</option>
                  <option value="public">Public (visible to everyone)</option>
                </select>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    // Clear submit error when user starts editing
                    if (submitError) {
                      setSubmitError(null);
                    }
                  }}
                  required
                  rows={12}
                  placeholder="Share your knowledge, experience, lesson, or mistake in detail. Future generations will learn from this."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !category || !content.trim()}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
            >
              {isSubmitting ? 'Preserving...' : 'Preserve Memory'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('memories')}
              className="px-6 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
