import { useState, FormEvent } from 'react';
import { MemoryCategory } from '../types';
import { addMemory } from '../utils/storage';

interface AddMemoryProps {
  onNavigate: (page: string) => void;
}

export default function AddMemory({ onNavigate }: AddMemoryProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('Knowledge');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    setIsSubmitting(true);

    addMemory({
      title: title.trim(),
      category,
      content: content.trim(),
    });

    setTimeout(() => {
      onNavigate('memories');
    }, 300);
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
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-lg border border-cyan-900/20 rounded-2xl p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="A concise title for this memory"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MemoryCategory)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  <option value="Knowledge">Knowledge</option>
                  <option value="Experience">Experience</option>
                  <option value="Lesson">Lesson</option>
                  <option value="Mistake">Mistake</option>
                </select>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
              disabled={isSubmitting || !title.trim() || !content.trim()}
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
