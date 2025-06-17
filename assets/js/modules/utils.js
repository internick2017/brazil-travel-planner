/**
 * Utility Functions for Brazil Travel Planner
 * Created: June 16, 2025
 * Purpose: Common utility functions used across the application
 */

class BrazilTravelUtils {
    /**
     * Format date to Brazilian format (DD/MM/YYYY)
     * @param {Date} date - Date object to format
     * @returns {string} Formatted date string
     */
    static formatDateBR(date) {
        if (!date) return '';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    /**
     * Format currency to Brazilian Real
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency string
     */
    static formatCurrencyBR(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    }

    /**
     * Calculate days between two dates
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {number} Number of days
     */
    static daysBetween(startDate, endDate) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    /**
     * Get Brazilian season based on date
     * @param {Date} date - Date to check
     * @returns {string} Season name
     */
    static getBrazilianSeason(date) {
        const month = date.getMonth() + 1; // 1-12
        if (month >= 12 || month <= 2) return 'Verão'; // Summer
        if (month >= 3 && month <= 5) return 'Outono'; // Autumn
        if (month >= 6 && month <= 8) return 'Inverno'; // Winter
        if (month >= 9 && month <= 11) return 'Primavera'; // Spring
    }

    /**
     * Validate Brazilian CEP format
     * @param {string} cep - CEP to validate
     * @returns {boolean} True if valid
     */
    static validateCEP(cep) {
        const cepRegex = /^\d{5}-?\d{3}$/;
        return cepRegex.test(cep);
    }

    /**
     * Format CEP with dash
     * @param {string} cep - CEP to format
     * @returns {string} Formatted CEP
     */
    static formatCEP(cep) {
        if (!cep) return '';
        const cleanCEP = cep.replace(/\D/g, '');
        return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
    }

    /**
     * Get weather icon based on condition
     * @param {string} condition - Weather condition
     * @returns {string} Font Awesome icon class
     */
    static getWeatherIcon(condition) {
        const iconMap = {
            'clear': 'fa-sun',
            'sunny': 'fa-sun',
            'partly-cloudy': 'fa-cloud-sun',
            'cloudy': 'fa-cloud',
            'overcast': 'fa-cloud',
            'rain': 'fa-cloud-rain',
            'showers': 'fa-cloud-showers-heavy',
            'thunderstorm': 'fa-bolt',
            'snow': 'fa-snowflake',
            'fog': 'fa-smog',
            'wind': 'fa-wind'
        };
        
        const lowerCondition = condition.toLowerCase();
        for (const [key, icon] of Object.entries(iconMap)) {
            if (lowerCondition.includes(key)) {
                return icon;
            }
        }
        return 'fa-sun'; // Default icon
    }

    /**
     * Generate random ID
     * @returns {string} Random ID
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Capitalize first letter of each word
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    static titleCase(str) {
        if (!str) return '';
        return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Remove accents from string
     * @param {string} str - String to process
     * @returns {string} String without accents
     */
    static removeAccents(str) {
        if (!str) return '';
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    /**
     * Calculate trip duration in days
     * @param {Date} startDate - Trip start date
     * @param {Date} endDate - Trip end date
     * @returns {number} Trip duration in days
     */
    static calculateTripDuration(startDate, endDate) {
        return this.daysBetween(startDate, endDate) + 1; // Include both start and end dates
    }

    /**
     * Get best travel months for Brazil
     * @returns {Array} Array of best travel months
     */
    static getBestTravelMonths() {
        return [
            { month: 'April', season: 'Outono', temp: '20-25°C', reason: 'Dry season, pleasant temperatures' },
            { month: 'May', season: 'Outono', temp: '18-23°C', reason: 'Low humidity, comfortable weather' },
            { month: 'June', season: 'Inverno', temp: '15-20°C', reason: 'Dry season, fewer crowds' },
            { month: 'July', season: 'Inverno', temp: '15-20°C', reason: 'Peak dry season' },
            { month: 'August', season: 'Inverno', temp: '18-23°C', reason: 'Dry, warm weather returns' },
            { month: 'September', season: 'Primavera', temp: '20-25°C', reason: 'Spring weather, low rainfall' }
        ];
    }

    /**
     * Validate trip dates
     * @param {Date} startDate - Trip start date
     * @param {Date} endDate - Trip end date
     * @returns {Object} Validation result
     */
    static validateTripDates(startDate, endDate) {
        const now = new Date();
        const result = { valid: true, errors: [] };

        if (!startDate || !endDate) {
            result.valid = false;
            result.errors.push('Both start and end dates are required');
            return result;
        }

        if (startDate < now) {
            result.valid = false;
            result.errors.push('Start date cannot be in the past');
        }

        if (endDate <= startDate) {
            result.valid = false;
            result.errors.push('End date must be after start date');
        }

        const duration = this.calculateTripDuration(startDate, endDate);
        if (duration > 365) {
            result.valid = false;
            result.errors.push('Trip duration cannot exceed 365 days');
        }

        return result;
    }

    /**
     * Storage helper methods
     */
    static storage = {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Storage get error:', e);
                return defaultValue;
            }
        },
        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Storage remove error:', e);
                return false;
            }
        }
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrazilTravelUtils;
}

// Make available globally
window.BrazilTravelUtils = BrazilTravelUtils;
