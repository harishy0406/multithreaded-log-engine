#include "engine/storage/LogStorage.hpp"
#include <sqlite3.h>
#include <iostream>
#include <chrono>
#include <iomanip>
#include <sstream>

LogStorage::LogStorage(const std::string& db_path) : db_path_(db_path) {
    initialize();
}

LogStorage::~LogStorage() {
    if (db_handle_) {
        sqlite3_close(static_cast<sqlite3*>(db_handle_));
        db_handle_ = nullptr;
    }
}

bool LogStorage::initialize() {
    int rc = sqlite3_open(db_path_.c_str(), reinterpret_cast<sqlite3**>(&db_handle_));
    if (rc != SQLITE_OK) {
        std::cerr << "LogStorage: Can't open database: " << sqlite3_errmsg(static_cast<sqlite3*>(db_handle_)) << std::endl;
        return false;
    }

    const char* sql = R"(
        CREATE TABLE IF NOT EXISTS processing_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_name TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            execution_mode TEXT NOT NULL,
            thread_count INTEGER NOT NULL,
            records_processed INTEGER NOT NULL,
            duration_ms REAL NOT NULL,
            throughput REAL NOT NULL,
            status TEXT NOT NULL,
            timestamp TEXT NOT NULL
        );
    )";

    char* err_msg = nullptr;
    rc = sqlite3_exec(static_cast<sqlite3*>(db_handle_), sql, nullptr, nullptr, &err_msg);
    if (rc != SQLITE_OK) {
        std::cerr << "LogStorage: SQL error in create table: " << err_msg << std::endl;
        sqlite3_free(err_msg);
        return false;
    }

    return true;
}

bool LogStorage::save_history(const HistoryRecord& record) {
    if (!db_handle_) return false;

    std::string sql = R"(
        INSERT INTO processing_history (file_name, file_size, execution_mode, thread_count, records_processed, duration_ms, throughput, status, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    )";

    sqlite3_stmt* stmt = nullptr;
    int rc = sqlite3_prepare_v2(static_cast<sqlite3*>(db_handle_), sql.c_str(), -1, &stmt, nullptr);
    if (rc != SQLITE_OK) {
        std::cerr << "LogStorage: Failed to prepare statement: " << sqlite3_errmsg(static_cast<sqlite3*>(db_handle_)) << std::endl;
        return false;
    }

    // Get current timestamp if empty
    std::string ts = record.timestamp;
    if (ts.empty()) {
        auto now = std::chrono::system_clock::now();
        auto in_time_t = std::chrono::system_clock::to_time_t(now);
        std::stringstream ss;
        ss << std::put_time(std::localtime(&in_time_t), "%Y-%m-%d %H:%M:%S");
        ts = ss.str();
    }

    sqlite3_bind_text(stmt, 1, record.file_name.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_int64(stmt, 2, record.file_size);
    sqlite3_bind_text(stmt, 3, record.execution_mode.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 4, static_cast<int>(record.thread_count));
    sqlite3_bind_int64(stmt, 5, record.records_processed);
    sqlite3_bind_double(stmt, 6, record.duration_ms);
    sqlite3_bind_double(stmt, 7, record.throughput);
    sqlite3_bind_text(stmt, 8, record.status.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 9, ts.c_str(), -1, SQLITE_STATIC);

    rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);

    return (rc == SQLITE_DONE);
}

std::vector<HistoryRecord> LogStorage::get_history(int limit) {
    std::vector<HistoryRecord> records;
    if (!db_handle_) return records;

    std::string sql = "SELECT id, file_name, file_size, execution_mode, thread_count, records_processed, duration_ms, throughput, status, timestamp FROM processing_history ORDER BY id DESC LIMIT ?;";

    sqlite3_stmt* stmt = nullptr;
    int rc = sqlite3_prepare_v2(static_cast<sqlite3*>(db_handle_), sql.c_str(), -1, &stmt, nullptr);
    if (rc != SQLITE_OK) return records;

    sqlite3_bind_int(stmt, 1, limit);

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        HistoryRecord rec;
        rec.id = sqlite3_column_int64(stmt, 0);
        rec.file_name = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));
        rec.file_size = sqlite3_column_int64(stmt, 2);
        rec.execution_mode = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 3));
        rec.thread_count = static_cast<size_t>(sqlite3_column_int(stmt, 4));
        rec.records_processed = sqlite3_column_int64(stmt, 5);
        rec.duration_ms = sqlite3_column_double(stmt, 6);
        rec.throughput = sqlite3_column_double(stmt, 7);
        rec.status = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 8));
        rec.timestamp = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 9));
        records.push_back(rec);
    }

    sqlite3_finalize(stmt);
    return records;
}

std::optional<HistoryRecord> LogStorage::get_history_by_id(uint64_t id) {
    if (!db_handle_) return std::nullopt;

    std::string sql = "SELECT id, file_name, file_size, execution_mode, thread_count, records_processed, duration_ms, throughput, status, timestamp FROM processing_history WHERE id = ?;";

    sqlite3_stmt* stmt = nullptr;
    int rc = sqlite3_prepare_v2(static_cast<sqlite3*>(db_handle_), sql.c_str(), -1, &stmt, nullptr);
    if (rc != SQLITE_OK) return std::nullopt;

    sqlite3_bind_int64(stmt, 1, id);

    std::optional<HistoryRecord> record = std::nullopt;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        HistoryRecord rec;
        rec.id = sqlite3_column_int64(stmt, 0);
        rec.file_name = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));
        rec.file_size = sqlite3_column_int64(stmt, 2);
        rec.execution_mode = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 3));
        rec.thread_count = static_cast<size_t>(sqlite3_column_int(stmt, 4));
        rec.records_processed = sqlite3_column_int64(stmt, 5);
        rec.duration_ms = sqlite3_column_double(stmt, 6);
        rec.throughput = sqlite3_column_double(stmt, 7);
        rec.status = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 8));
        rec.timestamp = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 9));
        record = rec;
    }

    sqlite3_finalize(stmt);
    return record;
}
