#ifndef THREAD_POOL_HPP
#define THREAD_POOL_HPP

#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <future>
#include <functional>
#include <atomic>
#include <memory>

class ThreadPool {
public:
    explicit ThreadPool(size_t num_threads, size_t max_queue_size = 20000);
    ~ThreadPool();

    ThreadPool(const ThreadPool&) = delete;
    ThreadPool& operator=(const ThreadPool&) = delete;

    template<typename F, typename... Args>
    auto enqueue(F&& f, Args&&... args)
        -> std::future<typename std::invoke_result<F, Args...>::type> {

        using return_type = typename std::invoke_result<F, Args...>::type;

        auto task = std::make_shared<std::packaged_task<return_type()>>(
            std::bind(std::forward<F>(f), std::forward<Args>(args)...)
        );

        std::future<return_type> res = task->get_future();
        {
            std::unique_lock<std::mutex> lock(mutex_);

            if (shutdown_) {
                throw std::runtime_error("Enqueue on stopped ThreadPool");
            }

            if (max_queue_size_ > 0) {
                not_full_.wait(lock, [this] { return shutdown_ || tasks_.size() < max_queue_size_; });
                if (shutdown_) {
                    throw std::runtime_error("ThreadPool shutting down");
                }
            }

            tasks_.emplace([task]() { (*task)(); });
        }
        cv_.notify_one();
        return res;
    }

    size_t get_worker_count() const { return workers_.size(); }
    size_t get_queued_tasks_count() const;
    bool is_shutdown() const { return shutdown_; }
    void shutdown();

private:
    std::vector<std::thread> workers_;
    std::queue<std::function<void()>> tasks_;
    size_t max_queue_size_;

    mutable std::mutex mutex_;
    std::condition_variable cv_;
    std::condition_variable not_full_;
    std::atomic<bool> shutdown_{false};
};

#endif // THREAD_POOL_HPP
