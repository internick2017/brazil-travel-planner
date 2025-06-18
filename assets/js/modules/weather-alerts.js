// Weather Alert System (Basic)
// Monitor weather conditions and provide alerts

class WeatherAlertSystem {
    constructor(weatherAPI) {
        this.weatherAPI = weatherAPI;
        this.alertThresholds = {
            maxTemp: 35,
            minTemp: 10,
            maxWind: 50,
            maxRain: 80,
            maxHumidity: 90
        };
        this.alerts = [];
        this.userPreferences = this.loadUserPreferences();
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('weatherAlertPreferences');
        return saved ? JSON.parse(saved) : {
            enableAlerts: true,
            alertTypes: ['temperature', 'rain', 'wind'],
            cities: ['Rio de Janeiro', 'São Paulo'],
            notificationMethod: 'browser'
        };
    }

    saveUserPreferences(preferences) {
        this.userPreferences = { ...this.userPreferences, ...preferences };
        localStorage.setItem('weatherAlertPreferences', JSON.stringify(this.userPreferences));
    }

    async checkWeatherAlerts(cities = null) {
        if (!this.userPreferences.enableAlerts) return [];

        const citiesToCheck = cities || this.userPreferences.cities;
        const alerts = [];

        for (const city of citiesToCheck) {
            try {
                const weather = await this.weatherAPI.getCurrentWeather(`${city},Brazil`);
                const cityAlerts = this.analyzeWeatherConditions(city, weather);
                alerts.push(...cityAlerts);
            } catch (error) {
                console.warn(`Could not check weather alerts for ${city}:`, error);
            }
        }

        this.alerts = alerts;
        if (alerts.length > 0) {
            this.notifyUser(alerts);
        }

        return alerts;
    }

    analyzeWeatherConditions(city, weather) {
        const alerts = [];
        const { alertTypes } = this.userPreferences;

        // Temperature alerts
        if (alertTypes.includes('temperature')) {
            if (weather.temp > this.alertThresholds.maxTemp) {
                alerts.push({
                    type: 'temperature',
                    severity: 'high',
                    city,
                    message: `Extreme heat warning: ${weather.temp}°C in ${city}`,
                    value: weather.temp,
                    threshold: this.alertThresholds.maxTemp,
                    icon: '🌡️',
                    timestamp: new Date()
                });
            } else if (weather.temp < this.alertThresholds.minTemp) {
                alerts.push({
                    type: 'temperature',
                    severity: 'medium',
                    city,
                    message: `Cold weather alert: ${weather.temp}°C in ${city}`,
                    value: weather.temp,
                    threshold: this.alertThresholds.minTemp,
                    icon: '🥶',
                    timestamp: new Date()
                });
            }
        }

        // Wind alerts
        if (alertTypes.includes('wind') && weather.windspeed > this.alertThresholds.maxWind) {
            alerts.push({
                type: 'wind',
                severity: 'high',
                city,
                message: `Strong wind warning: ${weather.windspeed} km/h in ${city}`,
                value: weather.windspeed,
                threshold: this.alertThresholds.maxWind,
                icon: '💨',
                timestamp: new Date()
            });
        }

        // Rain/humidity alerts
        if (alertTypes.includes('rain') && weather.humidity > this.alertThresholds.maxHumidity) {
            alerts.push({
                type: 'rain',
                severity: 'medium',
                city,
                message: `High humidity alert: ${weather.humidity}% in ${city}`,
                value: weather.humidity,
                threshold: this.alertThresholds.maxHumidity,
                icon: '🌧️',
                timestamp: new Date()
            });
        }

        return alerts;
    }

    notifyUser(alerts) {
        const { notificationMethod } = this.userPreferences;

        switch (notificationMethod) {
            case 'browser':
                this.showBrowserNotification(alerts);
                break;
            case 'toast':
                this.showToastNotification(alerts);
                break;
            default:
                this.showInAppAlert(alerts);
        }
    }

