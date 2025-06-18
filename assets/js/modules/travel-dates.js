// Best Travel Dates Calculator
// AI-like algorithm to recommend optimal travel dates

class TravelDatesCalculator {
    constructor(weatherAPI) {
        this.weatherAPI = weatherAPI;
    }

    async calculateBestDates(preferences = {}) {
        const {
            activities = [],
            budget = 'moderate',
            avoidCrowds = false,
            preferredWeather = 'mild',
            duration = 7
        } = preferences;

        try {
            // Get holiday data
            const holidays = await HolidayAPI.fetchHolidays();
            
            // Analyze weather patterns (simplified)
            const weatherPatterns = this.getWeatherPatterns();
            
            // Calculate scores for each month
            const monthScores = this.calculateMonthScores(
                weatherPatterns,
                holidays,
                activities,
                budget,
                avoidCrowds,
                preferredWeather
            );

            // Generate recommendations
            const recommendations = this.generateRecommendations(monthScores, duration);
            
            return {
                recommendations,
                analysis: this.generateAnalysis(monthScores, holidays),
                weatherPatterns
            };

        } catch (error) {
            console.error('Error calculating best dates:', error);
            return this.getFallbackRecommendations();
        }
    }

    getWeatherPatterns() {
        // Simplified weather patterns for Brazilian cities
        return {
            'Rio de Janeiro': {
                'Jan': { temp: 30, rain: 80, crowd: 90 },
                'Feb': { temp: 30, rain: 85, crowd: 85 },
                'Mar': { temp: 29, rain: 70, crowd: 70 },
                'Apr': { temp: 27, rain: 50, crowd: 60 },
                'May': { temp: 25, rain: 30, crowd: 50 },
                'Jun': { temp: 23, rain: 20, crowd: 45 },
                'Jul': { temp: 23, rain: 15, crowd: 60 },
                'Aug': { temp: 24, rain: 20, crowd: 65 },
                'Sep': { temp: 25, rain: 30, crowd: 55 },
                'Oct': { temp: 26, rain: 40, crowd: 60 },
                'Nov': { temp: 28, rain: 60, crowd: 70 },
                'Dec': { temp: 29, rain: 75, crowd: 85 }
            },
            'São Paulo': {
                'Jan': { temp: 27, rain: 85, crowd: 70 },
                'Feb': { temp: 28, rain: 80, crowd: 65 },
                'Mar': { temp: 26, rain: 70, crowd: 60 },
                'Apr': { temp: 24, rain: 45, crowd: 55 },
                'May': { temp: 21, rain: 30, crowd: 50 },
                'Jun': { temp: 19, rain: 25, crowd: 45 },
                'Jul': { temp: 19, rain: 20, crowd: 50 },
                'Aug': { temp: 21, rain: 25, crowd: 55 },
                'Sep': { temp: 23, rain: 35, crowd: 60 },
                'Oct': { temp: 24, rain: 50, crowd: 65 },
                'Nov': { temp: 25, rain: 65, crowd: 70 },
                'Dec': { temp: 26, rain: 75, crowd: 75 }
            }
        };
    }

    calculateMonthScores(weatherPatterns, holidays, activities, budget, avoidCrowds, preferredWeather) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const scores = {};

        months.forEach((month, index) => {
            let score = 0;
            
            // Weather score based on preference
            const tempScore = this.getTemperatureScore(weatherPatterns['Rio de Janeiro'][month].temp, preferredWeather);
            const rainScore = this.getRainScore(weatherPatterns['Rio de Janeiro'][month].rain);
            score += (tempScore + rainScore) * 0.4;

            // Crowd score
            if (avoidCrowds) {
                score += (100 - weatherPatterns['Rio de Janeiro'][month].crowd) * 0.3;
            } else {
                score += weatherPatterns['Rio de Janeiro'][month].crowd * 0.1;
            }

            // Holiday impact
            const monthHolidays = holidays.filter(h => new Date(h.date).getMonth() === index);
            if (budget === 'budget' && monthHolidays.length > 0) {
                score -= 20; // Holidays increase costs
            } else if (monthHolidays.length > 0) {
                score += 10; // Festivals can be attractive
            }

            // Activity-specific bonuses
            if (activities.includes('Beach') && ['Dec', 'Jan', 'Feb', 'Mar'].includes(month)) {
                score += 15;
            }
            if (activities.includes('Adventure') && ['May', 'Jun', 'Jul', 'Aug', 'Sep'].includes(month)) {
                score += 15;
            }

            scores[month] = Math.max(0, Math.min(100, score));
        });

