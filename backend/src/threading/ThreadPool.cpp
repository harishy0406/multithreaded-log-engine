#include "engine/threading/ThreadPool.hpp"
#include <iostream>

ThreadPool::ThreadPool(size_t num_threads) {
    for (size_t i = 0; i < num_threads; ++i) {
        workers_.emplace_back([this, i]() {
            while (true) {
                std::function<void()> task;
                {
                    std::unique_lock<std::mutex> lock(this->mutex_);
                    this->cv_.wait(lock, [this]() {
                        return this->stop_ || !this->tasks_.empty();
                    });

                    if (this->stop_ && this->tasks_.empty()) {
                        return;
                    }

                    task = std::move(this->tasks_.front());
                    this->tasks_.pop();
                }

                try {
                    task();
                } catch (const std::exception& e) {
                    std::cerr << "ThreadPool worker " << i << " caught exception: " << e.what() << std::endl;
                } catch (...) {
                    std::cerr << "ThreadPool worker " << i << " caught unknown exception." << std::endl;
                }
            }
        });
    }
}

ThreadPool::~ThreadPool() {
    shutdown();
}

void ThreadPool::shutdown() {
    {
        std::unique_lock<std::mutex> lock(mutex_);
        if (stop_) return;
        stop_ = true;
    }
    cv_.notify_all();
    for (std::thread& worker : workers_) {
        if (worker.joinable()) {
            worker.join();
        }
    }
}

size_t ThreadPool::get_queued_tasks_count() const {
    std::unique_lock<std::mutex> lock(mutex_);
    return tasks_.size();
}