    showBrowserNotification(alerts) {
        if ('Notification' in window && Notification.permission === 'granted') {
            alerts.forEach(alert => {
                new Notification(`Weather Alert - ${alert.city}`, {
                    body: alert.message,
                    icon: '/favicon.ico',
                    tag: `weather-${alert.city}-${alert.type}`
                });
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showBrowserNotification(alerts);
                }
            });
        }
    }

    showToastNotification(alerts) {
        alerts.forEach(alert => {
            const toast = document.createElement('div');
            toast.className = `alert alert-warning alert-dismissible fade show position-fixed`;
            toast.style.cssText = `
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                animation: slideIn 0.3s ease-out;
            `;
            
            toast.innerHTML = `
                <span class="me-2">${alert.icon}</span>
                <strong>${alert.city}:</strong> ${alert.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

            document.body.appendChild(toast);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 5000);
        });
    }

    showInAppAlert(alerts) {
        const alertContainer = document.getElementById('weatherAlerts');
        if (!alertContainer) return;

        const alertsHTML = alerts.map(alert => `
            <div class="alert alert-${alert.severity === 'high' ? 'danger' : 'warning'} alert-dismissible">
                <span class="me-2">${alert.icon}</span>
                <strong>${alert.city}:</strong> ${alert.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `).join('');

        alertContainer.innerHTML = alertsHTML;
    }

    renderSettingsPanel(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="weather-alert-settings">
                <h6 class="mb-3">Weather Alert Settings</h6>
                
                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" id="enableAlerts" ${this.userPreferences.enableAlerts ? 'checked' : ''}>
                    <label class="form-check-label" for="enableAlerts">
                        Enable Weather Alerts
                    </label>
                </div>

                <div class="mb-3">
                    <label class="form-label">Alert Types</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="tempAlerts" ${this.userPreferences.alertTypes.includes('temperature') ? 'checked' : ''}>
                        <label class="form-check-label" for="tempAlerts">Temperature Alerts</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="windAlerts" ${this.userPreferences.alertTypes.includes('wind') ? 'checked' : ''}>
                        <label class="form-check-label" for="windAlerts">Wind Alerts</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="rainAlerts" ${this.userPreferences.alertTypes.includes('rain') ? 'checked' : ''}>
                        <label class="form-check-label" for="rainAlerts">Rain/Humidity Alerts</label>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">Notification Method</label>
                    <select class="form-select" id="notificationMethod">
                        <option value="browser" ${this.userPreferences.notificationMethod === 'browser' ? 'selected' : ''}>Browser Notifications</option>
                        <option value="toast" ${this.userPreferences.notificationMethod === 'toast' ? 'selected' : ''}>Toast Messages</option>
                        <option value="inapp" ${this.userPreferences.notificationMethod === 'inapp' ? 'selected' : ''}>In-App Alerts</option>
                    </select>
                </div>

                <button class="btn btn-primary btn-sm" onclick="weatherAlertSystem.saveSettings()">
                    Save Settings
                </button>
                <button class="btn btn-outline-secondary btn-sm ms-2" onclick="weatherAlertSystem.testAlert()">
                    Test Alert
                </button>
            </div>
        `;
    }

    saveSettings() {
        const enableAlerts = document.getElementById('enableAlerts').checked;
        const alertTypes = [];
        
        if (document.getElementById('tempAlerts').checked) alertTypes.push('temperature');
        if (document.getElementById('windAlerts').checked) alertTypes.push('wind');
        if (document.getElementById('rainAlerts').checked) alertTypes.push('rain');
        
        const notificationMethod = document.getElementById('notificationMethod').value;

        this.saveUserPreferences({
            enableAlerts,
            alertTypes,
            notificationMethod
        });

        this.showToastNotification([{
            icon: '✅',
            city: 'System',
            message: 'Alert settings saved successfully!'
        }]);
    }

    testAlert() {
        const testAlert = {
            type: 'test',
            severity: 'medium',
            city: 'Test',
            message: 'This is a test weather alert',
            icon: '🧪',
            timestamp: new Date()
        };

        this.notifyUser([testAlert]);
    }

    getCurrentAlerts() {
        return this.alerts;
    }

    clearAlerts() {
        this.alerts = [];
        const alertContainer = document.getElementById('weatherAlerts');
        if (alertContainer) {
            alertContainer.innerHTML = '';
        }
    }
}

// Export for global use
window.WeatherAlertSystem = WeatherAlertSystem;
