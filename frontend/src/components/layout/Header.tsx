import React from 'react';
import { NavigationTab } from '../../types';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

interface HeaderProps {
  currentTab: NavigationTab;
}

export const Header: React.FC<HeaderProps> = ({ currentTab }) => {
  const titles: Record<NavigationTab, { title: string; subtitle: string }> = {
    overview: { title: 'System Overview', subtitle: 'Real-time log ingestion, processing metrics, and health status.' },
    processing: { title: 'Log Processing Engine', subtitle: 'Ingest, parse, and process log streams with multi-threaded worker pools.' },
    threads: { title: 'Thread Pool Monitor', subtitle: 'Visualize worker thread activity, bounded queues, and concurrency state.' },
    benchmarks: { title: 'Performance Benchmarks', subtitle: 'Compare sequential vs. parallel throughput, execution speedups, and efficiency.' },
    analytics: { title: 'Log Analytics & Insights', subtitle: 'Analyze error frequencies, anomaly detection, and log pattern distributions.' },
    history: { title: 'Processing History', subtitle: 'Audit past processing runs, log file sizes, and historical performance reports.' },
    settings: { title: 'Engine Settings', subtitle: 'Configure default worker thread counts, buffer sizes, and queue limits.' },
  };

  return (
    <header className="bg-charcoal-800/80 backdrop-blur-md border-b border-slate-800 px-8 py-6 sticky top-0 z-10 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-100">{titles[currentTab].title}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{titles[currentTab].subtitle}</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>Workers: <strong className="text-slate-100">8 Threads</strong></span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Throughput: <strong className="text-slate-100">24.5k rec/s</strong></span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span>Sanitizers: <strong className="text-emerald-400">ASan / TSan</strong></span>
        </div>
      </div>
    </header>
  );
};
