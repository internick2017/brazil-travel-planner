// Climate Zone Information Module
// Educational content about Brazilian climate zones

class ClimateZoneInfo {
    constructor() {
        this.climateZones = this.initializeClimateData();
    }

    initializeClimateData() {
        return {
            'equatorial': {
                name: 'Equatorial',
                regions: ['Amazon Basin', 'Northern Brazil'],
                states: ['AM', 'AC', 'RR', 'AP', 'PA (north)', 'RO (north)'],
                characteristics: {
                    temperature: '26-28°C year-round',
                    rainfall: '2000-3000mm annually',
                    humidity: '80-90%',
                    seasons: 'Wet (Dec-May) and Dry (Jun-Nov)'
                },
                description: 'Hot and humid climate with high rainfall throughout the year. The Amazon rainforest creates its own weather patterns.',
                bestTime: 'June to November (dry season)',
                activities: ['River tours', 'Wildlife watching', 'Jungle trekking', 'Indigenous culture'],
                cities: ['Manaus', 'Belém', 'Boa Vista', 'Macapá'],
                icon: '🌴',
                color: '#228B22'
            },
            'tropical': {
                name: 'Tropical',
                regions: ['Central Brazil', 'Parts of Northeast'],
                states: ['MT', 'GO', 'TO', 'MS', 'DF', 'BA (west)', 'MG (north)'],
                characteristics: {
                    temperature: '20-28°C',
                    rainfall: '1200-2000mm annually',
                    humidity: '60-80%',
                    seasons: 'Wet (Oct-Mar) and Dry (Apr-Sep)'
                },
                description: 'Distinct wet and dry seasons. Savanna landscapes (Cerrado) dominate this climate zone.',
                bestTime: 'April to September (dry season)',
                activities: ['Pantanal tours', 'Cerrado exploration', 'Ecotourism', 'Hiking'],
                cities: ['Brasília', 'Cuiabá', 'Goiânia', 'Campo Grande'],
                icon: '🌾',
                color: '#DAA520'
            },
            'semi_arid': {
                name: 'Semi-Arid',
                regions: ['Northeast Interior'],
                states: ['CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA (interior)', 'PI'],
                characteristics: {
                    temperature: '24-30°C',
                    rainfall: '300-800mm annually',
                    humidity: '50-70%',
                    seasons: 'Very irregular rainfall'
                },
                description: 'Hot and dry climate with irregular rainfall. Caatinga vegetation adapted to drought conditions.',
                bestTime: 'June to December',
                activities: ['Cultural tours', 'Historical sites', 'Desert landscapes', 'Folk festivals'],
                cities: ['Petrolina', 'Juazeiro', 'Campina Grande', 'Caruaru'],
                icon: '🌵',
                color: '#CD853F'
            },
            'tropical_coastal': {
                name: 'Tropical Coastal',
                regions: ['Northeast Coast', 'East Coast'],
                states: ['CE (coast)', 'RN (coast)', 'PB (coast)', 'PE (coast)', 'AL (coast)', 'SE (coast)', 'BA (coast)', 'ES'],
                characteristics: {
                    temperature: '24-30°C',
                    rainfall: '1000-2000mm annually',
                    humidity: '70-85%',
                    seasons: 'Warm year-round with sea breeze'
                },
                description: 'Warm coastal climate moderated by ocean breezes. Perfect for beach activities year-round.',
                bestTime: 'Year-round (avoid heavy rain periods)',
                activities: ['Beach sports', 'Water activities', 'Coastal hiking', 'Surfing'],
                cities: ['Fortaleza', 'Natal', 'Recife', 'Maceió', 'Salvador'],
                icon: '🏖️',
                color: '#1E90FF'
            },
            'subtropical': {
                name: 'Subtropical',
                regions: ['Southeast', 'South'],
                states: ['SP', 'RJ', 'MG (south)', 'PR', 'SC', 'RS'],
                characteristics: {
                    temperature: '15-25°C',
                    rainfall: '1200-1800mm annually',
                    humidity: '60-80%',
                    seasons: 'Four distinct seasons'
                },
                description: 'Temperate climate with four distinct seasons. Mild winters and warm summers.',
                bestTime: 'March to May, September to November',
                activities: ['City sightseeing', 'Mountain hiking', 'Wine tours', 'Cultural events'],
                cities: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Florianópolis', 'Porto Alegre'],
                icon: '🏔️',
                color: '#4682B4'
            }
        };
    }

    getClimateZone(stateCode) {
        for (const [zoneKey, zone] of Object.entries(this.climateZones)) {
            if (zone.states.some(state => state.includes(stateCode))) {
                return { key: zoneKey, ...zone };
            }
        }
        return null;
    }

