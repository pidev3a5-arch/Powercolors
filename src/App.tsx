import { Palette, Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 mb-2">
          <Palette className="w-8 h-8 mr-2" />
          <Sparkles className="w-5 h-5 text-amber-300" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Power<span className="text-amber-400">Colors</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Extract 10-color palettes from any image and export instant Power BI themes.
        </p>
        <div className="inline-block px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
          ● Phase 1 Scaffolding Initialized
        </div>
      </div>
    </div>
  );
}
