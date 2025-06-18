// Regional Holiday Calendar Module
// State-specific holiday information for different Brazilian regions

class RegionalHolidayCalendar {
    constructor(holidayAPI) {
        this.holidayAPI = holidayAPI;
        this.regionalHolidays = this.initializeRegionalHolidays();
        this.selectedStates = ['RJ', 'SP']; // Default states
    }

    initializeRegionalHolidays() {
        // Regional holidays by state (major ones)
        return {
            'RJ': { // Rio de Janeiro
                name: 'Rio de Janeiro',
                holidays: [
                    { date: '2025-04-23', name: 'São Jorge Day', type: 'regional' },
                    { date: '2025-02-12', name: 'Carnival Tuesday', type: 'cultural' },
                    { date: '2025-02-13', name: 'Ash Wednesday', type: 'cultural' }
                ]
            },
            'SP': { // São Paulo
                name: 'São Paulo',
                holidays: [
                    { date: '2025-01-25', name: 'São Paulo City Anniversary', type: 'regional' },
                    { date: '2025-07-09', name: 'Constitutionalist Revolution', type: 'regional' }
                ]
            },
            'BA': { // Bahia
                name: 'Bahia',
                holidays: [
                    { date: '2025-07-02', name: 'Independence of Bahia', type: 'regional' },
                    { date: '2025-02-10', name: 'Carnival Monday', type: 'cultural' },
                    { date: '2025-02-11', name: 'Carnival Tuesday', type: 'cultural' }
                ]
            },
            'MG': { // Minas Gerais
                name: 'Minas Gerais',
                holidays: [
                    { date: '2025-04-21', name: 'Tiradentes Day', type: 'regional' }
                ]
            },
            'RS': { // Rio Grande do Sul
                name: 'Rio Grande do Sul',
                holidays: [
                    { date: '2025-09-20', name: 'Gaucho Day', type: 'regional' }
                ]
            },
            'SC': { // Santa Catarina
                name: 'Santa Catarina',
                holidays: [
                    { date: '2025-08-11', name: 'Santa Catarina Day', type: 'regional' }
                ]
            },
            'PR': { // Paraná
                name: 'Paraná',
                holidays: [
                    { date: '2025-12-19', name: 'Paraná Emancipation', type: 'regional' }
                ]
            },
            'PE': { // Pernambuco
                name: 'Pernambuco',
                holidays: [
                    { date: '2025-03-06', name: 'Pernambuco Revolution', type: 'regional' },
                    { date: '2025-02-28', name: 'Frevo Day', type: 'cultural' }
                ]
            },
            'CE': { // Ceará
                name: 'Ceará',
                holidays: [
                    { date: '2025-03-25', name: 'Ceará Day', type: 'regional' }
                ]
            },
            'AM': { // Amazonas
                name: 'Amazonas',
                holidays: [
                    { date: '2025-09-05', name: 'Amazonas Day', type: 'regional' },
                    { date: '2025-10-17', name: 'Amazon Day', type: 'regional' }
                ]
            }
        };
    }

    async getAllHolidays(states = null, year = null) {
        const targetStates = states || this.selectedStates;
        const targetYear = year || new Date().getFullYear();
        
        try {
            // Get national holidays
            const nationalHolidays = await this.holidayAPI.fetchHolidays();
            
            // Get regional holidays for selected states
            const regionalHolidays = this.getRegionalHolidays(targetStates, targetYear);
            
            // Combine and sort all holidays
            const allHolidays = [...nationalHolidays, ...regionalHolidays]
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            
            return {
                national: nationalHolidays,
                regional: regionalHolidays,
                combined: allHolidays,
                states: targetStates.map(code => ({
                    code,
                    name: this.regionalHolidays[code]?.name || code
                }))
            };
            
        } catch (error) {
            console.error('Error fetching holidays:', error);
            return this.getFallbackHolidays(targetStates);
        }
    }

    getRegionalHolidays(states, year) {
        const holidays = [];
        
        states.forEach(stateCode => {
            const stateData = this.regionalHolidays[stateCode];
            if (stateData) {
                stateData.holidays.forEach(holiday => {
                    const holidayYear = new Date(holiday.date).getFullYear();
                    if (holidayYear === year) {
                        holidays.push({
                            ...holiday,
                            state: stateCode,
                            stateName: stateData.name,
                            scope: 'regional'
                        });
                    }
                });
            }
        });
        
        return holidays;
    }

    getFallbackHolidays(states) {
        const fallbackNational = [
            { date: '2025-01-01', name: 'New Year\'s Day', type: 'national' },
            { date: '2025-04-21', name: 'Tiradentes', type: 'national' },
            { date: '2025-05-01', name: 'Labour Day', type: 'national' },
            { date: '2025-09-07', name: 'Independence Day', type: 'national' },
            { date: '2025-10-12', name: 'Our Lady of Aparecida', type: 'national' },
            { date: '2025-11-02', name: 'All Souls\' Day', type: 'national' },
            { date: '2025-11-15', name: 'Proclamation of the Republic', type: 'national' },
            { date: '2025-12-25', name: 'Christmas Day', type: 'national' }
        ];

        return {
            national: fallbackNational,
            regional: this.getRegionalHolidays(states, 2025),
            combined: [...fallbackNational, ...this.getRegionalHolidays(states, 2025)],
            states: states.map(code => ({ code, name: this.regionalHolidays[code]?.name || code }))
        };
    }

