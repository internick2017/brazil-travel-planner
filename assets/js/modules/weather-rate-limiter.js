// Weather API Rate Limiter - Prevents API abuse and 429 errors
// Brazil Travel Planner - Weather Rate Limiter Module

class WeatherRateLimiter {
    constructor() {
        this.requestQueue = [];
        this.isProcessing = false;
        this.minDelay = 1000; // 1 second between requests
        this.maxConcurrent = 3; // Max 3 concurrent requests
        this.activeRequests = 0;
        this.dailyLimit = 100; // Daily request limit
        this.dailyCount = this.getTodayRequestCount();
        
        console.log('⏱️ Weather rate limiter initialized');
    }

    /**
     * Add a weather request to the queue
     * @param {Function} requestFunc - The weather API request function
     * @returns {Promise} Promise that resolves with weather data
     */
    async queueRequest(requestFunc) {
        return new Promise((resolve, reject) => {
            // Check daily limit
            if (this.dailyCount >= this.dailyLimit) {
                console.warn('⚠️ Daily weather API limit reached, skipping request');
                reject(new Error('Daily API limit reached'));
                return;
            }

            this.requestQueue.push({
                requestFunc,
                resolve,
                reject,
                timestamp: Date.now()
            });

            this.processQueue();
        });
    }

    /**
     * Process the request queue
     */
    async processQueue() {
        if (this.isProcessing || this.requestQueue.length === 0 || this.activeRequests >= this.maxConcurrent) {
            return;
        }

        this.isProcessing = true;

        while (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrent) {
            const request = this.requestQueue.shift();
            this.executeRequest(request);
            
            // Add delay between requests
            if (this.requestQueue.length > 0) {
                await this.delay(this.minDelay);
            }
        }

        this.isProcessing = false;
    }

    /**
     * Execute a single request
     * @param {Object} request - Request object with requestFunc, resolve, reject
     */
    async executeRequest(request) {
        this.activeRequests++;
        
        try {
            const result = await request.requestFunc();
            this.incrementDailyCount();
            request.resolve(result);
            console.log('✅ Weather API request completed successfully');
        } catch (error) {
            console.warn('⚠️ Weather API request failed:', error.message);
            request.reject(error);
        } finally {
            this.activeRequests--;
            
            // Continue processing queue if there are more requests
            if (this.requestQueue.length > 0 && !this.isProcessing) {
                setTimeout(() => this.processQueue(), this.minDelay);
            }
        }
    }

    /**
     * Create a delay
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Promise that resolves after delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get today's request count from localStorage
     * @returns {number} Number of requests made today
     */
    getTodayRequestCount() {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('weatherApiRequests');
        
        if (stored) {
            const data = JSON.parse(stored);
            if (data.date === today) {
                return data.count;
            }
        }
        
        // Reset count for new day
        localStorage.setItem('weatherApiRequests', JSON.stringify({
            date: today,
            count: 0
        }));
        
        return 0;
    }

    /**
     * Increment daily request count
     */
    incrementDailyCount() {
        this.dailyCount++;
        const today = new Date().toDateString();
        
        localStorage.setItem('weatherApiRequests', JSON.stringify({
            date: today,
            count: this.dailyCount
        }));
    }

    /**
     * Check if we can make a request
     * @returns {boolean} True if request can be made
     */
    canMakeRequest() {
        return this.dailyCount < this.dailyLimit && this.activeRequests < this.maxConcurrent;
    }

    /**
     * Get status information
     * @returns {Object} Status object with current limits and usage
     */
    getStatus() {
        return {
            dailyUsage: `${this.dailyCount}/${this.dailyLimit}`,
            activeRequests: this.activeRequests,
            queueLength: this.requestQueue.length,
            canMakeRequest: this.canMakeRequest()
        };
    }

    /**
     * Reset daily count (for testing)
     */
    resetDailyCount() {
        this.dailyCount = 0;
        const today = new Date().toDateString();
        localStorage.setItem('weatherApiRequests', JSON.stringify({
            date: today,
            count: 0
        }));
        console.log('🔄 Weather API daily count reset');
    }
}

// Export for use in other modules
window.WeatherRateLimiter = WeatherRateLimiter;
