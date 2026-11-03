import React, { useState, useEffect } from 'react';
import { Search, Filter, XCircle } from 'lucide-react';
import { LogLine } from '../../types';

export const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<LogLine[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data for demonstration - in a real system this would come from API
  const mockLogs: LogLine[] = [
    { id: 1, level: 'INFO', source: 'WebServer', message: 'Health check passed', timestamp: '10:00:01' },
    { id: 2, level: 'WARNING', source: 'Database', message: 'Slow query detected', timestamp: '10:00:02' },
    { id: 3, level: 'ERROR', source: 'Auth', message: 'Invalid token', timestamp: '10:00:03' },
    { id: 4, level: 'INFO', source: 'Cache', message: 'Cache cleared', timestamp: '10:00:04' },
    { id: 5, level: 'ERROR', source: 'Payment', message: 'Payment failed', timestamp: '10:00:05' },
    { id: 6, level: 'WARNING', source: 'System', message: 'Memory threshold exceeded', timestamp: '10:00:05' },
    { id: 7, level: 'INFO', source: 'Worker-1', message: 'Processing completed', timestamp: '10:00:06' },
    { id: 8, level: 'ERROR', source: 'Database', message: 'Connection timeout', timestamp: '10:00:07' },
    { id: 9, level: 'WARNING', source: 'Auth', message: 'Multiple failed login attempts', timestamp: '10:00:08' },
    { id: 10, level: 'ERROR', source: 'Payment', message: 'Transaction timeout', timestamp: '10:00:09' },
  ];

  useEffect(() => {
    if (isSearching) {
      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false);
      }, 800);
    }
  }, [isSearching]);

  useEffect(() => {
    if (searchTerm.length > 2) {
      setIsSearching(true);
      const filtered = mockLogs.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.level.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, isSearching]);

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className="bg-charcoal-800 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center">
            <span className="w-5 h-5 rounded-full bg-indigo-500 mr-2 text-indigo-400" />
            Search Logs
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Search through log entries for specific terms, patterns, or error conditions</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for error patterns, warnings, or keywords..."
              className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 w-full"
            />
            <XCircle className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>
          <div className="flex items-center space-x-2 bg-slate-900/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <Filter className="w-4 h-4" />
            <span className="pl-2">Filter by level, source, or time</span>
          </div>
        </div>
      </div>

      <div className="bg-charcoal-800 border border-slate-800 rounded-2xl p-6">
        <div className="space-y-4">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-slate-400">Search Results</div>
              <div className="text-xs text-slate-500">{searchResults.length} results found</div>
            </div>
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((log) => (
                  <div key={log.id} className="p-4 border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2.5 rounded-xl ${searchTerm.toLowerCase().includes(log.level.toLowerCase()) ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-700/20 text-slate-400'}`}>
                        <span className="text-xs font-mono text-slate-400">{log.level}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-slate-400">{log.source}</span>
                        <span className="text-xs text-slate-300 ml-1">• {log.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mt-1 truncate max-w-2xl">{log.message}</p>
                  </div>
                ))}
            } else if (isSearching) {
              <div className="p-6 text-center text-slate-400">
                <span className="w-8 h-3 bg-slate-700 rounded-full animate-pulse" />
                <p className="mt-2 text-sm text-slate-400">Searching...</span>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400">
                <span className="w-8 h-3 bg-slate-700 rounded-full animate-pulse" />
                <p className="mt-2 text-sm text-slate-400">Enter search term to find specific log entries</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};