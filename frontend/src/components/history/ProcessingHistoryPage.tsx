import React, { useState, useEffect } from 'react';
import { HistoryRecordItem } from '../../types';
import { apiService } from '../../services/api';
import { History, CheckCircle, ExternalLink } from 'lucide-react';

export const ProcessingHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryRecordItem[]>([]);

  useEffect(() => {
    apiService.getHistory().then(setHistory);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-charcoal-800 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-base font-bold text-slate-100 flex items-center">
          <History className="w-5 h-5 mr-2 text-indigo-400" />
          Processing History Audit Trail
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">Historical record of all log processing jobs, performance metrics, and SQLite audit storage.</p>
      </div>

      <div className="bg-charcoal-800 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-slate-400 font-medium text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">File Name</th>
                <th className="px-6 py-4">Mode</th>
                <th className="px-6 py-4">Threads</th>
                <th className="px-6 py-4">Records</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Throughput</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">#{item.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-100">{item.fileName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {item.executionMode}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono">{item.threadCount}</td>
                  <td className="px-6 py-4 font-mono">{item.recordsProcessed.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono">{item.durationMs.toFixed(1)} ms</td>
                  <td className="px-6 py-4 font-mono text-emerald-400 font-bold">{(item.throughput).toLocaleString(undefined, {maximumFractionDigits: 0})} r/s</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center text-emerald-400 text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-mono">{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
