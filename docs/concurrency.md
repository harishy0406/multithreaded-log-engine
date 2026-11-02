# Concurrency Design & Synchronization

## Overview

The MultiThreaded Log Engine uses modern C++20 concurrency primitives to maximize multicore utilization while eliminating data races and deadlocks.

### Key Concurrency Mechanisms

1. **Bounded Thread-Safe Task Queue (`ThreadSafeQueue<T>`)**:
   - Implements a condition-variable based producer-consumer queue with fixed capacity limits.
   - Provides natural **backpressure**: if worker threads fall behind, the producer blocks when the queue reaches max capacity, preventing unbounded memory growth.
   - Protected by `std::mutex` and coordinated with `std::condition_variable` (`not_full_`, `not_empty_`).

2. **Thread Pool (`ThreadPool`)**:
   - Reusable worker threads waiting on the task queue.
   - Graceful shutdown protocol ensuring all pending tasks complete before workers join.

3. **Safe Aggregation (`LogAnalyzer`)**:
   - Thread-safe updates to aggregate counters and frequency maps using mutex locking around critical sections.
   - Atomic counters (`std::atomic`) for high-frequency progress tracking.

### Trade-offs

- **Mutex Locking vs Lock-Free**: While lock-free queues offer ultra-low latency in specialized scenarios, condition-variable based bounded queues provide excellent CPU scheduling efficiency and block cleanly when idle without busy-waiting.
