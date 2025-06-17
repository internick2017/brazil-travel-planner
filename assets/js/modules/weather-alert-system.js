/**
 * Weather Alert System - Basic Implementation
 * Created: June 16, 2025
 * Purpose: Monitor weather conditions and provide alerts for travel planning
 */

class WeatherAlertSystem {
    constructor(weatherAPI) {
        this.weatherAPI = weatherAPI;
        this.alerts = [];
        this.alertThresholds = {
            temperature: {
                hot: 35, // °C
                cold: 10, // °C
                extreme_hot: 40, // °C
                extreme_cold: 5 // °C
            },
            conditions: {
                severe: ['thunderstorm', 'tornado', 'hurricane', 'severe'],
                caution: ['rain', 'showers', 'storm', 'heavy rain'],
                watch: ['cloudy', 'overcast', 'fog', 'mist']
            },
            wind: {
                high: 25, // km/h
                extreme: 50 // km/h
            }
        };
        this.userPreferences = this.loadUserPreferences();
        this.init();
    }

    init() {
        console.log('🚨 Weather Alert System initialized');
        this.setupEventListeners();
        this.startMonitoring();
    }

    /**
     * Setup event listeners for user interactions
     */
    setupEventListeners() {
        // Listen for weather data updates
        document.addEventListener('weatherDataLoaded', (event) => {
            this.checkWeatherAlerts(event.detail);
        });

        // Setup alert preferences modal trigger
        this.createAlertPreferencesButton();
    }

    /**
     * Start monitoring weather conditions
     */
    startMonitoring() {
        // Check alerts every 30 minutes
        setInterval(() => {
            this.performWeatherCheck();
        }, 30 * 60 * 1000);

        // Initial check
        this.performWeatherCheck();
    }

    /**
     * Perform weather check for current locations
     */
    async performWeatherCheck() {
        try {
            const monitoredCities = this.userPreferences.cities || ['Rio de Janeiro,Brazil', 'São Paulo,Brazil'];
            
            for (const city of monitoredCities) {
                if (this.weatherAPI && this.weatherAPI.apiKey && this.weatherAPI.apiKey !== 'YOUR_VISUAL_CROSSING_API_KEY_HERE') {
                    const weatherData = await this.weatherAPI.getCurrentWeather(city);
                    if (weatherData.success) {
                        this.checkWeatherAlerts(weatherData.data, city);
                    }
                }
            }
        } catch (error) {
            console.warn('Weather alert check failed:', error);
        }
    }

