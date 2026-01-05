import { User } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-lg border border-cyan-900/20 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-cyan-400" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Identity Layer
          </h1>

          <p className="text-gray-400 leading-relaxed mb-8">
            Identity systems will be added in future versions of the Grid.
          </p>

          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 text-left">
            <p className="text-sm text-gray-400 leading-relaxed">
              The Humanity Memory Grid is designed to preserve knowledge independent of individual identity.
              In future releases, cryptographic identity verification will allow contributors to claim ownership
              of their memories while maintaining the permanent, immutable nature of the archive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