    renderClimateMap(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="climate-map">
                <h6 class="mb-3">Brazilian Climate Zones</h6>
                <div class="row g-2">
                    ${Object.entries(this.climateZones).map(([key, zone]) => `
                        <div class="col-md-6 col-lg-4">
                            <div class="climate-zone-card card h-100 border-0" style="border-left: 4px solid ${zone.color} !important;">
                                <div class="card-body">
                                    <h6 class="card-title">
                                        <span class="me-2">${zone.icon}</span>
                                        ${zone.name}
                                    </h6>
                                    <p class="card-text small">${zone.description}</p>
                                    <div class="climate-stats">
                                        <small class="text-muted d-block">
                                            <i class="fas fa-thermometer-half me-1"></i>
                                            ${zone.characteristics.temperature}
                                        </small>
                                        <small class="text-muted d-block">
                                            <i class="fas fa-cloud-rain me-1"></i>
                                            ${zone.characteristics.rainfall}
                                        </small>
                                        <small class="text-muted d-block">
                                            <i class="fas fa-calendar-alt me-1"></i>
                                            Best: ${zone.bestTime}
                                        </small>
                                    </div>
                                    <button class="btn btn-outline-primary btn-sm mt-2 w-100" 
                                            onclick="showClimateDetails('${key}')">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderClimateDetails(containerId, zoneKey) {
        const container = document.getElementById(containerId);
        const zone = this.climateZones[zoneKey];
        if (!container || !zone) return;

        container.innerHTML = `
            <div class="climate-details">
                <div class="alert alert-info">
                    <h5 class="alert-heading">
                        <span class="me-2">${zone.icon}</span>
                        ${zone.name} Climate Zone
                    </h5>
                    <p class="mb-0">${zone.description}</p>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <h6>Climate Characteristics</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-thermometer-half text-danger me-2"></i><strong>Temperature:</strong> ${zone.characteristics.temperature}</li>
                            <li><i class="fas fa-cloud-rain text-primary me-2"></i><strong>Rainfall:</strong> ${zone.characteristics.rainfall}</li>
                            <li><i class="fas fa-tint text-info me-2"></i><strong>Humidity:</strong> ${zone.characteristics.humidity}</li>
                            <li><i class="fas fa-calendar text-success me-2"></i><strong>Seasons:</strong> ${zone.characteristics.seasons}</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h6>Travel Information</h6>
                        <p><strong>Best Time to Visit:</strong> ${zone.bestTime}</p>
                        <p><strong>Recommended Activities:</strong></p>
                        <div class="activity-tags">
                            ${zone.activities.map(activity => `
                                <span class="badge bg-secondary me-1 mb-1">${activity}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="mt-3">
                    <h6>Major Cities in This Zone</h6>
                    <div class="city-list">
                        ${zone.cities.map(city => `
                            <span class="badge bg-light text-dark me-2 mb-1">
                                <i class="fas fa-map-marker-alt me-1"></i>${city}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <div class="mt-3">
                    <button class="btn btn-secondary" onclick="hideClimateDetails()">
                        <i class="fas fa-arrow-left me-2"></i>Back to Map
                    </button>
                </div>
            </div>
        `;
    }

    getZoneForCity(cityName) {
        for (const [zoneKey, zone] of Object.entries(this.climateZones)) {
            if (zone.cities.includes(cityName)) {
                return { key: zoneKey, ...zone };
            }
        }
        return null;
    }

    getSeasonalRecommendations(zoneKey, month) {
        const zone = this.climateZones[zoneKey];
        if (!zone) return null;

        const recommendations = {
            'equatorial': {
                'dry': ['Perfect for river tours', 'Best wildlife viewing', 'Easier jungle access'],
                'wet': ['Lush vegetation', 'River levels high', 'Indoor activities recommended']
            },
            'tropical': {
                'dry': ['Ideal hiking weather', 'Clear skies', 'Perfect for Pantanal tours'],
                'wet': ['Green landscapes', 'Waterfalls at peak', 'Some roads may be difficult']
            },
            'semi_arid': {
                'year_round': ['Hot and dry climate', 'Consistent weather', 'Pack sun protection']
            },
            'tropical_coastal': {
                'year_round': ['Perfect beach weather', 'Warm ocean temperatures', 'Sea breeze cooling']
            },
            'subtropical': {
                'summer': ['Warm but comfortable', 'Great for outdoor activities', 'Peak tourist season'],
                'winter': ['Mild and pleasant', 'Perfect sightseeing weather', 'Lower prices'],
                'spring_autumn': ['Ideal weather conditions', 'Best time to visit', 'Comfortable temperatures']
            }
        };

        return recommendations[zoneKey] || null;
    }
}

// Export for global use
window.ClimateZoneInfo = ClimateZoneInfo;
