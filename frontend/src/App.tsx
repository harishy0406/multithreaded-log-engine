import React, { useState, useEffect } from 'react';
import { NavigationTab, DashboardSummary } from './types';
import { apiService } from './services/api';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { LogProcessingPage } from './components/processing/LogProcessingPage';
import { ThreadMonitorPage } from './components/thread-monitor/ThreadMonitorPage';
import { PerformanceBenchmarkPage } from './components/benchmarks/PerformanceBenchmarkPage';
import { LogAnalyticsPage } from './components/analytics/LogAnalyticsPage';
import { ProcessingHistoryPage } from './components/history/ProcessingHistoryPage';
import { SettingsPage } from './components/settings/SettingsPage';
import './styles/index.css';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [summary, setSummary] = useState<DashboardSummary>({
    totalRecords: 125430,
    activeWorkers: 8,
    totalErrors: 1420,
    totalWarnings: 3890,
    avgProcessingTimeMs: 48.5,
    throughput: 24500.0,
    status: 'IDLE'
  });

  useEffect(() => {
    apiService.getDashboardSummary().then(setSummary);
  }, []);

  return (
    <div className="flex min-h-screen bg-charcoal-900 text-slate-100">
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header currentTab={currentTab} />

        <main className="flex-1 p-8 overflow-y-auto">
          {currentTab === 'overview' && <OverviewDashboard summary={summary} />}
          {currentTab === 'processing' && <LogProcessingPage />}
          {currentTab === 'threads' && <ThreadMonitorPage />}
          {currentTab === 'benchmarks' && <PerformanceBenchmarkPage />}
          {currentTab === 'analytics' && <LogAnalyticsPage />}
          {currentTab === 'history' && <ProcessingHistoryPage />}
          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
