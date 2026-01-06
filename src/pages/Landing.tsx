import { Shield, Lock, Globe } from 'lucide-react';

interface LandingProps {
  onNavigate: (page: string) => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <div
      className="min-h-screen pt-20 relative overflow-hidden"
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}bg-grid.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Page content */}
      <div className="relative z-10">
        <section className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            A system that remembers
            <br />
            for humanity.
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Store knowledge, experiences, lessons, and mistakes so future generations can learn from them.
            The grid never forgets.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate('memories')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all text-lg"
            >
              Explore The Grid
            </button>
            <button
              onClick={() => onNavigate('add')}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/10 transition-all text-lg"
            >
              Join the Collective
            </button>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-lg border border-cyan-900/20 rounded-2xl p-8 hover:border-cyan-700/40 transition-all">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Permanent Storage
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your memories are cryptographically secured and distributed across the grid.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-lg border border-cyan-900/20 rounded-2xl p-8 hover:border-cyan-700/40 transition-all">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Truth Preserved
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Immutable records ensure that history is remembered exactly as it happened.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-lg border border-cyan-900/20 rounded-2xl p-8 hover:border-cyan-700/40 transition-all">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Universal Access
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Knowledge should belong to everyone. The grid is open to all of humanity.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Why this matters
          </h2>
          <blockquote className="text-2xl text-gray-300 italic mb-6 leading-relaxed">
            "Those who cannot remember the past are condemned to repeat it."
          </blockquote>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            We are building the first truly resilient archive of human experience.
          </p>
          <button
            onClick={() => onNavigate('add')}
            className="text-cyan-400 hover:text-cyan-300 font-medium text-lg transition-colors inline-flex items-center gap-2"
          >
            Add your contribution
            <span>→</span>
          </button>
        </section>

        <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-cyan-900/20">
          <p className="text-center text-gray-500 text-sm">
            This is the first node of the Humanity Memory Grid.
          </p>
        </footer>
      </div>
    </div>
  );
}