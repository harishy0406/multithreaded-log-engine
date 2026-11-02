#ifndef API_SERVER_HPP
#define API_SERVER_HPP

#include "engine/threading/LogProcessorEngine.hpp"
#include "engine/benchmark/BenchmarkEngine.hpp"
#include "engine/storage/LogStorage.hpp"
#include <string>
#include <memory>

class ApiServer {
public:
    ApiServer(int port = 8080);
    ~ApiServer();

    bool start();
    void stop();

private:
    int port_;
    bool running_;
    std::unique_ptr<LogStorage> storage_;
    std::unique_ptr<LogProcessorEngine> processor_;
    std::unique_ptr<BenchmarkEngine> benchmark_engine_;

    // Internal server implementation pointer or handle
    void* server_impl_ = nullptr;
};

#endif // API_SERVER_HPP
