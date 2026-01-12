import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { BookOpen, Lightbulb, GraduationCap, AlertCircle, Download } from 'lucide-react';
import { Memory } from '../types';
import { loadMemories, exportMemories } from '../utils/storage';

interface MemoriesProps {
  onNavigate: (page: string) => void;
  user: User | null;
  refreshKey?: number;
}

const categoryIcons = {
  Knowledge: BookOpen,
  Experience: Lightbulb,
  Lesson: GraduationCap,
  Mistake: AlertCircle,
};

const categoryColors = {
  Knowledge: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  Experience: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
  Lesson: 'from-green-500/20 to-green-600/20 border-green-500/30',
  Mistake: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
};

export default function Memories({ onNavigate, user, refreshKey }: MemoriesProps) {
  const [publicMemories, setPublicMemories] = useState<Memory[]>([]);
  const [privateMemories, setPrivateMemories] = useState<Memory[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const userId = user?.id ?? null;
      const allMemories = await loadMemories(userId);
      
      // Separate memories by visibility
      const publicMem = allMemories.filter(m => m.visibility === 'public');
      const privateMem = allMemories.filter(m => m.visibility === 'private');
      
      setPublicMemories(publicMem);
      setPrivateMemories(privateMem);
    };

    loadData();
  }, [user, refreshKey]);

  const getPreview = (content: string) => {
    return content.length > 150 ? content.slice(0, 150) + '...' : content;
  };

  const renderMemoryCard = (memory: Memory, isPublic: boolean) => {
    const Icon = categoryIcons[memory.category];
    const colorClass = categoryColors[memory.category];

    return (
      <div
        key={memory.id}
        className={`bg-gradient-to-br ${colorClass} backdrop-blur-lg border rounded-2xl p-6 hover:scale-[1.02] transition-transform cursor-pointer`}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1 truncate">
              {memory.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400">
                {memory.category}
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {getPreview(memory.content)}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="text-xs text-gray-500">
            {memory.dateAdded}
          </div>
          {/* Show author attribution only for public memories */}
          {isPublic && memory.authorEmail && (
            <div className="text-xs text-gray-400">
              <span className="text-gray-500">by </span>
              <span className="text-cyan-300" title={memory.authorEmail}>
                {memory.authorEmail.split('@')[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const totalMemories = publicMemories.length + privateMemories.length;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">
              The Memory Grid
            </h1>
            <p className="text-gray-400">
              {totalMemories} {totalMemories === 1 ? 'memory' : 'memories'} preserved for humanity
            </p>
          </div>
          {totalMemories > 0 && (
            <button
              onClick={async () => {
                try {
                  await exportMemories(user?.id ?? null);
                } catch (error) {
                  console.error('Failed to export memories:', error);
                }
              }}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/10 transition-all"
              title="Download all memories as JSON"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>

        {totalMemories === 0 ? (
          <div className="text-center py-24">
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-lg border border-cyan-900/20 rounded-2xl p-12 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-white mb-4">
                The grid is empty
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Be the first to contribute to the collective memory of humanity.
                Every memory preserved is a lesson for future generations.
              </p>
              <button
                onClick={() => onNavigate('add')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all"
              >
                Add First Memory
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Public Memories Section */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white">
                  Public Memories
                </h2>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm font-medium rounded-full border border-cyan-500/30">
                  {publicMemories.length} {publicMemories.length === 1 ? 'memory' : 'memories'}
                </span>
              </div>
              {publicMemories.length === 0 ? (
                <div className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 backdrop-blur-lg border border-slate-700/30 rounded-xl p-8 text-center">
                  <p className="text-gray-400 mb-2">
                    No public memories have been shared yet.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Public memories are visible to everyone and contribute to the collective knowledge of humanity.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publicMemories.map((memory) => renderMemoryCard(memory, true))}
                </div>
              )}
            </div>

            {/* Private Memories Section - Only show if user is logged in */}
            {user && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">
                    My Private Memories
                  </h2>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full border border-purple-500/30">
                    {privateMemories.length} {privateMemories.length === 1 ? 'memory' : 'memories'}
                  </span>
                </div>
                {privateMemories.length === 0 ? (
                  <div className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 backdrop-blur-lg border border-slate-700/30 rounded-xl p-8 text-center">
                    <p className="text-gray-400 mb-2">
                      You haven't created any private memories yet.
                    </p>
                    <p className="text-gray-500 text-sm">
                      Private memories are personal and optional. They're only visible to you and help you keep track of your own thoughts and experiences.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {privateMemories.map((memory) => renderMemoryCard(memory, false))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
