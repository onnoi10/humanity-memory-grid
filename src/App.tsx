import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Memories from './pages/Memories';
import AddMemory from './pages/AddMemory';
import Login from './pages/Login';
import { supabase } from './lib/supabase';

type Page = 'home' | 'memories' | 'add' | 'login';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for error parameters in URL hash (from email links)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const error = hashParams.get('error');
    
    if (error) {
      // If there's an auth error, redirect to login page
      setCurrentPage('login');
      // Clean up URL
      window.history.replaceState(null, '', window.location.pathname);
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = () => {
    // Redirect to home after successful login
    handleNavigate('home');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleNavigate('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />

      {currentPage === 'home' && <Landing onNavigate={handleNavigate} />}
      {currentPage === 'memories' && <Memories onNavigate={handleNavigate} />}
      {currentPage === 'add' && <AddMemory onNavigate={handleNavigate} />}
      {currentPage === 'login' && <Login onAuthSuccess={handleAuthSuccess} />}
    </div>
  );
}

export default App;
