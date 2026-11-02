export type NavigationTab =
  | 'overview'
  | 'processing'
  | 'threads'
  | 'benchmarks'
  | 'analytics'
  | 'history'
  | 'settings';

export interface DashboardSummary {
  totalRecords: number;
  activeWorkers: number;
  totalErrors: number;
  totalWarnings: number;
  avgProcessingTimeMs: number;
  throughput: number;
  status: string;
}

export interface ProcessingJobConfig {
  filePath: string;
  threadCount: number;
  bufferSize: number;
  parallel: boolean;
}

export interface ProcessingResultData {
  success: boolean;
  filePath: string;
  executionMode: string;
  threadCount: number;
  totalRecords: number;
  durationMs: number;
  throughput: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  malformedCount: number;
  topErrors: { message: string; count: number }[];
  topSources: { source: string; count: number }[];
}

export interface BenchmarkResult {
  filePath: string;
  threadCount: number;
  mode: string;
  totalRecords: number;
  durationMs: number;
  throughput: number;
  speedup: number;
  efficiency: number;
}

export interface HistoryRecordItem {
  id: number;
  fileName: string;
  fileSize: number;
  executionMode: string;
  threadCount: number;
  recordsProcessed: number;
  durationMs: number;
  throughput: number;
  status: string;
  timestamp: string;
}
