#include <gtest/gtest.h>
#include "engine/threading/ThreadPool.hpp"
#include <future>
#include <numeric>
#include <vector>

TEST(ThreadPoolTest, ExecutesTasksAndReturnsFutures) {
    ThreadPool pool(4);

    auto future1 = pool.enqueue([](int a, int b) { return a + b; }, 10, 20);
    auto future2 = pool.enqueue([](int n) { return n * n; }, 5);

    EXPECT_EQ(future1.get(), 30);
    EXPECT_EQ(future2.get(), 25);
}

TEST(ThreadPoolTest, HandlesMultipleConcurrentTasks) {
    ThreadPool pool(4);
    std::vector<std::future<int>> futures;

    for (int i = 0; i < 50; ++i) {
        futures.push_back(pool.enqueue([i]() { return i * 2; }));
    }

    for (int i = 0; i < 50; ++i) {
        EXPECT_EQ(futures[i].get(), i * 2);
    }
}
