import { Database, LogOut } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
}

export default function Navigation({ currentPage, onNavigate, user, onLogout }: NavigationProps) {
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-cyan-900/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <Database className="w-6 h-6 text-cyan-400" />
          <span className="text-lg font-semibold text-white tracking-wide">
            Humanity Memory Grid
          </span>
        </div>

        <div className="flex items-center gap-6">
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
          
          {user ? (
            <>
              <button
                onClick={() => onNavigate('add')}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-medium rounded-lg transition-all"
              >
                + Add Memory
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                    <span className="text-xs font-medium text-cyan-400">{userInitial}</span>
                  </div>
                  <span className="text-sm text-gray-300 max-w-[150px] truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
