#include "engine/analysis/LogAnalyzer.hpp"
#include <algorithm>

void LogAnalyzer::reset() {
    std::lock_guard<std::mutex> lock(mutex_);
    total_records_ = 0;
    error_count_ = 0;
    warning_count_ = 0;
    info_count_ = 0;
    debug_count_ = 0;
    fatal_count_ = 0;
    malformed_count_ = 0;
    error_message_frequencies_.clear();
    source_frequencies_.clear();
    timeline_distribution_.clear();
}

void LogAnalyzer::process_record(const LogRecord& record) {
    std::lock_guard<std::mutex> lock(mutex_);
    total_records_++;

    if (record.is_malformed) {
        malformed_count_++;
    }

    switch (record.level) {
        case LogLevel::DEBUG:   debug_count_++; break;
        case LogLevel::INFO:    info_count_++; break;
        case LogLevel::WARNING: warning_count_++; break;
        case LogLevel::ERROR:   error_count_++; break;
        case LogLevel::FATAL:   fatal_count_++; break;
        case LogLevel::UNKNOWN: break;
    }

    if (!record.source.empty()) {
        source_frequencies_[record.source]++;
    }

    if (record.level == LogLevel::ERROR || record.level == LogLevel::FATAL) {
        // Truncate message for pattern grouping if too long
        std::string pattern = record.message;
        if (pattern.length() > 100) {
            pattern = pattern.substr(0, 100) + "...";
        }
        error_message_frequencies_[pattern]++;
    }

    // Timeline distribution (bucket by timestamp or date string)
    std::string time_bucket = record.timestamp;
    if (time_bucket.empty() || time_bucket == "N/A") {
        time_bucket = "Unknown Time";
    } else if (time_bucket.length() > 16) {
        // e.g. "2026-11-02 10:15"
        time_bucket = time_bucket.substr(0, 16);
    }
    timeline_distribution_[time_bucket]++;
}

AnalysisSummary LogAnalyzer::get_summary() const {
    std::lock_guard<std::mutex> lock(mutex_);
    AnalysisSummary summary;
    summary.total_records = total_records_;
    summary.error_count = error_count_;
    summary.warning_count = warning_count_;
    summary.info_count = info_count_;
    summary.debug_count = debug_count_;
    summary.fatal_count = fatal_count_;
    summary.malformed_count = malformed_count_;
    summary.timeline_distribution = timeline_distribution_;

    // Sort top errors by frequency
    std::vector<std::pair<std::string, uint64_t>> errors(
        error_message_frequencies_.begin(), error_message_frequencies_.end()
    );
    std::sort(errors.begin(), errors.end(), [](const auto& a, const auto& b) {
        return a.second > b.second;
    });
    if (errors.size() > 10) errors.resize(10);
    summary.top_error_messages = errors;

    // Sort top sources by frequency
    std::vector<std::pair<std::string, uint64_t>> sources(
        source_frequencies_.begin(), source_frequencies_.end()
    );
    std::sort(sources.begin(), sources.end(), [](const auto& a, const auto& b) {
        return a.second > b.second;
    });
    if (sources.size() > 10) sources.resize(10);
    summary.top_sources = sources;

    return summary;
}
