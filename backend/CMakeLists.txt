cmake_minimum_required(VERSION 3.16)
project(MultiThreadedLogEngine VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include directories
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include)

# Find SQLite3
find_package(SQLite3 REQUIRED)

# Source files for core engine library
set(ENGINE_SOURCES
    src/parser/LogParser.cpp
    src/reader/LogReader.cpp
    src/threading/ThreadPool.cpp
    src/threading/LogProcessorEngine.cpp
    src/analysis/LogAnalyzer.cpp
    src/benchmark/BenchmarkEngine.cpp
    src/storage/LogStorage.cpp
    src/api/ApiServer.cpp
)

add_library(log_engine_lib STATIC ${ENGINE_SOURCES})
target_link_libraries(log_engine_lib PRIVATE SQLite3::SQLite3)

# Main executable
add_executable(log_engine_app src/main.cpp)
target_link_libraries(log_engine_app PRIVATE log_engine_lib SQLite3::SQLite3)

# Enable testing
enable_testing()
find_package(GTest)

if(GTest_FOUND OR TARGET GTest::gtest)
    add_executable(log_engine_tests
        tests/unit/ParserTest.cpp
        tests/concurrency/QueueTest.cpp
        tests/concurrency/ThreadPoolTest.cpp
    )
    target_link_libraries(log_engine_tests PRIVATE log_engine_lib GTest::gtest GTest::gtest_main SQLite3::SQLite3)
    include(GoogleTest)
    gtest_discover_tests(log_engine_tests)
else()
    message(STATUS "GoogleTest not found via find_package. Tests target skipped.")
endif()
