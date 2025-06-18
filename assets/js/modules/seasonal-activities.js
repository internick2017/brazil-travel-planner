// Seasonal Activity Recommendations Module
// Smart recommendation system for seasonal activities in Brazil

class SeasonalActivityRecommendations {
    constructor() {
        this.activityDatabase = this.initializeActivityDatabase();
        this.userPreferences = this.loadUserPreferences();
    }

    initializeActivityDatabase() {
        return {
            'Rio de Janeiro': {
                summer: {
                    activities: [
                        { name: 'Beach Activities', rating: 95, description: 'Perfect beach weather with warm temperatures' },
                        { name: 'Outdoor Sports', rating: 85, description: 'Great for surfing, volleyball, and water sports' },
                        { name: 'Carnival Events', rating: 100, description: 'Peak carnival season with street parties' },
                        { name: 'Christ the Redeemer', rating: 80, description: 'Clear skies for great views, but crowded' },
                        { name: 'Sugarloaf Mountain', rating: 75, description: 'Beautiful views but very hot during day' }
                    ],
                    bestTime: 'December - March',
                    weather: 'Hot and humid (25-35°C)',
                    crowds: 'Very high',
                    prices: 'Peak season rates'
                },
                autumn: {
                    activities: [
                        { name: 'City Sightseeing', rating: 90, description: 'Perfect weather for walking tours' },
                        { name: 'Museums and Culture', rating: 85, description: 'Comfortable indoor/outdoor exploration' },
                        { name: 'Beach Activities', rating: 70, description: 'Still warm but less crowded beaches' },
                        { name: 'Hiking', rating: 80, description: 'Great weather for Tijuca Forest trails' },
                        { name: 'Photography', rating: 95, description: 'Excellent lighting and clear skies' }
                    ],
                    bestTime: 'April - June',
                    weather: 'Mild and comfortable (20-28°C)',
                    crowds: 'Moderate',
                    prices: 'Shoulder season rates'
                },
                winter: {
                    activities: [
                        { name: 'Sightseeing', rating: 100, description: 'Perfect weather for all outdoor activities' },
                        { name: 'Cultural Events', rating: 90, description: 'Many festivals and cultural events' },
                        { name: 'Food Tours', rating: 85, description: 'Comfortable weather for food exploration' },
                        { name: 'Museums', rating: 80, description: 'Great time for indoor attractions' },
                        { name: 'Hiking', rating: 95, description: 'Ideal hiking weather' }
                    ],
                    bestTime: 'July - September',
                    weather: 'Cool and dry (18-25°C)',
                    crowds: 'Low to moderate',
                    prices: 'Off-season rates'
                },
                spring: {
                    activities: [
                        { name: 'All Activities', rating: 85, description: 'Great all-around weather' },
                        { name: 'Beach Activities', rating: 75, description: 'Warming up for beach season' },
                        { name: 'City Tours', rating: 90, description: 'Pleasant walking weather' },
                        { name: 'Outdoor Dining', rating: 80, description: 'Perfect for street food and outdoor restaurants' },
                        { name: 'Nightlife', rating: 85, description: 'Comfortable evening temperatures' }
                    ],
                    bestTime: 'October - November',
                    weather: 'Warm and pleasant (22-30°C)',
                    crowds: 'Increasing',
                    prices: 'Pre-season rates'
                }
            },
            'São Paulo': {
                summer: {
                    activities: [
                        { name: 'Indoor Attractions', rating: 85, description: 'Museums, galleries, shopping malls' },
                        { name: 'Food Scene', rating: 95, description: 'Perfect time to explore restaurants' },
                        { name: 'Nightlife', rating: 90, description: 'Vibrant summer nightlife scene' },
                        { name: 'Cultural Events', rating: 80, description: 'Many summer festivals and events' },
                        { name: 'Day Trips', rating: 70, description: 'Visit nearby beach towns on weekends' }
                    ],
                    bestTime: 'December - March',
                    weather: 'Hot and rainy (20-30°C)',
                    crowds: 'High',
                    prices: 'Peak season'
                },
                winter: {
                    activities: [
                        { name: 'City Exploration', rating: 100, description: 'Perfect weather for walking' },
                        { name: 'Museums and Galleries', rating: 95, description: 'Comfortable indoor/outdoor visits' },
                        { name: 'Food Tours', rating: 90, description: 'Great weather for food market visits' },
                        { name: 'Cultural Districts', rating: 85, description: 'Explore Vila Madalena, Bela Vista' },
                        { name: 'Business Tourism', rating: 80, description: 'Best time for conferences and meetings' }
                    ],
                    bestTime: 'June - August',
                    weather: 'Cool and dry (15-23°C)',
                    crowds: 'Low',
                    prices: 'Best deals'
                }
            },
            'Salvador': {
                summer: {
                    activities: [
                        { name: 'Beach Activities', rating: 95, description: 'Perfect beach weather' },
                        { name: 'Carnival', rating: 100, description: 'World-famous Carnival celebration' },
                        { name: 'Cultural Tours', rating: 85, description: 'Pelourinho historic center' },
                        { name: 'Music and Dance', rating: 90, description: 'Live music and capoeira shows' },
                        { name: 'Food Culture', rating: 85, description: 'Bahian cuisine at its best' }
                    ],
                    bestTime: 'December - March',
                    weather: 'Hot and humid (25-32°C)',
                    crowds: 'Very high during Carnival',
                    prices: 'Peak season, especially Carnival'
                },
                winter: {
                    activities: [
                        { name: 'Historic Center Tours', rating: 100, description: 'Perfect weather for walking tours' },
                        { name: 'Beach Activities', rating: 80, description: 'Still warm enough for beaches' },
                        { name: 'Cultural Immersion', rating: 95, description: 'Afro-Brazilian culture experiences' },
                        { name: 'Local Markets', rating: 90, description: 'Mercado Modelo and local crafts' },
                        { name: 'Religious Tourism', rating: 85, description: 'Visit churches and religious sites' }
                    ],
                    bestTime: 'June - September',
                    weather: 'Warm and dry (22-28°C)',
                    crowds: 'Moderate',
                    prices: 'Lower rates'
                }
            }
        };
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('seasonalActivityPreferences');
        return saved ? JSON.parse(saved) : {
            preferredActivities: ['sightseeing', 'culture', 'food'],
            budgetLevel: 'moderate',
            crowdTolerance: 'moderate',
            weatherPreference: 'mild'
        };
    }

