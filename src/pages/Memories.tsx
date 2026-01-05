import { useEffect, useState } from 'react';
import { BookOpen, Lightbulb, GraduationCap, AlertCircle, Download } from 'lucide-react';
import { Memory } from '../types';
import { loadMemories, exportMemories } from '../utils/storage';

interface MemoriesProps {
  onNavigate: (page: string) => void;
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

export default function Memories({ onNavigate }: MemoriesProps) {
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    setMemories(loadMemories());
  }, []);

  const getPreview = (content: string) => {
    return content.length > 150 ? content.slice(0, 150) + '...' : content;
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">
              The Memory Grid
            </h1>
            <p className="text-gray-400">
              {memories.length} {memories.length === 1 ? 'memory' : 'memories'} preserved for humanity
            </p>
          </div>
          {memories.length > 0 && (
            <button
              onClick={() => exportMemories()}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/10 transition-all"
              title="Download all memories as JSON"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>

        {memories.length === 0 ? (
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory) => {
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
                      <span className="text-xs text-gray-400">
                        {memory.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {getPreview(memory.content)}
                  </p>

                  <div className="text-xs text-gray-500">
                    {memory.dateAdded}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
