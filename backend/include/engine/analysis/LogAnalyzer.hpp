#ifndef LOG_ANALYZER_HPP
#define LOG_ANALYZER_HPP

#include "engine/core/LogRecord.hpp"
#include <string>
#include <unordered_map>
#include <map>
#include <vector>
#include <mutex>
#include <atomic>

struct AnalysisSummary {
    uint64_t total_records = 0;
    uint64_t error_count = 0;
    uint64_t warning_count = 0;
    uint64_t info_count = 0;
    uint64_t debug_count = 0;
    uint64_t fatal_count = 0;
    uint64_t malformed_count = 0;

    std::vector<std::pair<std::string, uint64_t>> top_error_messages;
    std::vector<std::pair<std::string, uint64_t>> top_sources;
    std::map<std::string, uint64_t> timeline_distribution;
};

class LogAnalyzer {
public:
    LogAnalyzer() = default;
    ~LogAnalyzer() = default;

    void reset();
    void process_record(const LogRecord& record);
    AnalysisSummary get_summary() const;

private:
    mutable std::mutex mutex_;
    uint64_t total_records_ = 0;
    uint64_t error_count_ = 0;
    uint64_t warning_count_ = 0;
    uint64_t info_count_ = 0;
    uint64_t debug_count_ = 0;
    uint64_t fatal_count_ = 0;
    uint64_t malformed_count_ = 0;

    std::unordered_map<std::string, uint64_t> error_message_frequencies_;
    std::unordered_map<std::string, uint64_t> source_frequencies_;
    std::map<std::string, uint64_t> timeline_distribution_;
};

#endif // LOG_ANALYZER_HPP
