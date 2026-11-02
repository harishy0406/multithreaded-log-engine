import React from 'react';
import { Cpu, CheckCircle, Activity, Layers } from 'lucide-react';

export const ThreadMonitorPage: React.FC = () => {
  const workers = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    state: i < 7 ? 'BUSY' : 'IDLE',
    tasksProcessed: 6250 + i * 140,
    currentTask: i < 7 ? `Parsing chunk #${100 + i} (Buffer 64KB)` : 'Waiting for task',
    cpuUsage: i < 7 ? `${12 + (i * 3)}%` : '0%'
  }));

  return (
    <div className="space-y-6">
      <div className="bg-charcoal-800 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100">Thread Pool & Worker Concurrency</h3>
          <p className="text-xs text-slate-400 mt-0.5">Active worker threads managed by producer-consumer thread pool.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
            Queue Capacity: <strong className="text-indigo-400">20,000 tasks</strong>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
            Active Workers: <strong className="text-emerald-400">8 / 8</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {workers.map((worker) => {
          const isBusy = worker.state === 'BUSY';
          return (
            <div key={worker.id} className="bg-charcoal-800 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-xl ${isBusy ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-700/20 text-slate-400'}`}>
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-100">Worker #{worker.id}</span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  isBusy ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700/20 text-slate-400'
                }`}>
                  {worker.state}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Processed Tasks:</span>
                  <span className="font-mono text-slate-200">{worker.tasksProcessed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>CPU Load:</span>
                  <span className="font-mono text-indigo-400">{worker.cpuUsage}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-slate-300 truncate font-mono">
                  {worker.currentTask}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
