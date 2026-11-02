#include "engine/threading/LogProcessorEngine.hpp"
#include <iostream>
#include <thread>
#include <future>

LogProcessorEngine::LogProcessorEngine() {}

void LogProcessorEngine::cancel() {
    cancel_flag_ = true;
}

ProcessingResult LogProcessorEngine::process_file(const std::string& file_path,
                                                  size_t thread_count,
                                                  bool parallel) {
    cancel_flag_ = false;
    ProcessingResult result;
    result.file_path = file_path;
    result.execution_mode = parallel ? "parallel" : "sequential";
    result.thread_count = parallel ? thread_count : 1;

    auto start_time = std::chrono::high_resolution_clock::now();

    LogReader reader;
    LogParser parser;
    LogAnalyzer analyzer;

    if (!parallel || thread_count <= 1) {
        // Sequential execution mode
        bool read_success = reader.read_file(file_path, [&](const std::string& line, uint64_t id) {
            if (cancel_flag_) return false;
            LogRecord record = parser.parse(line, id);
            analyzer.process_record(record);
            return true;
        }, &cancel_flag_);

        auto end_time = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double, std::milli> elapsed = end_time - start_time;

        result.duration_ms = elapsed.count();
        result.summary = analyzer.get_summary();
        result.total_records = result.summary.total_records;
        result.throughput_records_per_sec = result.duration_ms > 0 ?
            (result.total_records * 1000.0) / result.duration_ms : 0.0;
        result.success = read_success && !cancel_flag_;
        if (!read_success) {
            result.error_message = "Failed to read log file.";
        }
        return result;
    }

    // Parallel producer-consumer processing engine
    // Bounded task queue holding batches or raw lines
    ThreadSafeQueue<std::pair<std::string, uint64_t>> queue(20000);
    std::atomic<uint64_t> processed_count{0};

    // Spawn worker pool
    ThreadPool pool(thread_count);

    // Launch worker tasks that pop from queue and parse/analyze
    for (size_t i = 0; i < thread_count; ++i) {
        pool.enqueue([&queue, &parser, &analyzer, &processed_count, this]() {
            std::pair<std::string, uint64_t> item;
            while (queue.pop(item)) {
                if (this->cancel_flag_) continue;
                LogRecord record = parser.parse(item.first, item.second);
                analyzer.process_record(record);
                processed_count++;
            }
        });
    }

    // Producer thread: read file and push to queue
    std::thread producer([&reader, &file_path, &queue, this]() {
        reader.read_file(file_path, [&queue](const std::string& line, uint64_t id) {
            return queue.push({line, id});
        }, &cancel_flag_);
        queue.shutdown();
    });

    if (producer.joinable()) {
        producer.join();
    }

    // Wait for thread pool to finish tasks and shutdown
    pool.shutdown();

    auto end_time = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::milli> elapsed = end_time - start_time;

    result.duration_ms = elapsed.count();
    result.summary = analyzer.get_summary();
    result.total_records = result.summary.total_records;
    result.throughput_records_per_sec = result.duration_ms > 0 ?
        (result.total_records * 1000.0) / result.duration_ms : 0.0;
    result.success = !cancel_flag_;

    return result;
}
