# MultiThreaded Log Engine

<div align="center">

![C++20](https://img.shields.io/badge/C%2B%2B-20-blue.svg?style=flat-square&logo=c%2B%2B)
![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6.svg?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8.svg?style=flat-square&logo=tailwind-css)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57.svg?style=flat-square&logo=sqlite)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg?style=flat-square&logo=docker)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)

A high-performance C++20 log processing and analysis system featuring a producer-consumer multithreaded architecture, bounded task queues, thread pools, SQLite persistence, and a modern React observability dashboard.

</div>

---

## Architecture Overview

```
[ Log File ] ──> [ Log Reader (Buffered) ]
                        │
                        ▼ (Raw Lines)
               [ Bounded Thread-Safe Queue ]
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
     [Worker 1]     [Worker 2]     [Worker N]
     (LogParser)    (LogParser)    (LogParser)
         │              │              │
         └──────────────┼──────────────┘
                        ▼
             [ Log Analysis Engine ]
                        │
                        ▼
             [ SQLite Storage & API ] ──> [ React Dashboard ]
```

---

## Technology Stack

- **Core Engine**: `C++20`, STL, `std::thread`, `std::mutex`, `std::condition_variable`, `std::atomic`
- **Build System**: `CMake` & `GoogleTest`
- **Storage**: `SQLite3`
- **Frontend**: `React`, `TypeScript`, `Vite`, `Tailwind CSS`, `Recharts`, `Lucide Icons`
- **DevOps**: `Docker`, `Docker Compose`, `GitHub Actions`

---

## Key Features

1. **Efficient Log Reader**: Streams large log files using configurable buffers without loading entire files into memory.
2. **Robust Log Parser**: Supports structured bracket logs, Apache/Nginx logs, Syslog, and plain text fallback.
3. **Producer-Consumer Pipeline**: Bounded task queue provides backpressure and safely coordinates concurrent workers.
4. **Reusable Thread Pool**: Configurable worker threads with exception safety and graceful shutdown.
5. **Log Analysis Engine**: Aggregates log levels, detects repeated error patterns, and tracks timelines.
6. **Performance Benchmarking**: Compares sequential vs. parallel throughput, speedups, and efficiency.
7. **Observability Dashboard**: Dark-mode UI featuring live telemetry charts, worker status, analytics, report exporting, and history audit trails.

---

## Folder Structure

```
multithreaded-log-engine/
├── backend/
│   ├── CMakeLists.txt
│   ├── include/engine/...
│   ├── src/...
│   └── tests/...
├── frontend/
│   ├── src/...
│   └── package.json
├── sample-data/
│   ├── small.log
│   ├── medium.log
│   └── large.log
├── docs/
│   ├── architecture.md
│   ├── concurrency.md
│   └── benchmarking.md
├── docker/
├── docker-compose.yml
├── Makefile
└── README.md
```

---

## Build & Run Instructions

### C++ Core & Tests
```bash
cd backend
mkdir build && cd build
cmake ..
cmake --build .
ctest --output-on-failure
```

### Run CLI Processing Engine
```bash
./backend/build/log_engine_app process ../sample-data/large.log 8 parallel
```

### Run Performance Benchmarks
```bash
./backend/build/log_engine_app benchmark ../sample-data/large.log
```

### Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```

### Docker Compose
```bash
docker-compose up --build
```

---

## License

MIT License. Co-authored with Claude Code.

Co-Authored-By: Claude Code <noreply@anthropic.com>
