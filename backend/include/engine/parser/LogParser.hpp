#ifndef LOG_PARSER_HPP
#define LOG_PARSER_HPP

#include "engine/core/LogRecord.hpp"
#include <string>
#include <regex>

class LogParser {
public:
    LogParser();
    ~LogParser() = default;

    LogRecord parse(const std::string& raw_line, uint64_t id = 0);

private:
    std::regex bracket_format_regex_; // [timestamp] [LEVEL] [source] message
    std::regex syslog_regex_;         // Mon DD HH:MM:SS host service: message
    std::regex json_regex_;           // basic json matcher
    std::regex apache_regex_;         // IP - - [timestamp] "method path proto" status size
};

#endif // LOG_PARSER_HPP
