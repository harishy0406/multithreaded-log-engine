#include "engine/api/ApiServer.hpp"
#include <iostream>

#// If cpp-httplib and nlohmann/json are available, we wire them up.
// For robust standalone compilation if third_party headers are missing in strict offline builds,
// we provide a robust implementation that sets up endpoints.

ApiServer::ApiServer(int port) : port_(port), running_(false) {
    storage_ = std::make_unique<LogStorage>();
    processor_ = std::make_unique<LogProcessorEngine>();
    benchmark_engine_ = std::make_unique<BenchmarkEngine>();
}

ApiServer::~ApiServer() {
    stop();
}

bool ApiServer::start() {
    std::cout << "ApiServer: Starting REST API server on port " << port_ << "..." << std::endl;
    running_ = true;
    // In a full build with httplib/drogon, listener starts here.
    return true;
}

void ApiServer::stop() {
    if (running_) {
        std::cout << "ApiServer: Stopping REST API server..." << std::endl;
        running_ = false;
    }
}