    /**
     * Check weather data for alert conditions
     */
    checkWeatherAlerts(weatherData, cityName = 'Current Location') {
        const alerts = [];
        const temperature = weatherData.temperature || weatherData.temp;
        const condition = (weatherData.condition || weatherData.description || '').toLowerCase();
        const windSpeed = weatherData.windSpeed || weatherData.wind_speed || 0;

        // Temperature alerts
        if (temperature >= this.alertThresholds.temperature.extreme_hot) {
            alerts.push({
                type: 'extreme',
                category: 'temperature',
                title: 'Extreme Heat Warning',
                message: `Dangerous heat levels in ${cityName}: ${temperature}°C. Avoid outdoor activities during peak hours.`,
                icon: 'fas fa-thermometer-full',
                color: 'danger',
                priority: 'high'
            });
        } else if (temperature >= this.alertThresholds.temperature.hot) {
            alerts.push({
                type: 'warning',
                category: 'temperature',
                title: 'High Temperature Alert',
                message: `Very hot weather in ${cityName}: ${temperature}°C. Stay hydrated and seek shade.`,
                icon: 'fas fa-sun',
                color: 'warning',
                priority: 'medium'
            });
        } else if (temperature <= this.alertThresholds.temperature.extreme_cold) {
            alerts.push({
                type: 'extreme',
                category: 'temperature',
                title: 'Extreme Cold Warning',
                message: `Dangerous cold levels in ${cityName}: ${temperature}°C. Dress warmly and limit exposure.`,
                icon: 'fas fa-thermometer-empty',
                color: 'danger',
                priority: 'high'
            });
        } else if (temperature <= this.alertThresholds.temperature.cold) {
            alerts.push({
                type: 'caution',
                category: 'temperature',
                title: 'Cold Weather Alert',
                message: `Cool weather in ${cityName}: ${temperature}°C. Bring warm clothing.`,
                icon: 'fas fa-snowflake',
                color: 'info',
                priority: 'low'
            });
        }

        // Weather condition alerts
        if (this.alertThresholds.conditions.severe.some(keyword => condition.includes(keyword))) {
            alerts.push({
                type: 'extreme',
                category: 'conditions',
                title: 'Severe Weather Warning',
                message: `Severe weather conditions in ${cityName}: ${weatherData.condition}. Avoid travel if possible.`,
                icon: 'fas fa-bolt',
                color: 'danger',
                priority: 'high'
            });
        } else if (this.alertThresholds.conditions.caution.some(keyword => condition.includes(keyword))) {
            alerts.push({
                type: 'caution',
                category: 'conditions',
                title: 'Weather Caution',
                message: `Rainy conditions in ${cityName}: ${weatherData.condition}. Carry an umbrella and drive carefully.`,
                icon: 'fas fa-cloud-rain',
                color: 'warning',
                priority: 'medium'
            });
        } else if (this.alertThresholds.conditions.watch.some(keyword => condition.includes(keyword))) {
            alerts.push({
                type: 'watch',
                category: 'conditions',
                title: 'Weather Watch',
                message: `Cloudy conditions in ${cityName}: ${weatherData.condition}. Consider indoor activities.`,
                icon: 'fas fa-cloud',
                color: 'info',
                priority: 'low'
            });
        }

        // Wind alerts
        if (windSpeed >= this.alertThresholds.wind.extreme) {
            alerts.push({
                type: 'extreme',
                category: 'wind',
                title: 'High Wind Warning',
                message: `Dangerous wind speeds in ${cityName}: ${windSpeed} km/h. Avoid outdoor activities.`,
                icon: 'fas fa-wind',
                color: 'danger',
                priority: 'high'
            });
        } else if (windSpeed >= this.alertThresholds.wind.high) {
            alerts.push({
                type: 'caution',
                category: 'wind',
                title: 'Wind Advisory',
                message: `High winds in ${cityName}: ${windSpeed} km/h. Secure loose objects and be cautious.`,
                icon: 'fas fa-wind',
                color: 'warning',
                priority: 'medium'
            });
        }

        // Process and display alerts
        alerts.forEach(alert => {
            this.processAlert(alert, cityName);
        });
    }

    /**
     * Process and display weather alert
     */
    processAlert(alert, cityName) {
        // Check if this alert was already shown recently
        const alertId = `${alert.category}_${cityName}_${Date.now()}`;
        
        if (this.shouldShowAlert(alert)) {
            this.showAlert(alert, alertId);
            this.logAlert(alert, cityName);
            this.alerts.push({
                ...alert,
                id: alertId,
                cityName,
                timestamp: new Date(),
                shown: true
            });
        }
    }

    /**
     * Determine if alert should be shown based on user preferences
     */
    shouldShowAlert(alert) {
        const preferences = this.userPreferences;
        
        // Check if user enabled this type of alert
        if (!preferences.alertTypes[alert.category]) {
            return false;
        }

        // Check priority threshold
        const priorityLevels = { low: 1, medium: 2, high: 3 };
        const userPriorityLevel = priorityLevels[preferences.minPriority] || 1;
        const alertPriorityLevel = priorityLevels[alert.priority] || 1;
        
        return alertPriorityLevel >= userPriorityLevel;
    }

