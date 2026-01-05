import { useState } from 'react';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Memories from './pages/Memories';
import AddMemory from './pages/AddMemory';
import Login from './pages/Login';

type Page = 'home' | 'memories' | 'add' | 'login';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

      {currentPage === 'home' && <Landing onNavigate={handleNavigate} />}
      {currentPage === 'memories' && <Memories onNavigate={handleNavigate} />}
      {currentPage === 'add' && <AddMemory onNavigate={handleNavigate} />}
      {currentPage === 'login' && <Login />}
    </div>
  );
}

export default App;