        return scores;
    }

    getTemperatureScore(temp, preference) {
        switch (preference) {
            case 'hot': return temp > 28 ? 100 : Math.max(0, (temp - 20) * 10);
            case 'cool': return temp < 22 ? 100 : Math.max(0, (30 - temp) * 10);
            case 'mild': 
            default: 
                const ideal = 25;
                return Math.max(0, 100 - Math.abs(temp - ideal) * 10);
        }
    }

    getRainScore(rainChance) {
        return Math.max(0, 100 - rainChance);
    }

    generateRecommendations(monthScores, duration) {
        const sortedMonths = Object.entries(monthScores)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);

        return sortedMonths.map(([month, score], index) => ({
            rank: index + 1,
            month,
            score: Math.round(score),
            period: this.getMonthPeriod(month),
            reasons: this.getRecommendationReasons(month, score),
            suggestedDates: this.generateSuggestedDates(month, duration)
        }));
    }

    getMonthPeriod(month) {
        const periods = {
            'Jan': 'January - Summer Peak',
            'Feb': 'February - Carnival Season',
            'Mar': 'March - Late Summer',
            'Apr': 'April - Autumn Start',
            'May': 'May - Dry Season',
            'Jun': 'June - Winter Mild',
            'Jul': 'July - Winter Peak',
            'Aug': 'August - Late Winter',
            'Sep': 'September - Spring Start',
            'Oct': 'October - Spring',
            'Nov': 'November - Pre-Summer',
            'Dec': 'December - Summer Start'
        };
        return periods[month];
    }

    getRecommendationReasons(month, score) {
        const reasons = [];
        
        if (score > 80) reasons.push('Excellent weather conditions');
        if (score > 70) reasons.push('Good balance of weather and activities');
        if (['May', 'Jun', 'Jul', 'Aug', 'Sep'].includes(month)) {
            reasons.push('Dry season with less rain');
        }
        if (['Apr', 'May', 'Jun'].includes(month)) {
            reasons.push('Fewer crowds, better prices');
        }
        if (['Dec', 'Jan', 'Feb'].includes(month)) {
            reasons.push('Beach season, warm weather');
        }

        return reasons.length > 0 ? reasons : ['Good general travel conditions'];
    }

    generateSuggestedDates(month, duration) {
        const year = new Date().getFullYear();
        const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
        
        // Suggest 2-3 date ranges within the month
        const suggestions = [];
        
        // Early month
        const start1 = new Date(year, monthIndex, 5);
        const end1 = new Date(start1.getTime() + duration * 24 * 60 * 60 * 1000);
        suggestions.push({
            label: 'Early month',
            start: start1.toLocaleDateString(),
            end: end1.toLocaleDateString()
        });

        // Mid month
        const start2 = new Date(year, monthIndex, 15);
        const end2 = new Date(start2.getTime() + duration * 24 * 60 * 60 * 1000);
        suggestions.push({
            label: 'Mid month',
            start: start2.toLocaleDateString(),
            end: end2.toLocaleDateString()
        });

        return suggestions;
    }

    generateAnalysis(monthScores, holidays) {
        const avgScore = Object.values(monthScores).reduce((a, b) => a + b, 0) / 12;
        const bestMonth = Object.entries(monthScores).reduce((a, b) => a[1] > b[1] ? a : b);
        const worstMonth = Object.entries(monthScores).reduce((a, b) => a[1] < b[1] ? a : b);

        return {
            averageScore: Math.round(avgScore),
            bestMonth: bestMonth[0],
            worstMonth: worstMonth[0],
            totalHolidays: holidays.length,
            analysis: `Based on your preferences, ${bestMonth[0]} offers the best conditions with a score of ${Math.round(bestMonth[1])}/100. Avoid ${worstMonth[0]} if possible (${Math.round(worstMonth[1])}/100).`
        };
    }

    getFallbackRecommendations() {
        return {
            recommendations: [
                {
                    rank: 1,
                    month: 'May',
                    score: 85,
                    period: 'May - Dry Season',
                    reasons: ['Excellent weather', 'Fewer crowds', 'Lower prices'],
                    suggestedDates: [
                        { label: 'Early May', start: '5/5/2025', end: '5/12/2025' },
                        { label: 'Mid May', start: '5/15/2025', end: '5/22/2025' }
                    ]
                }
            ],
            analysis: {
                averageScore: 65,
                bestMonth: 'May',
                worstMonth: 'Feb',
                totalHolidays: 12,
                analysis: 'May offers the best balance of weather and value for money.'
            }
        };
    }

    renderCalculation(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="travel-dates-calculator">
                <div class="alert alert-info mb-3">
                    <h6><i class="fas fa-lightbulb me-2"></i>Analysis Summary</h6>
                    <p class="mb-0">${data.analysis.analysis}</p>
                </div>

                <div class="recommendations">
                    <h6 class="mb-3">Top Recommended Periods</h6>
                    ${data.recommendations.map(rec => `
                        <div class="card mb-3 ${rec.rank === 1 ? 'border-success' : ''}">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h6 class="mb-0">
                                        <span class="badge bg-primary me-2">#${rec.rank}</span>
                                        ${rec.period}
                                    </h6>
                                    <span class="badge bg-success">${rec.score}/100</span>
                                </div>
                                
                                <div class="reasons mb-2">
                                    ${rec.reasons.map(reason => `
                                        <span class="badge bg-light text-dark me-1">${reason}</span>
                                    `).join('')}
                                </div>

                                <div class="suggested-dates">
                                    <small class="text-muted d-block mb-1">Suggested dates:</small>
                                    ${rec.suggestedDates.map(date => `
                                        <small class="text-info me-3">
                                            <i class="fas fa-calendar me-1"></i>
                                            ${date.label}: ${date.start} - ${date.end}
                                        </small>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Export for global use
window.TravelDatesCalculator = TravelDatesCalculator;
