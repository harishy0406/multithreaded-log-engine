#include <gtest/gtest.h>
#include "engine/queue/ThreadSafeQueue.hpp"
#include <thread>
#include <vector>
#include <atomic>

TEST(ThreadSafeQueueTest, PushAndPop) {
    ThreadSafeQueue<int> queue(10);
    EXPECT_TRUE(queue.push(42));
    EXPECT_FALSE(queue.empty());
    EXPECT_EQ(queue.size(), 1);

    int val = 0;
    EXPECT_TRUE(queue.pop(val));
    EXPECT_EQ(val, 42);
    EXPECT_TRUE(queue.empty());
}

TEST(ThreadSafeQueueTest, ConcurrentProducerConsumer) {
    ThreadSafeQueue<int> queue(100);
    std::atomic<int> consumed_sum{0};
    int num_items = 500;

    std::thread producer([&queue, num_items]() {
        for (int i = 1; i <= num_items; ++i) {
            queue.push(i);
        }
        queue.shutdown();
    });

    std::vector<std::thread> consumers;
    int num_consumers = 4;
    for (int c = 0; c < num_consumers; ++c) {
        consumers.emplace_back([&queue, &consumed_sum]() {
            int item;
            while (queue.pop(item)) {
                consumed_sum += item;
            }
        });
    }

    producer.join();
    for (auto& t : consumers) {
        t.join();
    }

    int expected_sum = (num_items * (num_items + 1)) / 2;
    EXPECT_EQ(consumed_sum.load(), expected_sum);
}