    filterHolidaysByDateRange(holidays, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return holidays.filter(holiday => {
            const holidayDate = new Date(holiday.date);
            return holidayDate >= start && holidayDate <= end;
        });
    }

    getHolidayImpactAnalysis(holidays, tripDates) {
        const conflictingHolidays = this.filterHolidaysByDateRange(holidays.combined, tripDates.start, tripDates.end);
        
        const analysis = {
            hasConflicts: conflictingHolidays.length > 0,
            conflictingHolidays,
            impactLevel: this.calculateImpactLevel(conflictingHolidays),
            recommendations: this.generateHolidayRecommendations(conflictingHolidays),
            pricing: this.getPricingImpact(conflictingHolidays),
            availability: this.getAvailabilityImpact(conflictingHolidays)
        };

        return analysis;
    }

    calculateImpactLevel(holidays) {
        if (holidays.length === 0) return 'none';
        
        const hasNational = holidays.some(h => h.type === 'national' || h.scope === 'national');
        const hasCultural = holidays.some(h => h.type === 'cultural');
        const hasMultiple = holidays.length > 2;
        
        if (hasNational && hasMultiple) return 'high';
        if (hasNational || hasCultural) return 'medium';
        return 'low';
    }

    generateHolidayRecommendations(holidays) {
        const recommendations = [];
        
        if (holidays.length === 0) {
            recommendations.push('No major holidays during your trip - normal services expected');
            return recommendations;
        }

        const hasNational = holidays.some(h => h.type === 'national');
        const hasCarnival = holidays.some(h => h.name.includes('Carnival'));
        
        if (hasNational) {
            recommendations.push('Book accommodations early - national holidays increase demand');
            recommendations.push('Many museums and attractions may have modified hours');
            recommendations.push('Public transportation may run on reduced schedules');
        }
        
        if (hasCarnival) {
            recommendations.push('Carnival season - expect street closures and festivities');
            recommendations.push('Book everything well in advance - peak tourist season');
            recommendations.push('Join the celebrations but be prepared for crowds');
        }
        
        recommendations.push('Check specific venue hours closer to your travel date');
        
        return recommendations;
    }

    getPricingImpact(holidays) {
        if (holidays.length === 0) return { level: 'normal', description: 'Standard pricing expected' };
        
        const hasNational = holidays.some(h => h.type === 'national');
        const hasCultural = holidays.some(h => h.type === 'cultural');
        
        if (hasNational && hasCultural) {
            return { level: 'very high', description: 'Peak holiday pricing - expect 150-200% increases' };
        } else if (hasNational) {
            return { level: 'high', description: 'Holiday pricing - expect 50-100% increases' };
        } else if (hasCultural) {
            return { level: 'medium', description: 'Cultural event pricing - expect 25-50% increases' };
        }
        
        return { level: 'low', description: 'Minor price increases possible' };
    }

    getAvailabilityImpact(holidays) {
        if (holidays.length === 0) return { level: 'normal', description: 'Normal availability expected' };
        
        const hasNational = holidays.some(h => h.type === 'national');
        const hasMultiple = holidays.length > 2;
        
        if (hasNational && hasMultiple) {
            return { level: 'very limited', description: 'Very limited availability - book immediately' };
        } else if (hasNational) {
            return { level: 'limited', description: 'Limited availability - book soon' };
        }
        
        return { level: 'moderate', description: 'Some availability constraints' };
    }

    renderCalendar(containerId, holidays, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { showFilters = true, showAnalysis = true, selectedStates = this.selectedStates } = options;

        container.innerHTML = `
            <div class="regional-holiday-calendar">
                ${showFilters ? this.renderStateSelector(selectedStates) : ''}
                
                <div class="calendar-container">
                    <div class="calendar-header mb-3">
                        <h6><i class="fas fa-calendar-alt me-2"></i>Holiday Calendar</h6>
                        <div class="legend">
                            <span class="badge bg-primary me-2">National</span>
                            <span class="badge bg-success me-2">Regional</span>
                            <span class="badge bg-warning text-dark">Cultural</span>
                        </div>
                    </div>
                    
                    <div class="holidays-by-type">
                        ${this.renderHolidaysByType(holidays)}
                    </div>
                </div>
                
                ${showAnalysis ? this.renderHolidayStats(holidays) : ''}
            </div>
        `;
    }