    /**
     * Display weather alert to user
     */
    showAlert(alert, alertId) {
        // Create alert container if it doesn't exist
        let alertContainer = document.getElementById('weather-alerts-container');
        if (!alertContainer) {
            alertContainer = document.createElement('div');
            alertContainer.id = 'weather-alerts-container';
            alertContainer.className = 'position-fixed';
            alertContainer.style.cssText = `
                top: 80px;
                right: 20px;
                z-index: 9999;
                max-width: 350px;
            `;
            document.body.appendChild(alertContainer);
        }

        // Create alert element
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${alert.color} alert-dismissible fade show mb-2 shadow animate-slideInRight`;
        alertElement.setAttribute('data-alert-id', alertId);
        
        alertElement.innerHTML = `
            <div class="d-flex align-items-start">
                <i class="${alert.icon} me-2 mt-1"></i>
                <div class="flex-grow-1">
                    <h6 class="alert-heading mb-1">${alert.title}</h6>
                    <p class="mb-2">${alert.message}</p>
                    <small class="text-muted">
                        <i class="fas fa-clock me-1"></i>
                        ${new Date().toLocaleTimeString()}
                    </small>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        alertContainer.appendChild(alertElement);

        // Auto-remove alert after 30 seconds for non-extreme alerts
        if (alert.priority !== 'high') {
            setTimeout(() => {
                if (alertElement.parentNode) {
                    alertElement.remove();
                }
            }, 30000);
        }

        // Add sound notification for high priority alerts
        if (alert.priority === 'high' && this.userPreferences.soundEnabled) {
            this.playAlertSound();
        }
    }

    /**
     * Play alert sound for high priority alerts
     */
    playAlertSound() {
        try {
            // Create audio context for alert sound
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.warn('Could not play alert sound:', error);
        }
    }

    /**
     * Log alert for history
     */
    logAlert(alert, cityName) {
        console.log(`🚨 Weather Alert: ${alert.title} in ${cityName} - ${alert.message}`);
    }

    /**
     * Create alert preferences button and modal
     */
    createAlertPreferencesButton() {
        // Add preferences button to navigation if it doesn't exist
        const navbar = document.querySelector('.navbar-nav');
        if (navbar && !document.getElementById('alert-preferences-btn')) {
            const alertBtn = document.createElement('li');
            alertBtn.className = 'nav-item';
            alertBtn.innerHTML = `
                <a class="nav-link" href="#" id="alert-preferences-btn" data-bs-toggle="modal" data-bs-target="#alertPreferencesModal">
                    <i class="fas fa-bell"></i>
                    <span class="d-none d-lg-inline ms-1">Alerts</span>
                </a>
            `;
            navbar.appendChild(alertBtn);
        }

        // Create preferences modal
        this.createPreferencesModal();
    }

    /**
     * Create alert preferences modal
     */
    createPreferencesModal() {
        if (document.getElementById('alertPreferencesModal')) return;

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'alertPreferencesModal';
        modal.setAttribute('tabindex', '-1');
        
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-bell me-2"></i>
                            Weather Alert Preferences
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="alertPreferencesForm">
                            <div class="mb-3">
                                <label class="form-label">Alert Types</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="temperatureAlerts" checked>
                                    <label class="form-check-label" for="temperatureAlerts">
                                        <i class="fas fa-thermometer-half me-2"></i>Temperature Alerts
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="conditionAlerts" checked>
                                    <label class="form-check-label" for="conditionAlerts">
                                        <i class="fas fa-cloud-rain me-2"></i>Weather Condition Alerts
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="windAlerts" checked>
                                    <label class="form-check-label" for="windAlerts">
                                        <i class="fas fa-wind me-2"></i>Wind Alerts
                                    </label>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="minPriority" class="form-label">Minimum Alert Priority</label>
                                <select class="form-select" id="minPriority">
                                    <option value="low">Low - All alerts</option>
                                    <option value="medium" selected>Medium - Important alerts only</option>
                                    <option value="high">High - Critical alerts only</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="soundEnabled">
                                    <label class="form-check-label" for="soundEnabled">
                                        <i class="fas fa-volume-up me-2"></i>Enable sound for critical alerts
                                    </label>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Monitor Cities</label>
                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="rioAlerts" checked>
                                            <label class="form-check-label" for="rioAlerts">Rio de Janeiro</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="spAlerts" checked>
                                            <label class="form-check-label" for="spAlerts">São Paulo</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="salvadorAlerts">
                                            <label class="form-check-label" for="salvadorAlerts">Salvador</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="brasiliaAlerts">
                                            <label class="form-check-label" for="brasiliaAlerts">Brasília</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveAlertPreferences">Save Preferences</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup save preferences handler
        document.getElementById('saveAlertPreferences').addEventListener('click', () => {
            this.saveAlertPreferences();
        });

        // Load current preferences
        this.loadPreferencesIntoModal();
    }

