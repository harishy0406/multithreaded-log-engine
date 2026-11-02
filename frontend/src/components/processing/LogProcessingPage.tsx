import React, { useState } from 'react';
import { ProcessingJobConfig, ProcessingResultData } from '../../types';
import { apiService } from '../../services/api';
import { Play, FileText, Cpu, Sliders, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export const LogProcessingPage: React.FC = () => {
  const [filePath, setFilePath] = useState('sample-data/large.log');
  const [threadCount, setThreadCount] = useState(8);
  const [bufferSize, setBufferSize] = useState(65536);
  const [parallel, setParallel] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessingResultData | null>(null);

  const handleStartProcessing = async () => {
    setLoading(true);
    setResult(null);
    const config: ProcessingJobConfig = { filePath, threadCount, bufferSize, parallel };
    const res = await apiService.startProcessing(config);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="bg-charcoal-800 border border-slate-800 p-6 rounded-2xl space-y-5">
          <h3 className="text-base font-bold text-slate-100 flex items-center">
            <Sliders className="w-5 h-5 mr-2 text-indigo-400" />
            Job Configuration
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Input Log File</label>
              <select
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="sample-data/large.log">sample-data/large.log (High-Throughput)</option>
                <option value="sample-data/medium.log">sample-data/medium.log (Standard Server)</option>
                <option value="sample-data/small.log">sample-data/small.log (Diagnostic)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Worker Threads: <span className="text-indigo-400 font-bold">{threadCount}</span>
              </label>
              <input
                type="range"
                min="1"
                max="32"
                value={threadCount}
                onChange={(e) => setThreadCount(Number(e.target.value))}
                className="w-full accent-indigo-600 bg-slate-900"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1 (Sequential)</span>
                <span>16</span>
                <span>32 Threads</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Buffer Size (Bytes)</label>
              <select
                value={bufferSize}
                onChange={(e) => setBufferSize(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="16384">16 KB (Low memory)</option>
                <option value="65536">64 KB (Default optimal)</option>
                <option value="262144">256 KB (High throughput)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium text-slate-300">Parallel Execution Mode</span>
              <input
                type="checkbox"
                checked={parallel}
                onChange={(e) => setParallel(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded bg-slate-900 border-slate-700"
              />
            </div>
          </div>

          <button
            onClick={handleStartProcessing}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Processing Log Stream...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Processing Engine</span>
              </>
            )}
          </button>
        </div>

        {/* Results & Live Telemetry */}
        <div className="lg:col-span-2 bg-charcoal-800 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-slate-100 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-400" />
                Execution Results & Telemetry
              </h3>
              {result && (
                <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium border border-emerald-500/20 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Success
                </span>
              )}
            </div>

            {result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400">Total Records</span>
                    <div className="text-xl font-bold font-mono text-slate-100 mt-1">{result.totalRecords.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400">Duration</span>
                    <div className="text-xl font-bold font-mono text-slate-100 mt-1">{result.durationMs.toFixed(2)} ms</div>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400">Throughput</span>
                    <div className="text-xl font-bold font-mono text-indigo-400 mt-1">{(result.throughput).toLocaleString(undefined, {maximumFractionDigits: 0})} r/s</div>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400">Workers</span>
                    <div className="text-xl font-bold font-mono text-slate-100 mt-1">{result.threadCount} Threads</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Top Error Patterns Detected</h4>
                  <div className="space-y-2">
                    {result.topErrors.map((err, idx) => (
                      <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-sm">
                        <span className="text-rose-400 font-mono text-xs truncate max-w-md">{err.message}</span>
                        <span className="bg-rose-500/10 text-rose-400 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">{err.count} hits</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
                <Cpu className="w-12 h-12 text-slate-700 animate-pulse" />
                <p className="text-sm">Configure job parameters and click 'Start Processing Engine' to execute high-performance log analysis.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
