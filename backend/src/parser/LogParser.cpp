#include "engine/parser/LogParser.hpp"
#include <sstream>
#include <algorithm>

LogParser::LogParser() {
    // Regex for: [2026-11-02 10:15:30] [ERROR] [Source] Message
    bracket_format_regex_ = std::regex(R"(^\[([^\]]+)\]\s+\[([A-Z]+)\]\s+(?:\[([^\]]+)\])?\s*(.*)$)");

    // Regex for Syslog: Nov  2 10:15:30 hostname service[pid]: message or service: message
    syslog_regex_ = std::regex(R"(^([A-Z][a-z]{2}\s+\d+\s+\d{2}:\d{2}:\d{2})\s+(\S+)\s+([^:]+):\s*(.*)$)");

    // Regex for Apache/Nginx: 127.0.0.1 - - [02/Nov/2026:10:15:30 +0000] "GET /path HTTP/1.1" 200 123
    apache_regex_ = std::regex(R"(^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+\"([^\"]+)\"\s+(\d{3})\s+(\S+))");
}

LogRecord LogParser::parse(const std::string& raw_line, uint64_t id) {
    LogRecord record;
    record.id = id;
    record.raw_line = raw_line;
    record.is_malformed = false;

    if (raw_line.empty()) {
        record.is_malformed = true;
        record.level = LogLevel::UNKNOWN;
        record.message = "<empty line>";
        return record;
    }

    std::smatch match;

    // 1. Try bracket format: [timestamp] [LEVEL] [source] message
    if (std::regex_match(raw_line, match, bracket_format_regex_)) {
        record.timestamp = match[1].str();
        record.level = stringToLogLevel(match[2].str());
        record.source = match[3].matched ? match[3].str() : "default";
        record.message = match[4].str();
        return record;
    }

    // 2. Try Apache / Nginx log format
    if (std::regex_match(raw_line, match, apache_regex_)) {
        record.timestamp = match[2].str();
        int status = std::stoi(match[4].str());
        if (status >= 500) record.level = LogLevel::ERROR;
        else if (status >= 400) record.level = LogLevel::WARNING;
        else record.level = LogLevel::INFO;

        record.source = match[1].str(); // client IP as source
        record.message = match[3].str(); // HTTP request
        return record;
    }

    // 3. Try Syslog format
    if (std::regex_match(raw_line, match, syslog_regex_)) {
        record.timestamp = match[1].str();
        record.source = match[3].str();
        std::string msg = match[4].str();

        // Detect level from message keywords
        std::string upper_msg = msg;
        std::transform(upper_msg.begin(), upper_msg.end(), upper_msg.begin(), ::toupper);
        if (upper_msg.find("ERROR") != std::string::npos || upper_msg.find("FAIL") != std::string::npos) {
            record.level = LogLevel::ERROR;
        } else if (upper_msg.find("WARN") != std::string::npos) {
            record.level = LogLevel::WARNING;
        } else {
            record.level = LogLevel::INFO;
        }
        record.message = msg;
        return record;
    }

    // 4. Fallback / Plain text heuristic parsing
    std::string upper = raw_line;
    std::transform(upper.begin(), upper.end(), upper.begin(), ::toupper);

    if (upper.find("FATAL") != std::string::npos) record.level = LogLevel::FATAL;
    else if (upper.find("ERROR") != std::string::npos || upper.find("ERR") != std::string::npos) record.level = LogLevel::ERROR;
    else if (upper.find("WARN") != std::string::npos) record.level = LogLevel::WARNING;
    else if (upper.find("DEBUG") != std::string::npos) record.level = LogLevel::DEBUG;
    else if (upper.find("INFO") != std::string::npos) record.level = LogLevel::INFO;
    else {
        record.level = LogLevel::INFO; // Default fallback level
        record.is_malformed = false; // Treat unstructured text as valid log line
    }

    record.timestamp = "N/A";
    record.source = "system";
    record.message = raw_line;

    return record;
}
