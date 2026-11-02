import React from 'react';
import { DashboardSummary } from '../../types';
import { Database, AlertCircle, AlertTriangle, Zap, CheckCircle2, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

interface OverviewDashboardProps {
  summary: DashboardSummary;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ summary }) => {
  const throughputData = [
    { time: '09:00', throughput: 18000 },
    { time: '09:10', throughput: 22000 },
    { time: '09:20', throughput: 25400 },
    { time: '09:30', throughput: 21000 },
    { time: '09:40', throughput: 28900 },
    { time: '09:50', throughput: 31200 },
    { time: '10:00', throughput: 24500 },
  ];

  const levelData = [
    { name: 'INFO', value: 92000, color: '#3b82f6' },
    { name: 'WARNING', value: 3890, color: '#f59e0b' },
    { name: 'ERROR', value: 1420, color: '#ef4444' },
    { name: 'DEBUG', value: 28120, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-charcoal-800 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Records</span>
            <div className="bg-indigo-500/10 p-2.5 rounded-xl text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-100">{summary.totalRecords.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> +12.4%
            </span>
          </div>
        </div>

        <div className="bg-charcoal-800 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Errors</span>
            <div className="bg-rose-500/10 p-2.5 rounded-xl text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-100">{summary.totalErrors.toLocaleString()}</span>
            <span className="text-xs text-rose-400 font-medium">Critical</span>
          </div>
        </div>

        <div className="bg-charcoal-800 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Warnings</span>
            <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-100">{summary.totalWarnings.toLocaleString()}</span>
            <span className="text-xs text-amber-400 font-medium">Monitor</span>
          </div>
        </div>

        <div className="bg-charcoal-800 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Throughput</span>
            <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-100">{summary.throughput.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-medium">records / sec</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Throughput Trend */}
        <div className="lg:col-span-2 bg-charcoal-800 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-100">Processing Throughput Over Time</h3>
              <p className="text-xs text-slate-400">Records parsed per second across parallel worker threads.</p>
            </div>
            <div className="flex items-center space-x-2 text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-indigo-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>Live Engine Stream</span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData}>
                <defs>
                  <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" textAnchor="end" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }} />
                <Area type="monotone" dataKey="throughput" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorThroughput)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Log Level Distribution */}
        <div className="bg-charcoal-800 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Log Level Distribution</h3>
            <p className="text-xs text-slate-400 mb-6">Classification breakdown across ingested logs.</p>

            <div className="space-y-4">
              {levelData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-mono text-slate-100">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Parsing Engine</span>
            <span className="text-emerald-400 font-medium flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 100% Parsed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
