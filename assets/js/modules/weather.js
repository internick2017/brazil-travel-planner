// Weather API Module - Visual Crossing Weather API Integration
// Brazil Travel Planner - Weather Module

class WeatherAPI {
    constructor() {
        this.baseURL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
        // Load API key from config
        this.apiKey = window.API_CONFIG?.weather?.apiKey || null;
        this.cache = new Map();
        this.cacheExpiry = 10 * 60 * 1000; // 10 minutes cache
        
        // Auto-set API key if config is available
        if (this.apiKey && this.apiKey !== 'YOUR_VISUAL_CROSSING_API_KEY_HERE') {
            console.log('✅ Visual Crossing Weather API key loaded successfully');
        } else {
            console.warn('⚠️ Visual Crossing Weather API key not found. Please check config.js');
        }
    }

    /**
     * Set the API key (call this after registration)
     * @param {string} key - Your Visual Crossing API key
     */
    setApiKey(key) {
        this.apiKey = key;
    }

    /**
     * Get current weather for a Brazilian city
     * @param {string} city - City name (e.g., "Rio de Janeiro,Brazil")
     * @param {string} units - 'metric' or 'us' (default: metric)
     * @returns {Promise<Object>} Weather data
     */
    async getCurrentWeather(city, units = 'metric') {
        if (!this.apiKey) {
            throw new Error('API key not set. Please register and set your API key first.');
        }

        const cacheKey = `current-${city}-${units}`;
        
        // Check cache first
        if (this.isValidCache(cacheKey)) {
            console.log('🔄 Using cached weather data for', city);
            return this.cache.get(cacheKey).data;
        }

        try {
            const url = `${this.baseURL}/${encodeURIComponent(city)}?unitGroup=${units}&key=${this.apiKey}&include=current`;
            console.log('🌤️ Fetching current weather for', city);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('❌ Error fetching weather data:', error);
            throw error;
        }
    }

    /**
     * Get weather forecast for a Brazilian city
     * @param {string} city - City name
     * @param {number} days - Number of days (1-15)
     * @param {string} units - 'metric' or 'us'
     * @returns {Promise<Object>} Forecast data
     */
    async getForecast(city, days = 7, units = 'metric') {
        if (!this.apiKey) {
            throw new Error('API key not set. Please register and set your API key first.');
        }

        const cacheKey = `forecast-${city}-${days}-${units}`;
        
        if (this.isValidCache(cacheKey)) {
            console.log('🔄 Using cached forecast data for', city);
            return this.cache.get(cacheKey).data;
        }

        try {
            const url = `${this.baseURL}/${encodeURIComponent(city)}?unitGroup=${units}&key=${this.apiKey}&include=days&elements=datetime,temp,tempmax,tempmin,humidity,precip,windspeed,conditions,icon`;
            console.log('📅 Fetching', days, 'day forecast for', city);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Limit to requested days
            if (data.days && data.days.length > days) {
                data.days = data.days.slice(0, days);
            }
            
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('❌ Error fetching forecast data:', error);
            throw error;
        }
    }

    /**
     * Get weather for multiple Brazilian cities
     * @param {Array<string>} cities - Array of city names
     * @param {string} units - 'metric' or 'us'
     * @returns {Promise<Object>} Weather data for all cities
     */
    async getMultipleCitiesWeather(cities, units = 'metric') {
        const results = {};
        
        try {
            // Process cities in parallel (but respect rate limits)
            const promises = cities.map(async (city, index) => {
                // Add small delay between requests to respect rate limits
                if (index > 0) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
                
                try {
                    const weather = await this.getCurrentWeather(city, units);
                    results[city] = {
                        success: true,
                        data: weather
                    };
                } catch (error) {
                    results[city] = {
                        success: false,
                        error: error.message
                    };
                }
            });
            
            await Promise.all(promises);
            return results;
        } catch (error) {
            console.error('❌ Error fetching multiple cities weather:', error);
            throw error;
        }
    }

    /**
     * Format weather data for display in the UI
     * @param {Object} weatherData - Raw API response
     * @returns {Object} Formatted weather data
     */
    formatWeatherDisplay(weatherData) {
        if (!weatherData || !weatherData.currentConditions) {
            return null;
        }

        const current = weatherData.currentConditions;
        
        return {
            location: weatherData.resolvedAddress,
            temperature: Math.round(current.temp),
            condition: current.conditions,
            icon: this.getWeatherIcon(current.icon),
            humidity: current.humidity,
            windSpeed: current.windspeed,
            feelsLike: Math.round(current.feelslike),
            updated: new Date().toLocaleTimeString()
        };
    }

    /**
     * Convert Visual Crossing weather icons to Font Awesome icons
     * @param {string} vcIcon - Visual Crossing icon name
     * @returns {string} Font Awesome icon class
     */
    getWeatherIcon(vcIcon) {
        const iconMap = {
            'clear-day': 'fas fa-sun',
            'clear-night': 'fas fa-moon',
            'partly-cloudy-day': 'fas fa-cloud-sun',
            'partly-cloudy-night': 'fas fa-cloud-moon',
            'cloudy': 'fas fa-cloud',
            'rain': 'fas fa-cloud-rain',
            'snow': 'fas fa-snowflake',
            'wind': 'fas fa-wind',
            'fog': 'fas fa-smog'
        };
        
        return iconMap[vcIcon] || 'fas fa-cloud';
    }

    /**
     * Check if cached data is still valid
     * @param {string} cacheKey - Cache key to check
     * @returns {boolean} True if cache is valid
     */
    isValidCache(cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (!cached) return false;
        
        const age = Date.now() - cached.timestamp;
        return age < this.cacheExpiry;
    }

    /**
     * Clear the weather cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🧹 Weather cache cleared');
    }

    /**
     * Get Brazilian cities for weather testing
     * @returns {Array<string>} List of major Brazilian cities
     */
    getBrazilianCities() {
        return [
            'Rio de Janeiro,Brazil',
            'São Paulo,Brazil',
            'Salvador,Brazil',
            'Brasília,Brazil',
            'Fortaleza,Brazil',
            'Belo Horizonte,Brazil',
            'Manaus,Brazil',
            'Curitiba,Brazil',
            'Recife,Brazil',
            'Porto Alegre,Brazil'
        ];
    }
}

// Export the WeatherAPI class
window.WeatherAPI = WeatherAPI;

// Example usage (uncomment after setting API key):
/*
const weatherAPI = new WeatherAPI();
weatherAPI.setApiKey('YOUR_API_KEY_HERE');

// Get current weather for Rio de Janeiro
weatherAPI.getCurrentWeather('Rio de Janeiro,Brazil')
    .then(data => console.log('Rio Weather:', weatherAPI.formatWeatherDisplay(data)))
    .catch(error => console.error('Error:', error));
*/
