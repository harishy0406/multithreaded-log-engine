#ifndef BENCHMARK_ENGINE_HPP
#define BENCHMARK_ENGINE_HPP

#include "engine/threading/LogProcessorEngine.hpp"
#include "engine/storage/LogStorage.hpp"
#include <string>
#include <vector>

struct BenchmarkRunResult {
    std::string file_path;
    size_t thread_count = 1;
    std::string mode; // "sequential" or "parallel"
    uint64_t total_records = 0;
    double duration_ms = 0.0;
    double throughput = 0.0;
    double speedup = 1.0;
    double efficiency = 1.0;
};

class BenchmarkEngine {
public:
    BenchmarkEngine() = default;
    ~BenchmarkEngine() = default;

    std::vector<BenchmarkRunResult> run_benchmark_suite(const std::string& file_path,
                                                        const std::vector<size_t>& thread_counts = {1, 2, 4, 8, 16});
};

#endif // BENCHMARK_ENGINE_HPP