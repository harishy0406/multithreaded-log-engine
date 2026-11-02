import React, { useState } from 'react';
import { BenchmarkResult } from '../../types';
import { apiService } from '../../services/api';
import { BarChart3, Play, RefreshCw, Zap } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const PerformanceBenchmarkPage: React.FC = () => {
  const [filePath, setFilePath] = useState('sample-data/large.log');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BenchmarkResult[]>([
    { filePath: 'sample-data/large.log', threadCount: 1, mode: 'sequential', totalRecords: 50000, durationMs: 480.0, throughput: 104166.6, speedup: 1.0, efficiency: 1.0 },
    { filePath: 'sample-data/large.log', threadCount: 2, mode: 'parallel', totalRecords: 50000, durationMs: 260.0, throughput: 192307.6, speedup: 1.84, efficiency: 0.92 },
    { filePath: 'sample-data/large.log', threadCount: 4, mode: 'parallel', totalRecords: 50000, durationMs: 140.0, throughput: 357142.8, speedup: 3.42, efficiency: 0.85 },
    { filePath: 'sample-data/large.log', threadCount: 8, mode: 'parallel', totalRecords: 50000, durationMs: 82.0, throughput: 609756.0, speedup: 5.85, efficiency: 0.73 },
    { filePath: 'sample-data/large.log', threadCount: 16, mode: 'parallel', totalRecords: 50000, durationMs: 65.0, throughput: 769230.7, speedup: 7.38, efficiency: 0.46 }
  ]);

  const handleRunBenchmarks = async () => {
    setLoading(true);
    const res = await apiService.runBenchmarks(filePath);
    setResults(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-charcoal-800 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100">Sequential vs. Parallel Benchmarking Suite</h3>
          <p className="text-xs text-slate-400 mt-0.5">Measure execution time, throughput (records/sec), speedup, and efficiency across thread counts.</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none"
          >
            <option value="sample-data/large.log">large.log (50k records)</option>
            <option value="sample-data/medium.log">medium.log (15k records)</option>
            <option value="sample-data/small.log">small.log (1k records)</option>
          </select>
          <button
            onClick={handleRunBenchmarks}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2 rounded-xl transition-colors flex items-center space-x-2 text-sm disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>Run Benchmark</span>
          </button>
        </div>
      </div>

      {/* Benchmark Chart */}
      <div className="bg-charcoal-800 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-base font-bold text-slate-100 mb-6">Throughput Comparison (Records / Sec)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={results}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="threadCount" stroke="#64748b" tickFormatter={(v) => `${v} Threads`} />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }} />
              <Bar dataKey="throughput" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Benchmark Table */}
      <div className="bg-charcoal-800 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-base font-bold text-slate-100">Detailed Performance Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-slate-400 font-medium text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Threads</th>
                <th className="px-6 py-4">Mode</th>
                <th className="px-6 py-4">Records</th>
                <th className="px-6 py-4">Duration (ms)</th>
                <th className="px-6 py-4">Throughput (rec/s)</th>
                <th className="px-6 py-4">Speedup</th>
                <th className="px-6 py-4">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {results.map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-100">{r.threadCount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      r.mode === 'parallel' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-700/20 text-slate-400'
                    }`}>
                      {r.mode}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono">{r.totalRecords.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono">{r.durationMs.toFixed(1)} ms</td>
                  <td className="px-6 py-4 font-mono text-emerald-400 font-bold">{(r.throughput).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                  <td className="px-6 py-4 font-mono text-indigo-400 font-bold">{r.speedup.toFixed(2)}x</td>
                  <td className="px-6 py-4 font-mono">{(r.efficiency * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
