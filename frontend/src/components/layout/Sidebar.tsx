import React from 'react';
import { NavigationTab } from '../../types';
import {
  LayoutDashboard,
  Terminal,
  Cpu,
  BarChart3,
  AlertTriangle,
  History,
  Settings,
  Layers
} from 'lucide-react';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'processing', label: 'Log Processing', icon: <Terminal className="w-5 h-5" /> },
    { id: 'threads', label: 'Thread Monitor', icon: <Cpu className="w-5 h-5" /> },
    { id: 'benchmarks', label: 'Performance Benchmarks', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'analytics', label: 'Log Analytics', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'history', label: 'Processing History', icon: <History className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-charcoal-800 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-slate-100 tracking-wide text-sm">Log Engine</h1>
          <p className="text-xs text-slate-400">High-Performance C++20</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Engine Status</span>
            <span className="flex items-center text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
              Active
            </span>
          </div>
          <div className="text-xs font-mono text-slate-300">C++20 Producer-Consumer</div>
        </div>
      </div>
    </aside>
  );
};
