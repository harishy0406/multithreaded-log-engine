import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Play } from 'lucide-react';

interface LogLine {
  id: number;
  level: string;
  source: string;
  message: string;
  timestamp: string;
  processing_time_ms: number;
  queue_time_ms: number;
}

export const LiveStream: React.FC = () => {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [processingStats, setProcessingStats] = useState({
    totalRecords: 0,
    totalTimeMs: 0,
    avgProcessingTimeMs: 0,
    maxProcessingTimeMs: 0,
    minProcessingTimeMs: 0,
  });

  useEffect(() => {
    const initialLogs: LogLine[] = [
      { id: 1, level: 'INFO', source: 'WebServer', message: 'Health check passed successfully', timestamp: '10:00:01', processing_time_ms: 2, queue_time_ms: 1 },
      { id: 2, level: 'WARNING', source: 'Database', message: 'Slow query detected: 45ms elapsed', timestamp: '10:00:02', processing_time_ms: 45, queue_time_ms: 2 },
      { id: 3, level: 'ERROR', source: 'Auth', message: 'Invalid token presented for session #4921', timestamp: '10:00:03', processing_time_ms: 150, queue_time_ms: 5 },
      { id: 4, level: 'INFO', source: 'Cache', message: 'Cache eviction triggered successfully', timestamp: '10:00:04', processing_time_ms: 1, queue_time_ms: 0 },
      { id: 5, level: 'DEBUG', source: 'Worker-1', message: 'Parsing batch #12 - 500 records', timestamp: '10:00:05', processing_time_ms: 8, queue_time_ms: 2 },
      { id: 6, level: 'INFO', source: 'Payment', message: 'Refund transaction #9821 processed successfully', timestamp: '10:00:06', processing_time_ms: 3, queue_time_ms: 1 },
      { id: 7, level: 'WARNING', source: 'System', message: 'Memory utilization threshold exceeded 80%', timestamp: '10:00:07', processing_time_ms: 200, queue_time_ms: 10 },
      { id: 8, level: 'ERROR', source: 'Database', message: 'Connection pool timeout spike detected', timestamp: '10:00:08', processing_time_ms: 500, queue_time_ms: 50 },
    ];
    setLogs(initialLogs);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        // Generate realistic log entries with statistical distribution
        const levelWeights = { 'ERROR': 0.12, 'WARNING': 0.28, 'INFO': 0.48, 'DEBUG': 0.12 };
        const sources = ['WebServer', 'Database', 'Auth', 'Cache', 'Payment', 'Worker-1', 'System'];
        const messages = [
          'Request completed successfully',
          'Database connection timeout',
          'Invalid authentication token',
          'Cache cache eviction triggered',
          'Payment gateway failure',
          'Slow query detected',
          'Memory threshold exceeded',
          'API rate limit exceeded',
        ];

        const level = Math.random() < 0.12 ? 'ERROR' :
                       Math.random() < 0.28 ? 'WARNING' :
                       Math.random() < 0.48 ? 'INFO' : 'DEBUG';

        const source = sources[Math.floor(Math.random() * sources.length)];
        const message = messages[Math.floor(Math.random() * messages.length)];

        const newLog: LogLine = {
          id: logs.length + 1,
          level,
          source,
          message: `${message} at ${Math.floor(Math.random() * 10000)}ms`,
          timestamp: new Date().toLocaleTimeString(),
          processing_time_ms: Math.floor(Math.random() * 1000),
          queue_time_ms: Math.floor(Math.random() * 200),
        };

        setLogs(prev => [...prev, newLog]);

        // Update stats
        setProcessingStats(prev => {
          const newTotal = prev.totalRecords + 1;
          const newTotalTime = prev.totalTimeMs + newLog.processing_time_ms;
          const newAvg = newTotalTime / newTotal;
          const newMax = Math.max(prev.maxProcessingTimeMs, newLog.processing_time_ms);
          const newMin = Math.min(prev.minProcessingTimeMs > 0 ? prev.minProcessingTimeMs : newLog.processing_time_ms, newLog.processing_time_ms);

          return {
            totalRecords: newTotal,
            totalTimeMs: newTotalTime,
            avgProcessingTimeMs: newAvg,
            maxProcessingTimeMs: newMax,
            minProcessingTimeMs: newMin,
          };
        });
      }, 1000);

      setIsRunning(true);
      return () => clearInterval(interval);
    } else {
      setIsRunning(false);
    }
  }, [isRunning]);

  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'ERROR': return { color: 'text-rose-400', bg: 'bg-rose-500/10', icon: XCircle };
      case 'WARNING': return { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: AlertTriangle };
      case 'INFO': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle };
      case 'DEBUG': return { color: 'text-indigo-400', bg: 'bg-indigo-500/10', icon: CheckCircle };
      default: return { color: 'text-gray-400', bg: 'bg-gray-800/50', icon: XCircle };
    }
  };

  return (
    <div className="bg-charcoal-800 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 flex items-center">
          <span className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse mr-2"></span>
          Live Log Stream
        </h3>
        <div className="flex items-center space-x-3">
          <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse mr-1.5"></span>
            Live Engine Stream
          </div>
          <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Active: {isRunning ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-charcoal-800 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
              Processing Statistics
            </h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Total Records</div>
                <div className="text-xl font-bold font-mono text-slate-100 mt-1">{processingStats.totalRecords.toLocaleString()}</div>
                <div className="text-xs text-emerald-400 mt-1">Active Processing</div>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Avg Processing Time</div>
                <div className="text-xl font-bold font-mono text-indigo-400 mt-1">{processingStats.avgProcessingTimeMs.toFixed(1)} ms</div>
                <div className="text-xs text-slate-500 mt-1">Median: {processingStats.minProcessingTimeMs.toFixed(1)} ms</div>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Max Processing Time</div>
                <div className="text-xl font-bold font-mono text-amber-400 mt-1">{processingStats.maxProcessingTimeMs.toLocaleString()} ms</div>
                <div className="text-xs text-slate-500 mt-1">Peak load detected</div>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Queue Efficiency</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{(100 / (processingStats.maxProcessingTimeMs > 0 ? 1 + (processingStats.avgProcessingTimeMs / processingStats.maxProcessingTimeMs) : 1)).toFixed(1)}%</div>
                <div className="text-xs text-slate-500 mt-1">Throughput optimization</div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs font-medium text-slate-400">Real-time Status</h4>
                  <p className="text-xs text-slate-500">Current status of live log processing stream</p>
                </div>
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-indigo-600/20 flex items-center space-x-2"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Stop Processing</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>Start Processing</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-1000 ease-out"
                    style={{ width: isRunning ? '100%' : '0%' }}
                  ></div>
                </div>
                <span className="text-xs font-mono text-slate-300">
                  {isRunning ? 'Processing...' : 'Stopped'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};