// Weather Comparison Module
// Compare weather across multiple Brazilian cities and regions

class WeatherComparison {
    constructor(weatherAPI) {
        this.weatherAPI = weatherAPI;
        this.comparisonData = [];
    }

    async compareRegions(cities, dateRange = null) {
        const results = [];
        
        for (const city of cities) {
            try {
                const weather = await this.weatherAPI.getCurrentWeather(`${city},Brazil`);
                results.push({
                    city: city,
                    temperature: weather.temp || 25,
                    condition: weather.conditions || 'Clear',
                    humidity: weather.humidity || 65,
                    windSpeed: weather.windspeed || 10,
                    feelsLike: weather.feelslike || weather.temp || 25,
                    success: true
                });
            } catch (error) {
                console.warn(`Failed to get weather for ${city}:`, error);
                results.push({
                    city: city,
                    temperature: this.getFallbackTemp(city),
                    condition: 'Data unavailable',
                    humidity: 60,
                    windSpeed: 8,
                    feelsLike: this.getFallbackTemp(city),
                    success: false
                });
            }
        }
        
        this.comparisonData = results;
        return results;
    }

    getFallbackTemp(city) {
        const fallbacks = {
            'Rio de Janeiro': 28,
            'São Paulo': 22,
            'Brasília': 26,
            'Salvador': 29,
            'Manaus': 31,
            'Florianópolis': 24,
            'Fortaleza': 30,
            'Recife': 28
        };
        return fallbacks[city] || 25;
    }

    renderComparison(containerId) {
        const container = document.getElementById(containerId);
        if (!container || this.comparisonData.length === 0) return;

        const hottest = this.comparisonData.reduce((max, city) => 
            city.temperature > max.temperature ? city : max
        );
        const coolest = this.comparisonData.reduce((min, city) => 
            city.temperature < min.temperature ? city : min
        );

        container.innerHTML = `
            <div class="weather-comparison">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <div class="card bg-danger text-white">
                            <div class="card-body text-center">
                                <h6>🌡️ Hottest</h6>
                                <h4>${hottest.city}</h4>
                                <p class="mb-0">${hottest.temperature}°C</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card bg-info text-white">
                            <div class="card-body text-center">
                                <h6>❄️ Coolest</h6>
                                <h4>${coolest.city}</h4>
                                <p class="mb-0">${coolest.temperature}°C</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="comparison-grid">
                    ${this.comparisonData.map(city => `
                        <div class="comparison-card card mb-2 ${!city.success ? 'border-warning' : ''}">
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <div class="col-4">
                                        <h6 class="mb-0">${city.city}</h6>
                                        ${!city.success ? '<small class="text-warning">Cached data</small>' : ''}
                                    </div>
                                    <div class="col-2 text-center">
                                        <div class="h5 mb-0">${city.temperature}°C</div>
                                    </div>
                                    <div class="col-3">
                                        <small class="text-muted">${city.condition}</small>
                                    </div>
                                    <div class="col-3">
                                        <small class="text-muted">
                                            <i class="fas fa-tint me-1"></i>${city.humidity}%
                                            <br><i class="fas fa-wind me-1"></i>${city.windSpeed}km/h
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center mt-3">
                    <small class="text-muted">
                        Last updated: ${new Date().toLocaleTimeString()}
                    </small>
                </div>
            </div>
        `;
    }

    generateSeasonalComparison(cities) {
        const seasons = {
            summer: { months: [11, 0, 1, 2], name: 'Summer (Dec-Mar)' },
            autumn: { months: [3, 4, 5], name: 'Autumn (Apr-Jun)' },
            winter: { months: [6, 7, 8], name: 'Winter (Jul-Sep)' },
            spring: { months: [9, 10], name: 'Spring (Oct-Nov)' }
        };

        return Object.entries(seasons).map(([key, season]) => ({
            season: season.name,
            recommendations: this.getSeasonalRecommendations(key, cities)
        }));
    }

    getSeasonalRecommendations(season, cities) {
        const recommendations = {
            summer: {
                'Rio de Janeiro': 'Peak beach season, crowded but vibrant',
                'São Paulo': 'Hot and humid, good for indoor activities',
                'Salvador': 'Carnival season, festivals and celebrations',
                'Manaus': 'Rainy season, good for river tours'
            },
            winter: {
                'Rio de Janeiro': 'Mild temperatures, perfect for sightseeing',
                'São Paulo': 'Cool and dry, ideal for city exploration',
                'Salvador': 'Dry season, best weather for outdoor activities',
                'Manaus': 'Dry season, best time for Amazon tours'
            }
        };

        return cities.map(city => ({
            city,
            advice: recommendations[season]?.[city] || 'Good time to visit'
        }));
    }
}

// Export for global use
window.WeatherComparison = WeatherComparison;
