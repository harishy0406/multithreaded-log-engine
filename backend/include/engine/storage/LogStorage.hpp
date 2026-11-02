#ifndef LOG_STORAGE_HPP
#define LOG_STORAGE_HPP

#include <string>
#include <vector>
#include <optional>

struct HistoryRecord {
    uint64_t id = 0;
    std::string file_name;
    uint64_t file_size = 0;
    std::string execution_mode;
    size_t thread_count = 0;
    uint64_t records_processed = 0;
    double duration_ms = 0.0;
    double throughput = 0.0;
    std::string status;
    std::string timestamp;
};

class LogStorage {
public:
    explicit LogStorage(const std::string& db_path = "engine_history.db");
    ~LogStorage();

    bool initialize();
    bool save_history(const HistoryRecord& record);
    std::vector<HistoryRecord> get_history(int limit = 50);
    std::optional<HistoryRecord> get_history_by_id(uint64_t id);

private:
    std::string db_path_;
    void* db_handle_ = nullptr; // sqlite3* cast to void*
};

#endif // LOG_STORAGE_HPP