    renderStateSelector(selectedStates) {
        const states = Object.entries(this.regionalHolidays);
        
        return `
            <div class="state-selector mb-3">
                <label class="form-label">Select States/Regions:</label>
                <div class="row g-2">
                    ${states.map(([code, data]) => `
                        <div class="col-md-3 col-6">
                            <div class="form-check">
                                <input class="form-check-input state-checkbox" type="checkbox" 
                                       id="state-${code}" value="${code}" 
                                       ${selectedStates.includes(code) ? 'checked' : ''}>
                                <label class="form-check-label" for="state-${code}">
                                    ${data.name}
                                </label>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary btn-sm mt-2" onclick="regionalHolidayCalendar.updateSelectedStates()">
                    Update Calendar
                </button>
            </div>
        `;
    }

    renderHolidaysByType(holidays) {
        const nationalHolidays = holidays.national || [];
        const regionalHolidays = holidays.regional || [];
        
        return `
            <div class="row">
                <div class="col-md-6">
                    <h6 class="text-primary">National Holidays</h6>
                    <div class="holiday-list">
                        ${nationalHolidays.map(holiday => `
                            <div class="holiday-item d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                                <div>
                                    <strong>${holiday.name}</strong>
                                    <br><small class="text-muted">${new Date(holiday.date).toLocaleDateString()}</small>
                                </div>
                                <span class="badge bg-primary">National</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="col-md-6">
                    <h6 class="text-success">Regional Holidays</h6>
                    <div class="holiday-list">
                        ${regionalHolidays.map(holiday => `
                            <div class="holiday-item d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                                <div>
                                    <strong>${holiday.name}</strong>
                                    <br><small class="text-muted">${new Date(holiday.date).toLocaleDateString()} - ${holiday.stateName}</small>
                                </div>
                                <span class="badge ${holiday.type === 'cultural' ? 'bg-warning text-dark' : 'bg-success'}">
                                    ${holiday.type === 'cultural' ? 'Cultural' : 'Regional'}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderHolidayStats(holidays) {
        const total = holidays.combined ? holidays.combined.length : 0;
        const national = holidays.national ? holidays.national.length : 0;
        const regional = holidays.regional ? holidays.regional.length : 0;
        
        return `
            <div class="holiday-stats mt-4">
                <h6>Holiday Statistics</h6>
                <div class="row g-3">
                    <div class="col-md-4">
                        <div class="stat-card text-center p-3 bg-light rounded">
                            <h4 class="text-primary">${total}</h4>
                            <small>Total Holidays</small>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-card text-center p-3 bg-light rounded">
                            <h4 class="text-success">${national}</h4>
                            <small>National</small>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-card text-center p-3 bg-light rounded">
                            <h4 class="text-info">${regional}</h4>
                            <small>Regional</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderTripImpactAnalysis(containerId, analysis) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const impactColors = {
            'none': 'success',
            'low': 'info', 
            'medium': 'warning',
            'high': 'danger',
            'very high': 'danger'
        };

        container.innerHTML = `
            <div class="trip-impact-analysis">
                <div class="impact-header mb-3">
                    <h6><i class="fas fa-exclamation-triangle me-2"></i>Holiday Impact Analysis</h6>
                    <span class="badge bg-${impactColors[analysis.impactLevel]} fs-6">
                        ${analysis.impactLevel.toUpperCase()} Impact
                    </span>
                </div>

                ${analysis.hasConflicts ? `
                    <div class="conflicting-holidays mb-3">
                        <strong>Holidays during your trip:</strong>
                        <ul class="mt-2 mb-0">
                            ${analysis.conflictingHolidays.map(holiday => `
                                <li>${holiday.name} - ${new Date(holiday.date).toLocaleDateString()}</li>
                            `).join('')}
                        </ul>
                    </div>
                ` : `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle me-2"></i>
                        No major holidays during your trip dates!
                    </div>
                `}

                <div class="impact-details">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="impact-card p-3 border rounded">
                                <h6>💰 Pricing Impact</h6>
                                <span class="badge bg-${impactColors[analysis.pricing.level]}">${analysis.pricing.level}</span>
                                <p class="small mt-2 mb-0">${analysis.pricing.description}</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="impact-card p-3 border rounded">
                                <h6>🏨 Availability Impact</h6>
                                <span class="badge bg-${impactColors[analysis.availability.level]}">${analysis.availability.level}</span>
                                <p class="small mt-2 mb-0">${analysis.availability.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="recommendations mt-3">
                    <h6>📋 Recommendations</h6>
                    <ul class="list-unstyled">
                        ${analysis.recommendations.map(rec => `
                            <li class="mb-1"><i class="fas fa-lightbulb text-warning me-2"></i>${rec}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    updateSelectedStates() {
        const checkboxes = document.querySelectorAll('.state-checkbox:checked');
        this.selectedStates = Array.from(checkboxes).map(cb => cb.value);
        
        // Reload calendar with new states
        this.getAllHolidays(this.selectedStates).then(holidays => {
            this.renderCalendar('regionalHolidayCalendar', holidays);
        });
    }
}

// Export for global use
window.RegionalHolidayCalendar = RegionalHolidayCalendar;
