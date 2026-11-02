#ifndef LOG_READER_HPP
#define LOG_READER_HPP

#include <string>
#include <fstream>
#include <functional>
#include <atomic>
#include <cstdint>

class LogReader {
public:
    explicit LogReader(size_t buffer_size = 65536); // 64 KB default buffer
    ~LogReader() = default;

    // Stream lines from file and invoke callback for each raw line
    bool read_file(const std::string& file_path,
                   const std::function<bool(const std::string&, uint64_t)>& line_callback,
                   std::atomic<bool>* cancel_flag = nullptr);

    uint64_t get_total_bytes_read() const { return total_bytes_read_; }
    uint64_t get_total_lines_read() const { return total_lines_read_; }

private:
    size_t buffer_size_;
    std::atomic<uint64_t> total_bytes_read_{0};
    std::atomic<uint64_t> total_lines_read_{0};
};

#endif // LOG_READER_HPP
