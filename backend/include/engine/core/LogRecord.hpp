#ifndef LOG_RECORD_HPP
#define LOG_RECORD_HPP

#include <string>
#include <chrono>

enum class LogLevel {
    DEBUG,
    INFO,
    WARNING,
    ERROR,
    FATAL,
    UNKNOWN
};

inline std::string logLevelToString(LogLevel level) {
    switch (level) {
        case LogLevel::DEBUG:   return "DEBUG";
        case LogLevel::INFO:    return "INFO";
        case LogLevel::WARNING: return "WARNING";
        case LogLevel::ERROR:   return "ERROR";
        case LogLevel::FATAL:   return "FATAL";
        case LogLevel::UNKNOWN: return "UNKNOWN";
    }
    return "UNKNOWN";
}

inline LogLevel stringToLogLevel(const std::string& str) {
    if (str == "DEBUG" || str == "DBG") return LogLevel::DEBUG;
    if (str == "INFO" || str == "INF")  return LogLevel::INFO;
    if (str == "WARNING" || str == "WARN") return LogLevel::WARNING;
    if (str == "ERROR" || str == "ERR") return LogLevel::ERROR;
    if (str == "FATAL" || str == "FTL") return LogLevel::FATAL;
    return LogLevel::UNKNOWN;
}

struct LogRecord {
    uint64_t id = 0;
    std::string timestamp;
    LogLevel level = LogLevel::UNKNOWN;
    std::string source;
    std::string message;
    std::string raw_line;
    bool is_malformed = false;
    uint32_t thread_id = 0;
};

#endif // LOG_RECORD_HPP