    saveUserPreferences(preferences) {
        this.userPreferences = { ...this.userPreferences, ...preferences };
        localStorage.setItem('seasonalActivityPreferences', JSON.stringify(this.userPreferences));
    }

    getCurrentSeason() {
        const month = new Date().getMonth();
        if ([11, 0, 1].includes(month)) return 'summer';
        if ([2, 3, 4].includes(month)) return 'autumn';
        if ([5, 6, 7].includes(month)) return 'winter';
        return 'spring';
    }

    getSeasonFromDate(date) {
        const month = new Date(date).getMonth();
        if ([11, 0, 1].includes(month)) return 'summer';
        if ([2, 3, 4].includes(month)) return 'autumn';
        if ([5, 6, 7].includes(month)) return 'winter';
        return 'spring';
    }

    getRecommendationsForCity(city, season = null) {
        const targetSeason = season || this.getCurrentSeason();
        const cityData = this.activityDatabase[city];
        
        if (!cityData || !cityData[targetSeason]) {
            return this.getFallbackRecommendations(city, targetSeason);
        }

        const seasonData = cityData[targetSeason];
        
        // Score activities based on user preferences
        const scoredActivities = seasonData.activities.map(activity => ({
            ...activity,
            personalizedScore: this.calculatePersonalizedScore(activity, seasonData)
        })).sort((a, b) => b.personalizedScore - a.personalizedScore);

        return {
            city,
            season: targetSeason,
            seasonData,
            topActivities: scoredActivities.slice(0, 5),
            allActivities: scoredActivities,
            weatherInfo: {
                description: seasonData.weather,
                crowds: seasonData.crowds,
                prices: seasonData.prices,
                bestTime: seasonData.bestTime
            }
        };
    }

