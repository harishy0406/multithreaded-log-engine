#include <gtest/gtest.h>
#include "engine/parser/LogParser.hpp"
#include "engine/core/LogRecord.hpp"

TEST(LogParserTest, ParsesBracketFormat) {
    LogParser parser;
    std::string line = "[2026-11-02 10:15:30.123] [ERROR] [AuthModule] Invalid credentials supplied";
    LogRecord record = parser.parse(line, 1);

    EXPECT_EQ(record.id, 1);
    EXPECT_EQ(record.timestamp, "2026-11-02 10:15:30.123");
    EXPECT_EQ(record.level, LogLevel::ERROR);
    EXPECT_EQ(record.source, "AuthModule");
    EXPECT_EQ(record.message, "Invalid credentials supplied");
    EXPECT_FALSE(record.is_malformed);
}

TEST(LogParserTest, ParsesPlainFallback) {
    LogParser parser;
    std::string line = "CRITICAL WARNING: Disk space is running low";
    LogRecord record = parser.parse(line, 2);

    EXPECT_EQ(record.level, LogLevel::WARNING);
    EXPECT_EQ(record.message, line);
    EXPECT_FALSE(record.is_malformed);
}
