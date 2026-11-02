#include "engine/threading/LogProcessorEngine.hpp"
#include "engine/benchmark/BenchmarkEngine.hpp"
#include "engine/storage/LogStorage.hpp"
#include "engine/api/ApiServer.hpp"

#include <iostream>
#include <string>
#include <vector>

void print_usage(const char* prog_name) {
    std::cout << "Usage:\n"
              << "  " << prog_name << " process <file_path> [threads] [parallel/sequential]\n"
              << "  " << prog_name << " benchmark <file_path>\n"
              << "  " << prog_name << " server [port]\n";
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        print_usage(argv[0]);
        return 1;
    }

    std::string command = argv[1];

    if (command == "process") {
        if (argc < 3) {
            std::cerr << "Error: Missing file path for process command.\n";
            print_usage(argv[0]);
            return 1;
        }

        std::string file_path = argv[2];
        size_t threads = (argc > 3) ? std::stoul(argv[3]) : 4;
        std::string mode = (argc > 4) ? argv[4] : "parallel";
        bool parallel = (mode == "parallel");

        std::cout << "Processing log file: " << file_path << " with " << threads << " threads (" << mode << ")...\n";

        LogProcessorEngine engine;
        ProcessingResult res = engine.process_file(file_path, threads, parallel);

        if (res.success) {
            std::cout << "\n=== Processing Completed Successfully ===\n"
                      << "Total Records: " << res.total_records << "\n"
                      << "Execution Time: " << res.duration_ms << " ms\n"
                      << "Throughput: " << res.throughput_records_per_sec << " records/sec\n"
                      << "Errors: " << res.summary.error_count << "\n"
                      << "Warnings: " << res.summary.warning_count << "\n"
                      << "Info: " << res.summary.info_count << "\n"
                      << "Malformed: " << res.summary.malformed_count << "\n";

            // Save to history storage
            LogStorage storage;
            HistoryRecord hist;
            hist.file_name = file_path;
            hist.file_size = 0; // can query file size
            hist.execution_mode = res.execution_mode;
            hist.thread_count = res.thread_count;
            hist.records_processed = res.total_records;
            hist.duration_ms = res.duration_ms;
            hist.throughput = res.throughput_records_per_sec;
            hist.status = "SUCCESS";
            storage.save_history(hist);

        } else {
            std::cerr << "Processing failed: " << res.error_message << "\n";
            return 1;
        }

    } else if (command == "benchmark") {
        if (argc < 3) {
            std::cerr << "Error: Missing file path for benchmark command.\n";
            print_usage(argv[0]);
            return 1;
        }

        std::string file_path = argv[2];
        std::cout << "Running benchmark suite on: " << file_path << "...\n";

        BenchmarkEngine bench;
        std::vector<size_t> thread_counts = {1, 2, 4, 8, 16};
        auto results = bench.run_benchmark_suite(file_path, thread_counts);

        std::cout << "\n=== Benchmark Results ===\n";
        std::cout << "Threads | Mode       | Records | Time (ms) | Throughput (rec/s) | Speedup | Efficiency\n";
        std::cout << "------------------------------------------------------------------------------------\n";
        for (const auto& r : results) {
            std::cout << "  " << r.thread_count << "     | "
                      << r.mode << " | "
                      << r.total_records << "   | "
                      << r.duration_ms << "    | "
                      << r.throughput << "          | "
                      << r.speedup << "x    | "
                      << (r.efficiency * 100.0) << "%\n";
        }

    } else if (command == "server") {
        int port = (argc > 3) ? std::stoi(argv[3]) : 8080;
        ApiServer server(port);
        if (server.start()) {
            std::cout << "Server running. Press Enter to stop.\n";
            std::cin.get();
            server.stop();
        } else {
            std::cerr << "Failed to start API server.\n";
            return 1;
        }
    } else {
        print_usage(argv[0]);
        return 1;
    }

    return 0;
}
