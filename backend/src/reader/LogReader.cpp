#include "engine/reader/LogReader.hpp"
#include <iostream>
#include <vector>

LogReader::LogReader(size_t buffer_size) : buffer_size_(buffer_size) {}

bool LogReader::read_file(const std::string& file_path,
                          const std::function<bool(const std::string&, uint64_t)>& line_callback,
                          std::atomic<bool>* cancel_flag) {
    std::ifstream file(file_path, std::ios::in | std::ios::binary);
    if (!file.is_open()) {
        std::cerr << "LogReader: Failed to open file: " << file_path << std::endl;
        return false;
    }

    total_bytes_read_ = 0;
    total_lines_read_ = 0;
    uint64_t line_id = 0;

    std::string leftover;
    std::vector<char> buffer(buffer_size_);

    while (file) {
        if (cancel_flag && cancel_flag->load()) {
            break;
        }

        file.read(buffer.data(), buffer_size_);
        std::streamsize bytes_read = file.gcount();
        if (bytes_read <= 0) {
            break;
        }

        total_bytes_read_ += bytes_read;

        const char* p = buffer.data();
        const char* end = p + bytes_read;
        const char* line_start = p;

        for (const char* ptr = p; ptr != end; ++ptr) {
            if (*ptr == '\n') {
                std::string line(line_start, ptr - line_start);
                // Remove trailing carriage return '\r' if present (Windows line endings)
                if (!line.empty() && line.back() == '\r') {
                    line.pop_back();
                }

                if (!leftover.empty()) {
                    line = leftover + line;
                    leftover.clear();
                }

                line_id++;
                total_lines_read_++;

                if (!line_callback(line, line_id)) {
                    // Callback requested stop
                    return true;
                }

                line_start = ptr + 1;
            }
        }

        // Handle remaining characters as leftover for the next chunk
        if (line_start != end) {
            leftover.append(line_start, end - line_start);
        }
    }

    // Process final leftover if file didn't end with newline
    if (!leftover.empty()) {
        if (!cancel_flag || !cancel_flag->load()) {
            line_id++;
            total_lines_read_++;
            line_callback(leftover, line_id);
        }
    }

    return true;
}
