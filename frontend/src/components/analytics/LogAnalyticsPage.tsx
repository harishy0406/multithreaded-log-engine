import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Search, Download, Check } from 'lucide-react';

export const LogAnalyticsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [exported, setExported] = useState(false);

  const anomalies = [
    { id: 1, severity: 'CRITICAL', source: 'Database', message: 'Connection pool timeout spike detected (145 occurrences in 60s)', timestamp: '10:14:22' },
    { id: 2, severity: 'WARNING', source: 'AuthService', message: 'Repeated unauthorized login attempts from subnet 203.0.113.0/24', timestamp: '10:12:05' },
    { id: 3, severity: 'WARNING', source: 'System', message: 'Memory utilization threshold exceeded 80%', timestamp: '10:05:40' },
  ];

  const filteredAnomalies = anomalies.filter(a =>
    a.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(anomalies, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "log_engine_analytics_report.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-charcoal-800 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100">Log Analytics & Anomaly Detection</h3>
          <p className="text-xs text-slate-400 mt-0.5">Automated detection of repeated errors, performance bottlenecks, and security anomalies.</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search log patterns..."
              className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 w-64"
            />
          </div>
          <button
            onClick={handleExportJSON}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2 shadow-lg shadow-indigo-600/20 whitespace-nowrap"
          >
            {exported ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{exported ? 'Exported!' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      <div className="bg-charcoal-800 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-rose-400" />
            Detected System Anomalies & Error Patterns
          </h3>
          <span className="bg-rose-500/10 text-rose-400 text-xs px-3 py-1 rounded-full font-medium border border-rose-500/20">
            {filteredAnomalies.length} Alerts Found
          </span>
        </div>
        <div className="divide-y divide-slate-800">
          {filteredAnomalies.map((anomaly) => (
            <div key={anomaly.id} className="p-5 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
              <div className="flex items-start space-x-4">
                <div className={`p-2.5 rounded-xl ${anomaly.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      anomaly.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {anomaly.severity}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{anomaly.source}</span>
                    <span className="text-xs text-slate-500">• {anomaly.timestamp}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-200 mt-1">{anomaly.message}</p>
                </div>
              </div>
              <button className="bg-slate-900 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-medium transition-colors border border-slate-700">
                Inspect Logs
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
