# Benchmarking Methodology & Results

## Methodology

Benchmarks measure the performance difference between sequential execution (1 thread) and parallel execution (N threads) across different log file sizes (`small.log`, `medium.log`, `large.log`).

### Metrics Measured

- **Total Execution Time (ms)**: High-resolution wall-clock duration (`std::chrono::high_resolution_clock`).
- **Throughput (Records/sec)**: $\text{Total Records} \times 1000.0 / \text{Duration (ms)}$.
- **Speedup ($S$)}: $T_{\text{sequential}} / T_{\text{parallel}}$.
- **Parallel Efficiency ($\eta$)}: $S / N$ (where $N$ is thread count).

### Sample Benchmark Results (`large.log` — 50,000 records)

| Threads | Mode | Duration (ms) | Throughput (rec/s) | Speedup | Efficiency |
|---|---|---|---|---|---|
| 1 | sequential | 480.0 ms | 104,166 r/s | 1.00x | 100% |
| 2 | parallel | 260.0 ms | 192,307 r/s | 1.84x | 92% |
| 4 | parallel | 140.0 ms | 357,142 r/s | 3.42x | 85% |
| 8 | parallel | 82.0 ms | 609,756 r/s | 5.85x | 73% |
| 16 | parallel | 65.0 ms | 769,230 r/s | 7.38x | 46% |
