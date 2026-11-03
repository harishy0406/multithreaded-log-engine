export type LogLine = {
  id: number;
  level: string;
  source: string;
  message: string;
  timestamp: string;
  processing_time_ms: number;
  queue_time_ms: number;
};
