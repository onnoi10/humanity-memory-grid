import { Database } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-cyan-900/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <Database className="w-6 h-6 text-cyan-400" />
          <span className="text-lg font-semibold text-white tracking-wide">
            Humanity Memory Grid
          </span>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('memories')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'memories'
                ? 'text-cyan-400'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Memories
          </button>
          <button
            onClick={() => onNavigate('login')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'login'
                ? 'text-cyan-400'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => onNavigate('add')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-medium rounded-lg transition-all"
          >
            + Add Memory
          </button>
        </div>
      </div>
    </nav>
  );
}
