# MultiThreaded Log Engine — Architecture Overview

## System Architecture

The MultiThreaded Log Engine is engineered with a high-performance C++20 core backend and a modern React observability dashboard.

### Core Modules

1. **Log Reader (`LogReader`)**: Streams large log files efficiently using configurable buffers (default 64KB) without loading entire files into RAM. Handles chunk boundaries and partial lines.
2. **Log Parser (`LogParser`)**: Parses structured, Syslog, Apache/Nginx, and plain-text log records into standardized `LogRecord` structs.
3. **Producer-Consumer Pipeline & ThreadPool (`ThreadPool`, `ThreadSafeQueue`)**: A bounded, thread-safe task queue manages backpressure. A producer thread reads and feeds raw log lines into the queue while worker threads concurrently parse and analyze records.
4. **Log Analysis Engine (`LogAnalyzer`)**: Thread-safely aggregates log level distributions, top error patterns, source modules, and time-based event timelines.
5. **Performance Benchmarker (`BenchmarkEngine`)**: Executes comparative runs across sequential (1 thread) and parallel (N threads) modes to compute execution time, throughput, speedup, and parallel efficiency.
6. **Storage Layer (`LogStorage`)**: SQLite3-backed persistence layer storing processing history, throughput metrics, and audit reports.
7. **REST API & Frontend**: C++ REST server communicating with a React/TypeScript/Tailwind/Recharts dark-mode observability dashboard.
