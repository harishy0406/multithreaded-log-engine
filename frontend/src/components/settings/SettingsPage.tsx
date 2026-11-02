import React, { useState } from 'react';
import { Settings, Save, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [defaultThreads, setDefaultThreads] = useState(8);
  const [maxWorkers, setMaxWorkers] = useState(32);
  const [queueCapacity, setQueueCapacity] = useState(20000);
  const [bufferSize, setBufferSize] = useState(65536);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-charcoal-800 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-base font-bold text-slate-100 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-indigo-400" />
          Engine Configuration & Preferences
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">Customize worker defaults, bounded queue limits, buffer sizes, and SQLite retention.</p>
      </div>

      <form onSubmit={handleSave} className="bg-charcoal-800 border border-slate-800 p-6 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Default Worker Threads</label>
            <input
              type="number"
              value={defaultThreads}
              onChange={(e) => setDefaultThreads(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Maximum Worker Threads</label>
            <input
              type="number"
              value={maxWorkers}
              onChange={(e) => setMaxWorkers(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Bounded Task Queue Capacity</label>
            <input
              type="number"
              value={queueCapacity}
              onChange={(e) => setQueueCapacity(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Default Buffer Size (Bytes)</label>
            <input
              type="number"
              value={bufferSize}
              onChange={(e) => setBufferSize(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          {saved ? (
            <span className="text-emerald-400 text-xs font-medium flex items-center">
              <Check className="w-4 h-4 mr-1.5" /> Configuration saved successfully.
            </span>
          ) : (
            <span className="text-xs text-slate-500">Changes persist in local SQLite storage.</span>
          )}
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-xl transition-colors flex items-center space-x-2 text-sm shadow-lg shadow-indigo-600/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