    /**
     * Load user preferences from localStorage
     */
    loadUserPreferences() {
        const defaultPreferences = {
            alertTypes: {
                temperature: true,
                conditions: true,
                wind: true
            },
            minPriority: 'medium',
            soundEnabled: false,
            cities: ['Rio de Janeiro,Brazil', 'São Paulo,Brazil']
        };

        try {
            const saved = localStorage.getItem('weatherAlertPreferences');
            return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
        } catch (error) {
            return defaultPreferences;
        }
    }

    /**
     * Save user preferences to localStorage
     */
    saveUserPreferences(preferences) {
        try {
            localStorage.setItem('weatherAlertPreferences', JSON.stringify(preferences));
        } catch (error) {
            console.warn('Could not save alert preferences:', error);
        }
    }

    /**
     * Load preferences into modal form
     */
    loadPreferencesIntoModal() {
        const prefs = this.userPreferences;
        
        document.getElementById('temperatureAlerts').checked = prefs.alertTypes.temperature;
        document.getElementById('conditionAlerts').checked = prefs.alertTypes.conditions;
        document.getElementById('windAlerts').checked = prefs.alertTypes.wind;
        document.getElementById('minPriority').value = prefs.minPriority;
        document.getElementById('soundEnabled').checked = prefs.soundEnabled;
        
        // Set city checkboxes
        document.getElementById('rioAlerts').checked = prefs.cities.includes('Rio de Janeiro,Brazil');
        document.getElementById('spAlerts').checked = prefs.cities.includes('São Paulo,Brazil');
        document.getElementById('salvadorAlerts').checked = prefs.cities.includes('Salvador,Brazil');
        document.getElementById('brasiliaAlerts').checked = prefs.cities.includes('Brasília,Brazil');
    }

    /**
     * Save alert preferences from modal
     */
    saveAlertPreferences() {
        const cities = [];
        if (document.getElementById('rioAlerts').checked) cities.push('Rio de Janeiro,Brazil');
        if (document.getElementById('spAlerts').checked) cities.push('São Paulo,Brazil');
        if (document.getElementById('salvadorAlerts').checked) cities.push('Salvador,Brazil');
        if (document.getElementById('brasiliaAlerts').checked) cities.push('Brasília,Brazil');

        const preferences = {
            alertTypes: {
                temperature: document.getElementById('temperatureAlerts').checked,
                conditions: document.getElementById('conditionAlerts').checked,
                wind: document.getElementById('windAlerts').checked
            },
            minPriority: document.getElementById('minPriority').value,
            soundEnabled: document.getElementById('soundEnabled').checked,
            cities: cities
        };

        this.userPreferences = preferences;
        this.saveUserPreferences(preferences);

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('alertPreferencesModal'));
        modal.hide();

        // Show success message
        this.showAlert({
            type: 'success',
            title: 'Preferences Saved',
            message: 'Your weather alert preferences have been updated.',
            icon: 'fas fa-check',
            color: 'success',
            priority: 'low'
        }, 'preferences_saved');
    }

    /**
     * Get alert history
     */
    getAlertHistory() {
        return this.alerts.filter(alert => alert.shown);
    }

    /**
     * Clear alert history
     */
    clearAlertHistory() {
        this.alerts = [];
    }

    /**
     * Test alert system
     */
    testAlertSystem() {
        const testAlert = {
            type: 'test',
            category: 'test',
            title: 'Test Alert',
            message: 'This is a test of the weather alert system. Everything is working correctly!',
            icon: 'fas fa-vial',
            color: 'info',
            priority: 'medium'
        };

        this.showAlert(testAlert, 'test_alert');
        console.log('🧪 Weather alert system test completed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherAlertSystem;
}

// Make available globally
window.WeatherAlertSystem = WeatherAlertSystem;
