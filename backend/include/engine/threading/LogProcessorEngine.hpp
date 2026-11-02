#ifndef LOG_PROCESSOR_ENGINE_HPP
#define LOG_PROCESSOR_ENGINE_HPP

#include "engine/core/LogRecord.hpp"
#include "engine/parser/LogParser.hpp"
#include "engine/reader/LogReader.hpp"
#include "engine/analysis/LogAnalyzer.hpp"
#include "engine/queue/ThreadSafeQueue.hpp"
#include "engine/threading/ThreadPool.hpp"

#include <string>
#include <chrono>
#include <atomic>
#include <memory>

struct ProcessingResult {
    bool success = false;
    std::string file_path;
    std::string execution_mode; // "sequential" or "parallel"
    size_t thread_count = 1;
    uint64_t total_records = 0;
    double duration_ms = 0.0;
    double throughput_records_per_sec = 0.0;
    AnalysisSummary summary;
    std::string error_message;
};

class LogProcessorEngine {
public:
    LogProcessorEngine();
    ~LogProcessorEngine() = default;

    ProcessingResult process_file(const std::string& file_path,
                                  size_t thread_count = 4,
                                  bool parallel = true);

    void cancel();

private:
    std::atomic<bool> cancel_flag_{false};
};

#endif // LOG_PROCESSOR_ENGINE_HPP