    calculatePersonalizedScore(activity, seasonData) {
        let score = activity.rating;
        
        // Adjust based on user preferences
        const { budgetLevel, crowdTolerance, weatherPreference } = this.userPreferences;
        
        // Budget adjustments
        if (budgetLevel === 'budget' && seasonData.prices.includes('Peak')) {
            score -= 15;
        } else if (budgetLevel === 'luxury' && seasonData.prices.includes('Off-season')) {
            score += 10;
        }
        
        // Crowd tolerance adjustments
        if (crowdTolerance === 'low' && seasonData.crowds.includes('high')) {
            score -= 20;
        } else if (crowdTolerance === 'high' && seasonData.crowds.includes('Very high')) {
            score += 5;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    getFallbackRecommendations(city, season) {
        return {
            city,
            season,
            topActivities: [
                { name: 'City Sightseeing', rating: 80, description: 'Explore the main attractions' },
                { name: 'Local Cuisine', rating: 85, description: 'Try regional dishes and restaurants' },
                { name: 'Cultural Sites', rating: 75, description: 'Visit museums and cultural centers' }
            ],
            weatherInfo: {
                description: 'Check local weather conditions',
                crowds: 'Varies by location',
                prices: 'Standard rates',
                bestTime: 'Year-round destination'
            }
        };
    }

    getMultiCityRecommendations(cities, travelDates) {
        const startDate = new Date(travelDates.start);
        const endDate = new Date(travelDates.end);
        
        const recommendations = cities.map(city => {
            const season = this.getSeasonFromDate(startDate);
            return this.getRecommendationsForCity(city, season);
        });

        return {
            travelPeriod: {
                start: startDate.toLocaleDateString(),
                end: endDate.toLocaleDateString(),
                season: this.getSeasonFromDate(startDate)
            },
            cityRecommendations: recommendations,
            overallRecommendations: this.generateOverallRecommendations(recommendations)
        };
    }

    generateOverallRecommendations(cityRecommendations) {
        const allActivities = cityRecommendations.flatMap(rec => rec.topActivities);
        const activityTypes = {};
        
        allActivities.forEach(activity => {
            const type = this.categorizeActivity(activity.name);
            if (!activityTypes[type]) {
                activityTypes[type] = { count: 0, avgRating: 0, activities: [] };
            }
            activityTypes[type].count++;
            activityTypes[type].activities.push(activity);
        });

        // Calculate average ratings
        Object.keys(activityTypes).forEach(type => {
            const activities = activityTypes[type].activities;
            activityTypes[type].avgRating = activities.reduce((sum, act) => sum + act.rating, 0) / activities.length;
        });

        return {
            recommendedActivityTypes: Object.entries(activityTypes)
                .sort(([,a], [,b]) => b.avgRating - a.avgRating)
                .slice(0, 3)
                .map(([type, data]) => ({ type, rating: Math.round(data.avgRating) })),
            generalAdvice: this.generateGeneralAdvice(cityRecommendations)
        };
    }

    categorizeActivity(activityName) {
        const categories = {
            'Beach': ['Beach Activities', 'water sports', 'surfing'],
            'Culture': ['Museums', 'Cultural', 'Historic', 'religious'],
            'Food': ['Food', 'restaurants', 'cuisine', 'markets'],
            'Sightseeing': ['Sightseeing', 'City Tours', 'Photography'],
            'Entertainment': ['Nightlife', 'Music', 'Carnival', 'festivals']
        };

        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => activityName.toLowerCase().includes(keyword.toLowerCase()))) {
                return category;
            }
        }
        return 'Other';
    }

    generateGeneralAdvice(cityRecommendations) {
        const advice = [];
        const avgCrowds = cityRecommendations.map(rec => rec.weatherInfo.crowds);
        const avgPrices = cityRecommendations.map(rec => rec.weatherInfo.prices);

        if (avgCrowds.some(crowd => crowd.includes('high'))) {
            advice.push('Book accommodations and attractions in advance due to high season');
        }

        if (avgPrices.some(price => price.includes('Peak'))) {
            advice.push('Consider budget-friendly alternatives as this is peak season');
        }

        if (avgCrowds.every(crowd => crowd.includes('low'))) {
            advice.push('Great time for spontaneous travel with fewer crowds');
        }

        return advice.length > 0 ? advice : ['Enjoy your trip to Brazil!'];
    }

    renderRecommendations(containerId, recommendations) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (recommendations.cityRecommendations) {
            // Multi-city recommendations
            this.renderMultiCityRecommendations(container, recommendations);
        } else {
            // Single city recommendations
            this.renderSingleCityRecommendations(container, recommendations);
        }
    }

    renderSingleCityRecommendations(container, rec) {
        container.innerHTML = `
            <div class="seasonal-recommendations">
                <div class="season-header mb-3">
                    <h5>${rec.city} - ${rec.season.charAt(0).toUpperCase() + rec.season.slice(1)} Activities</h5>
                    <div class="season-info row g-2">
                        <div class="col-md-3">
                            <small class="text-muted">Weather:</small>
                            <div class="fw-bold">${rec.weatherInfo.description}</div>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted">Crowds:</small>
                            <div class="fw-bold">${rec.weatherInfo.crowds}</div>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted">Prices:</small>
                            <div class="fw-bold">${rec.weatherInfo.prices}</div>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted">Best Time:</small>
                            <div class="fw-bold">${rec.weatherInfo.bestTime}</div>
                        </div>
                    </div>
                </div>

                <div class="top-activities">
                    <h6 class="mb-3">Recommended Activities</h6>
                    ${rec.topActivities.map(activity => `
                        <div class="activity-card card mb-2">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">${activity.name}</h6>
                                        <p class="mb-0 text-muted small">${activity.description}</p>
                                    </div>
                                    <span class="badge bg-primary">${activity.personalizedScore || activity.rating}%</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderMultiCityRecommendations(container, recommendations) {
        container.innerHTML = `
            <div class="multi-city-recommendations">
                <div class="travel-period-header mb-4">
                    <h5>Trip Recommendations</h5>
                    <p class="text-muted">
                        ${recommendations.travelPeriod.start} - ${recommendations.travelPeriod.end} 
                        (${recommendations.travelPeriod.season} season)
                    </p>
                </div>

                ${recommendations.cityRecommendations.map(rec => `
                    <div class="city-recommendations mb-4">
                        <h6>${rec.city}</h6>
                        <div class="row g-2 mb-3">
                            ${rec.topActivities.slice(0, 3).map(activity => `
                                <div class="col-md-4">
                                    <div class="card h-100">
                                        <div class="card-body p-3">
                                            <h6 class="card-title small">${activity.name}</h6>
                                            <p class="card-text small text-muted">${activity.description}</p>
                                            <span class="badge bg-primary">${activity.rating}%</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}

                <div class="overall-recommendations">
                    <h6>Overall Trip Advice</h6>
                    <ul class="list-unstyled">
                        ${recommendations.overallRecommendations.generalAdvice.map(advice => `
                            <li class="mb-1"><i class="fas fa-lightbulb text-warning me-2"></i>${advice}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    renderUserPreferences(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="user-preferences">
                <h6 class="mb-3">Activity Preferences</h6>
                
                <div class="mb-3">
                    <label class="form-label">Budget Level</label>
                    <select class="form-select" id="budgetLevel">
                        <option value="budget" ${this.userPreferences.budgetLevel === 'budget' ? 'selected' : ''}>Budget Travel</option>
                        <option value="moderate" ${this.userPreferences.budgetLevel === 'moderate' ? 'selected' : ''}>Moderate</option>
                        <option value="luxury" ${this.userPreferences.budgetLevel === 'luxury' ? 'selected' : ''}>Luxury</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label">Crowd Tolerance</label>
                    <select class="form-select" id="crowdTolerance">
                        <option value="low" ${this.userPreferences.crowdTolerance === 'low' ? 'selected' : ''}>Avoid Crowds</option>
                        <option value="moderate" ${this.userPreferences.crowdTolerance === 'moderate' ? 'selected' : ''}>Some Crowds OK</option>
                        <option value="high" ${this.userPreferences.crowdTolerance === 'high' ? 'selected' : ''}>Don't Mind Crowds</option>
                    </select>
                </div>

                <button class="btn btn-primary btn-sm" onclick="seasonalRecommendations.saveSettings()">
                    Save Preferences
                </button>
            </div>
        `;
    }

    saveSettings() {
        const budgetLevel = document.getElementById('budgetLevel').value;
        const crowdTolerance = document.getElementById('crowdTolerance').value;
        
        this.saveUserPreferences({ budgetLevel, crowdTolerance });
        
        // Show success message
        const toast = document.createElement('div');
        toast.className = 'alert alert-success alert-dismissible fade show position-fixed';
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
        toast.innerHTML = `
            <span>✅ Preferences saved!</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Export for global use
window.SeasonalActivityRecommendations = SeasonalActivityRecommendations;
