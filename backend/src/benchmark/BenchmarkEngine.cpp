#include "engine/benchmark/BenchmarkEngine.hpp"
#include <iostream>

std::vector<BenchmarkRunResult> BenchmarkEngine::run_benchmark_suite(
    const std::string& file_path, const std::vector<size_t>& thread_counts) {

    std::vector<BenchmarkRunResult> results;
    LogProcessorEngine engine;

    // First run sequential (1 thread) as baseline
    double baseline_duration = 0.0;

    for (size_t threads : thread_counts) {
        bool parallel = (threads > 1);
        ProcessingResult res = engine.process_file(file_path, threads, parallel);

        BenchmarkRunResult b_res;
        b_res.file_path = file_path;
        b_res.thread_count = threads;
        b_res.mode = parallel ? "parallel" : "sequential";
        b_res.total_records = res.total_records;
        b_res.duration_ms = res.duration_ms;
        b_res.throughput = res.throughput_records_per_sec;

        if (threads == 1 || baseline_duration == 0.0) {
            baseline_duration = res.duration_ms;
            b_res.speedup = 1.0;
            b_res.efficiency = 1.0;
        } else {
            if (res.duration_ms > 0) {
                b_res.speedup = baseline_duration / res.duration_ms;
                b_res.efficiency = b_res.speedup / static_cast<double>(threads);
            } else {
                b_res.speedup = 0.0;
                b_res.efficiency = 0.0;
            }
        }

        results.push_back(b_res);
    }

    return results;
}
