#ifndef THREAD_SAFE_QUEUE_HPP
#define THREAD_SAFE_QUEUE_HPP

#include <queue>
#include <mutex>
#include <condition_variable>
#include <atomic>
#include <optional>
#include <functional>
#include <chrono>
#include <deque>

template <typename T>
class ThreadSafeQueue {
private:
    std::deque<T> queue_;
    mutable std::mutex mutex_;
    std::condition_variable not_full_;
    std::condition_variable not_empty_;
    size_t max_capacity_;
    std::atomic<bool> shutdown_{false};

    // Statistics
    std::atomic<uint64_t> total_pushed_{0};
    std::atomic<uint64_t> total_popped_{0};
    std::atomic<uint64_t> max_size_reached_{0};

public:
    explicit ThreadSafeQueue(size_t max_capacity = 10000)
        : max_capacity_(max_capacity) {}

    ~ThreadSafeQueue() {
        shutdown();
    }

    bool push(const T& item) {
        std::unique_lock<std::mutex> lock(mutex_);
        not_full_.wait(lock, [this]() {
            return queue_.size() < max_capacity_ || shutdown_;
        });

        if (shutdown_) {
            return false;
        }

        queue_.push_back(item);
        total_pushed_++;
        size_t current_size = queue_.size();
        if (current_size > max_size_reached_) {
            max_size_reached_ = current_size;
        }
        not_empty_.notify_one();
        return true;
    }

    bool push(T&& item) {
        std::unique_lock<std::mutex> lock(mutex_);
        not_full_.wait(lock, [this]() {
            return queue_.size() < max_capacity_ || shutdown_;
        });

        if (shutdown_) {
            return false;
        }

        queue_.push_back(std::move(item));
        total_pushed_++;
        size_t current_size = queue_.size();
        if (current_size > max_size_reached_) {
            max_size_reached_ = current_size;
        }
        not_empty_.notify_one();
        return true;
    }

    bool pop(T& item) {
        std::unique_lock<std::mutex> lock(mutex_);
        not_empty_.wait(lock, [this]() {
            return !queue_.empty() || shutdown_;
        });

        if (queue_.empty() && shutdown_) {
            return false;
        }

        item = std::move(queue_.front());
        queue_.pop_front();
        total_popped_++;
        not_full_.notify_one();
        return true;
    }

    std::optional<T> pop() {
        std::unique_lock<std::mutex> lock(mutex_);
        not_empty_.wait(lock, [this]() {
            return !queue_.empty() || shutdown_;
        });

        if (queue_.empty() && shutdown_) {
            return std::nullopt;
        }

        T item = std::move(queue_.front());
        queue_.pop_front();
        total_popped_++;
        not_full_.notify_one();
        return item;
    }

    template <typename Predicate>
    bool pop_if(T& item, Predicate pred) {
        std::unique_lock<std::mutex> lock(mutex_);
        not_empty_.wait(lock, [this, &pred]() {
            if (shutdown_) return true;
            return !queue_.empty() && pred(queue_.front());
        });

        if (queue_.empty() && shutdown_) {
            return false;
        }

        if (!pred(queue_.front())) {
            return false;
        }

        item = std::move(queue_.front());
        queue_.pop_front();
        total_popped_++;
        not_full_.notify_one();
        return true;
    }

    void shutdown() {
        {
            std::lock_guard<std::mutex> lock(mutex_);
            shutdown_ = true;
        }
        not_full_.notify_all();
        not_empty_.notify_all();
    }

    size_t size() const {
        std::lock_guard<std::mutex> lock(mutex_);
        return queue_.size();
    }

    bool empty() const {
        std::lock_guard<std::mutex> lock(mutex_);
        return queue_.empty();
    }

    size_t capacity() const {
        return max_capacity_;
    }

    bool is_shutdown() const {
        return shutdown_;
    }

    // Statistics
    uint64_t get_total_pushed() const { return total_pushed_; }
    uint64_t get_total_popped() const { return total_popped_; }
    uint64_t get_max_size_reached() const { return max_size_reached_; }
    double get_utilization() const {
        return max_capacity_ > 0 ? static_cast<double>(max_size_reached_) / max_capacity_ : 0.0;
    }
};

#endif // THREAD_SAFE_QUEUE_HPP