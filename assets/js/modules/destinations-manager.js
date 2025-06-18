// Destinations Manager - Handles UI interactions and destination display
// Manages the destinations page functionality, search, filtering, and map integration

class DestinationsManager {    constructor(mapInstance, weatherAPI) {
        this.map = mapInstance;
        this.weatherAPI = weatherAPI;
        this.destinationsAPI = new DestinationsAPI();
        this.statesAPI = new StatesAPI();
        this.destinations = [];
        this.markersWithWeather = [];
        this.currentFilter = 'major'; // 'major', 'all', 'capitals', 'search', 'region'
        
        this.initializeEventListeners();
        // console.log('🗺️ Destinations Manager initialized');
    }    /**
     * Initialize the destinations display
     */
    async initialize() {
        try {
            // console.log('🚀 Initializing destinations display...');
            this.showLoadingState();
            
            // Check weather API status
            if (this.weatherAPI && this.weatherAPI.apiKey) {
                if (this.weatherAPI.apiKey === 'YOUR_VISUAL_CROSSING_API_KEY_HERE') {
                    console.warn('⚠️ Weather API key not configured, will use basic markers');
                    this.weatherAPI = null;
                } else {
                    // console.log('✅ Weather API available, will fetch real-time weather');
                }
            } else {
                // console.log('📍 No weather API available, will use basic markers');
            }
            
            // Load major destinations by default
            await this.loadMajorDestinations();
            
            // Create map markers and populate cards
            await this.updateDisplay();
            
        } catch (error) {
            console.error('❌ Error initializing destinations:', error);
            this.showErrorState(error.message);
        }
    }

    /**
     * Load major destinations from API
     */
    async loadMajorDestinations() {
        try {
            this.destinations = await this.destinationsAPI.getMajorDestinations();
            this.currentFilter = 'major';
            // console.log(`✅ Loaded ${this.destinations.length} major destinations`);
        } catch (error) {
            console.error('Error loading major destinations:', error);
            throw error;
        }
    }

    /**
     * Load all available destinations
     */
    async loadAllDestinations() {
        try {
            this.showLoadingState();
            this.destinations = await this.destinationsAPI.getAllDestinations(50);
            this.currentFilter = 'all';
            await this.updateDisplay();
            // console.log(`✅ Loaded ${this.destinations.length} destinations`);
        } catch (error) {
            console.error('Error loading all destinations:', error);
            this.showErrorState('Failed to load destinations');
        }
    }

    /**
     * Filter to show only state capitals
     */
    async showOnlyCapitals() {
        try {
            this.showLoadingState();
            
            const capitals = [
                'Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador', 'Fortaleza',
                'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Goiânia',
                'Belém', 'Porto Alegre', 'Natal', 'Florianópolis', 'Teresina',
                'Campo Grande', 'João Pessoa', 'Aracaju', 'Maceió', 'São Luís',
                'Cuiabá', 'Vitória', 'Macapá', 'Boa Vista', 'Rio Branco', 'Porto Velho', 'Palmas'
            ];

            // If we don't have enough destinations loaded, fetch more
            if (this.destinations.length < 20) {
                const allDestinations = await this.destinationsAPI.getAllDestinations(100);
                this.destinations = allDestinations;
            }

            this.destinations = this.destinations.filter(dest =>
                capitals.some(cap => 
                    dest.name.toLowerCase().includes(cap.toLowerCase()) ||
                    cap.toLowerCase().includes(dest.name.toLowerCase())
                )
            );

            this.currentFilter = 'capitals';
            await this.updateDisplay();
            // console.log(`✅ Filtered to ${this.destinations.length} capital cities`);
            
        } catch (error) {
            console.error('Error filtering capitals:', error);
            this.showErrorState('Failed to filter capitals');
        }
    }

    /**
     * Search destinations by term
     */
    async searchDestinations(searchTerm) {
        try {
            if (!searchTerm.trim()) {
                await this.loadMajorDestinations();
                await this.updateDisplay();
                return;
            }

            this.showLoadingState();
            this.destinations = await this.destinationsAPI.searchDestinations(searchTerm, 30);
            this.currentFilter = 'search';
            await this.updateDisplay();
            // console.log(`🔍 Found ${this.destinations.length} destinations for "${searchTerm}"`);
            
        } catch (error) {
            console.error('Error searching destinations:', error);
            this.showErrorState('Search failed');
        }
    }    /**
     * Get destinations by state
     */
    async getDestinationsByState(stateCode) {
        try {
            this.showLoadingState();
            this.destinations = await this.destinationsAPI.getDestinationsByState(stateCode);
            this.currentFilter = 'state';
            await this.updateDisplay();
            // console.log(`✅ Loaded ${this.destinations.length} destinations for ${stateCode}`);
            
        } catch (error) {
            console.error(`Error loading destinations for ${stateCode}:`, error);
            this.showErrorState(`Failed to load destinations for ${stateCode}`);
        }
    }

    /**
     * Filter destinations by Brazilian region
     */
    async filterByRegion(regionName) {
        try {
            this.showLoadingState();
            
            // Get states in the region
            const statesByRegion = await this.statesAPI.getStatesByRegion();
            const statesInRegion = statesByRegion[regionName] || [];
            
            if (statesInRegion.length === 0) {
                throw new Error(`No states found for region ${regionName}`);
            }
            
            // If we don't have enough destinations loaded, fetch more
            if (this.destinations.length < 30) {
                const allDestinations = await this.destinationsAPI.getAllDestinations(100);
                this.destinations = allDestinations;
            }
            
            // Filter destinations by states in the region
            const regionStateCodes = statesInRegion.map(state => state.sigla);
            this.destinations = this.destinations.filter(dest =>
                regionStateCodes.includes(dest.estado)
            );
            
            this.currentFilter = 'region';
            await this.updateDisplay();
            // console.log(`✅ Filtered to ${this.destinations.length} destinations in ${regionName} region`);
            
        } catch (error) {
            console.error(`Error filtering by region ${regionName}:`, error);
            this.showErrorState(`Failed to filter destinations by ${regionName} region`);
        }    }

    /**
     * Check if destination is already saved to trip
     */
    isDestinationSaved(destinationId) {
        const savedDestinations = JSON.parse(localStorage.getItem('selectedDestinations') || '[]');
        return savedDestinations.some(entry => {
            if (Array.isArray(entry)) {
                return entry[0] && entry[0].toString() === destinationId.toString();
            } else if (entry && typeof entry === 'object') {
                const entryId = (entry.id || entry.cityId || entry.name).toString();
                return entryId === destinationId.toString();
            }
            return false;
        });
    }

    /**
     * Get button HTML based on save status
     */
    getSaveButtonHtml(dest, isCard = false) {
        const isSaved = this.isDestinationSaved(dest.id || dest.cityId);
        
        if (isCard) {
            // For destination cards
            if (isSaved) {
                return `<button class="btn btn-success btn-sm" onclick="removeFromPlanner('${dest.id}')">
                            <i class="fas fa-check me-1"></i>Saved to Trip
                        </button>`;
            } else {
                return `<button class="btn btn-outline-success btn-sm" onclick="addToPlanner('${dest.id}')">
                            <i class="fas fa-heart me-1"></i>Save to Trip
                        </button>`;
            }
        } else {
            // For map popups
            if (isSaved) {
                return `<button onclick="removeFromPlanner('${dest.id}')" 
                                style="background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
                            <i class="fas fa-check"></i> Saved to Trip
                        </button>`;
            } else {
                return `<button onclick="addToPlanner('${dest.id}')" 
                                style="background: linear-gradient(135deg, #28a745, #20c997); color: white; border: none; 
                                       padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
                            <i class="fas fa-heart"></i> Save to Trip
                        </button>`;
            }
        }
    }

    /**
     * Update both map markers and destination cards
     */
    async updateDisplay() {
        await Promise.all([
            this.updateMapMarkers(),
            this.populateDestinationCards()
        ]);
    }

    /**
     * Update map markers
     */
    async updateMapMarkers() {
        try {
            // Clear existing markers
            this.clearMarkers();

            // Create new markers with weather data
            await this.createMarkersWithWeather();
            
        } catch (error) {
            console.warn('Error updating map markers:', error);
            // Fallback: create basic markers without weather
            this.destinations.forEach(dest => this.createBasicMarker(dest));
        }
    }    /**
     * Create markers with weather data
     */
    async createMarkersWithWeather() {
        // console.log('🗺️ Creating markers for destinations...');
        
        // Add delay between weather API calls to avoid rate limiting
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        
        for (let i = 0; i < this.destinations.length; i++) {
            const dest = this.destinations[i];
            
            try {
                // Add delay between API calls (500ms) to prevent rate limiting
                if (i > 0) {
                    await delay(500);
                }
                
                if (this.weatherAPI && this.weatherAPI.apiKey && this.weatherAPI.apiKey !== 'YOUR_VISUAL_CROSSING_API_KEY_HERE') {
                    // Try to fetch weather data with timeout
                    const weatherPromise = this.weatherAPI.getCurrentWeather(`${dest.name},Brazil`, 'metric');
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Weather API timeout')), 5000)
                    );
                    
                    try {
                        const weatherData = await Promise.race([weatherPromise, timeoutPromise]);
                        const currentWeather = weatherData.currentConditions;
                        const temp = Math.round(currentWeather.temp);
                        const condition = currentWeather.conditions;
                        const icon = this.getWeatherIcon(condition);

                        // Create weather marker
                        const markerElement = this.createWeatherMarkerElement(temp, icon);
                        const popup = this.createWeatherPopup(dest, temp, condition, icon);

                        const marker = new mapboxgl.Marker(markerElement)
                            .setLngLat(dest.coords)
                            .setPopup(popup)
                            .addTo(this.map);

                        this.markersWithWeather.push({ marker, dest, weather: currentWeather });
                        // console.log(`✅ Created weather marker for ${dest.name}: ${temp}°C`);
                        
                    } catch (weatherError) {
                        console.warn(`⚠️ Weather failed for ${dest.name}, using basic marker:`, weatherError.message);
                        this.createBasicMarker(dest);
                    }
                } else {
                    // console.log(`📍 Creating basic marker for ${dest.name} (no weather API)`);
                    this.createBasicMarker(dest);
                }
            } catch (error) {
                console.warn(`❌ Failed to create marker for ${dest.name}:`, error);
                this.createBasicMarker(dest);
            }
        }
        
        // console.log(`✅ Created ${this.markersWithWeather.length} markers total`);
    }

    /**
     * Create weather marker element
     */
    createWeatherMarkerElement(temp, icon) {
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker-weather';
        markerElement.innerHTML = `
            <div style="position: relative;">
                <div style="
                    background-color: ${this.getTempColor(temp)};
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    border: 2px solid white;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: bold;
                    color: white;
                ">
                    ${temp}°
                </div>
                <div style="
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    font-size: 14px;
                    filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.5));
                ">
                    ${icon}
                </div>
            </div>
        `;
        return markerElement;
    }

    /**
     * Create weather popup
     */
    createWeatherPopup(dest, temp, condition, icon) {
        const popupContent = `
            <div style="width: 300px; min-height: 220px; font-family: 'Segoe UI', sans-serif; line-height: 1.4;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <h5 style="margin: 0; color: #007BFF; font-size: 18px; font-weight: 600; flex: 1;">${dest.name}</h5>
                    <div style="text-align: right; margin-left: 10px; flex-shrink: 0;">
                        <div style="font-size: 20px; margin-bottom: 2px;">${icon} ${temp}°C</div>
                        <div style="font-size: 11px; color: #666; white-space: nowrap;">${condition}</div>
                    </div>
                </div>
                
                <p style="margin: 0 0 12px 0; font-size: 13px; color: #555; line-height: 1.4;">${dest.description}</p>
                
                <div style="margin-bottom: 10px;">
                    <span style="background: #e7f3ff; color: #0066cc; padding: 3px 8px; border-radius: 15px; font-size: 11px; font-weight: 500;">${dest.category}</span>
                    <span style="background: #f0f8ff; color: #0066cc; padding: 3px 8px; border-radius: 15px; font-size: 11px; margin-left: 5px;">${dest.estado}</span>
                </div>
                
                <div style="margin-bottom: 12px; padding: 8px; background: #f8f9fa; border-radius: 6px;">
                    <div style="margin-bottom: 4px;">
                        <strong style="font-size: 12px; color: #333;">🌤️ Current:</strong> 
                        <span style="font-size: 12px; color: #007BFF;">${temp}°C, ${condition}</span>
                    </div>
                    <div>
                        <strong style="font-size: 12px; color: #333;">📅 Best Time:</strong> 
                        <span style="font-size: 12px;">${dest.bestTime}</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong style="font-size: 12px; color: #333; display: block; margin-bottom: 6px;">✨ Highlights:</strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                        ${dest.highlights.map(h => `<span style="background: #fff3cd; color: #856404; padding: 2px 6px; border-radius: 10px; font-size: 10px;">${h}</span>`).join('')}
                    </div>
                </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <button onclick="focusOnMap(${dest.coords[0]}, ${dest.coords[1]})" 
                            style="background: linear-gradient(135deg, #007BFF, #0056b3); color: white; border: none; 
                                   padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
                        <i class="fas fa-map-marker-alt"></i> Focus Map
                    </button>
                    ${this.getSaveButtonHtml(dest, false)}
                </div>
            </div>
        `;

        return new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            className: 'custom-popup',
            maxWidth: '320px'
        }).setHTML(popupContent);
    }

    /**
     * Create basic marker without weather
     */
    createBasicMarker(dest) {
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.cssText = `
            background-color: #007BFF;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid white;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        `;

        const popupContent = `
            <div style="width: 280px; min-height: 180px; font-family: 'Segoe UI', sans-serif;">
                <h5 style="margin: 0 0 10px 0; color: #007BFF; font-size: 18px; font-weight: 600;">${dest.name}</h5>
                <p style="margin: 0 0 12px 0; font-size: 13px; color: #555;">${dest.description}</p>
                
                <div style="margin-bottom: 10px;">
                    <span style="background: #e7f3ff; color: #0066cc; padding: 3px 8px; border-radius: 15px; font-size: 11px;">${dest.category}</span>
                    <span style="background: #f0f8ff; color: #0066cc; padding: 3px 8px; border-radius: 15px; font-size: 11px; margin-left: 5px;">${dest.estado}</span>
                </div>
                
                <div style="margin-bottom: 12px; padding: 8px; background: #f8f9fa; border-radius: 6px;">
                    <div style="margin-bottom: 4px;">
                        <strong style="font-size: 12px;">🌡️ Avg Temp:</strong> ${dest.avgTemp}
                    </div>
                    <div>
                        <strong style="font-size: 12px;">📅 Best Time:</strong> ${dest.bestTime}
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong style="font-size: 12px; color: #333;">✨ Highlights:</strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px;">
                        ${dest.highlights.map(h => `<span style="background: #fff3cd; color: #856404; padding: 2px 6px; border-radius: 10px; font-size: 10px;">${h}</span>`).join('')}
                    </div>
                </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <button onclick="focusOnMap(${dest.coords[0]}, ${dest.coords[1]})" 
                            style="background: #007BFF; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
                        <i class="fas fa-map-marker-alt"></i> Focus Map
                    </button>
                    ${this.getSaveButtonHtml(dest, false)}
                </div>
            </div>
        `;

        const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            maxWidth: '300px'
        }).setHTML(popupContent);

        const marker = new mapboxgl.Marker(markerElement)
            .setLngLat(dest.coords)
            .setPopup(popup)
            .addTo(this.map);

        this.markersWithWeather.push({ marker, dest });
    }

    /**
     * Clear all markers from map
     */
    clearMarkers() {
        this.markersWithWeather.forEach(item => {
            if (item.marker) {
                item.marker.remove();
            }
        });
        this.markersWithWeather = [];
    }

    /**
     * Populate destination cards
     */
    populateDestinationCards() {
        const container = document.getElementById('destinationsContainer');
        if (!container) return;

        // Show data source info
        const isApiData = this.destinations.some(dest => dest.source === 'brasil-api');
        const dataSourceInfo = isApiData
            ? `<div class="alert alert-success mb-4"><i class="fas fa-check-circle me-2"></i>Showing ${this.destinations.length} destinations from Brasil API (Real-time data)</div>`
            : `<div class="alert alert-info mb-4"><i class="fas fa-info-circle me-2"></i>Showing ${this.destinations.length} destinations (Static fallback data)</div>`;

        if (this.destinations.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No destinations found. Try a different search term or filter.
                    </div>
                </div>
            `;
            return;
        }

        const cardsHtml = this.destinations.map(dest => {
            const highlightsHtml = dest.highlights.map(h =>
                `<span class="badge bg-light text-dark me-1 mb-1">${h}</span>`
            ).join('');

            return `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 destination-card hover-lift">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title text-primary">${dest.name}</h5>
                                <div>
                                    <span class="badge bg-info">${dest.category}</span>
                                    <span class="badge bg-secondary ms-1">${dest.estado}</span>
                                </div>
                            </div>
                            
                            <p class="card-text text-muted small">${dest.description}</p>
                            
                            <div class="mb-3">
                                <div class="row text-center">
                                    <div class="col-6">
                                        <small class="text-muted d-block">Best Time</small>
                                        <strong class="small">${dest.bestTime}</strong>
                                    </div>
                                    <div class="col-6">
                                        <small class="text-muted d-block">Avg Temp</small>
                                        <strong class="small">${dest.avgTemp}</strong>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <small class="text-muted d-block mb-2">Top Highlights:</small>
                                <div>${highlightsHtml}</div>
                            </div>
                              <div class="d-grid gap-2">
                                <button class="btn btn-primary btn-sm" onclick="focusOnMap(${dest.coords[0]}, ${dest.coords[1]})">
                                    <i class="fas fa-map-marker-alt me-1"></i>View on Map
                                </button>
                                ${this.getSaveButtonHtml(dest, true)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = dataSourceInfo + cardsHtml;
        // console.log('✅ Destination cards populated successfully');
    }    /**
     * Show loading state
     */
    showLoadingState() {
        const container = document.getElementById('destinationsContainer');
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading destinations...</span>
                    </div>
                    <p class="mt-2 text-muted">Loading destinations from Brasil API...</p>
                </div>
            `;
        } else {
            console.warn('⚠️ destinationsContainer element not found');
        }
    }

    /**
     * Show error state
     */
    showErrorState(message) {
        const container = document.getElementById('destinationsContainer');
        if (container) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        Error loading destinations: ${message}
                        <button class="btn btn-outline-danger btn-sm ms-2" onclick="destinationsManager.initialize()">
                            <i class="fas fa-redo me-1"></i>Retry
                        </button>
                    </div>
                </div>
            `;
        } else {
            console.error('❌ Cannot show error state - destinationsContainer not found');
        }
    }    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('destinationSearch');
            const searchBtn = document.getElementById('searchBtn');

            if (searchInput && searchBtn) {
                let searchTimeout;
                
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        this.searchDestinations(e.target.value);
                    }, 500); // Debounce search
                });

                searchBtn.addEventListener('click', () => {
                    this.searchDestinations(searchInput.value);
                });

                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.searchDestinations(e.target.value);
                    }
                });
                
                // console.log('✅ Search event listeners initialized');
            } else {
                console.warn('⚠️ Search elements not found, search functionality disabled');
            }
        });    }

    /**
     * Get full state name from state code
     */
    getStateName(estado) {
        const stateNames = {
            'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
            'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
            'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
            'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
            'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
            'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
            'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
        };
        return stateNames[estado] || estado;
    }

    /**
     * Get region from state code
     */
    getRegionFromState(estado) {
        const stateRegions = {
            'AC': 'North', 'AM': 'North', 'AP': 'North', 'PA': 'North', 'RO': 'North', 'RR': 'North', 'TO': 'North',
            'AL': 'Northeast', 'BA': 'Northeast', 'CE': 'Northeast', 'MA': 'Northeast', 'PB': 'Northeast', 
            'PE': 'Northeast', 'PI': 'Northeast', 'RN': 'Northeast', 'SE': 'Northeast',
            'DF': 'Central-West', 'GO': 'Central-West', 'MT': 'Central-West', 'MS': 'Central-West',
            'ES': 'Southeast', 'MG': 'Southeast', 'RJ': 'Southeast', 'SP': 'Southeast',
            'PR': 'South', 'RS': 'South', 'SC': 'South'
        };
        return stateRegions[estado] || 'Brazil';
    }

    /**
     * Utility functions
     */
    getWeatherIcon(condition) {
        const icons = {
            'Clear': '☀️',
            'Sunny': '☀️',
            'Rain': '🌧️',
            'Cloudy': '☁️',
            'Overcast': '☁️',
            'Partially cloudy': '⛅',
            'default': '🌤️'
        };
        return icons[condition] || icons.default;
    }

    getTempColor(temp) {
        if (temp >= 30) return '#FF6B6B'; // Hot - Red
        if (temp >= 25) return '#FFD93D'; // Warm - Yellow
        if (temp >= 20) return '#6BCF7F'; // Mild - Green
        return '#74C0FC'; // Cool - Blue
    }
}

// Global functions for map interaction
window.focusOnMap = function(lng, lat) {
    if (window.destinationsManager && window.destinationsManager.map) {
        window.destinationsManager.map.flyTo({
            center: [lng, lat],
            zoom: 10,
            duration: 2000
        });
    }
};

window.addToPlanner = function(destinationId) {
    let destinationObj = null;
    if (window.destinationsManager && Array.isArray(window.destinationsManager.destinations)) {
        destinationObj = window.destinationsManager.destinations.find(dest => 
            (dest.id && dest.id.toString() === destinationId.toString()) ||
            (dest.cityId && dest.cityId.toString() === destinationId.toString()) ||
            (dest.name === destinationId)
        );
    }
    if (!destinationObj) {
        // Try to find by name as fallback
        if (window.destinationsManager && Array.isArray(window.destinationsManager.destinations)) {
            destinationObj = window.destinationsManager.destinations.find(dest => dest.name === destinationId);
        }
    }
    if (!destinationObj) {
        alert('Could not find destination details. Please try again.');
        console.error('Available destinations:', window.destinationsManager?.destinations);
        return;
    }
    
    // Ensure destination has an id field
    if (!destinationObj.id && destinationObj.cityId) {
        destinationObj.id = destinationObj.cityId;
    }
      // Ensure destination has all required properties for planner compatibility
    if (!destinationObj.state && destinationObj.estado) {
        destinationObj.state = window.destinationsManager?.getStateName 
            ? window.destinationsManager.getStateName(destinationObj.estado) 
            : destinationObj.estado;
    }
    if (!destinationObj.region && destinationObj.estado) {
        destinationObj.region = window.destinationsManager?.getRegionFromState 
            ? window.destinationsManager.getRegionFromState(destinationObj.estado) 
            : 'Brazil';
    }
    
    // Store in localStorage for persistence (as [id, object] for Map compatibility)
    let savedDestinations = JSON.parse(localStorage.getItem('selectedDestinations') || '[]');
    savedDestinations = savedDestinations.filter(entry => {
        if (Array.isArray(entry)) {
            return entry[0] && entry[1] && typeof entry[0] !== 'undefined' && entry[1] && (entry[1].id || entry[1].cityId);
        } else if (entry && typeof entry === 'object') {
            return entry.id || entry.cityId || entry.name;
        }
        return false;
    });
    if (savedDestinations.length > 0 && !Array.isArray(savedDestinations[0])) {
        savedDestinations = savedDestinations.map(obj => [(obj.id || obj.cityId || obj.name).toString(), obj]);
    }
    const destinationIdStr = (destinationObj.id || destinationObj.cityId).toString();
    const exists = savedDestinations.some(entry => {
        if (Array.isArray(entry)) {
            return entry[0] && entry[0].toString() === destinationIdStr;
        } else if (entry && typeof entry === 'object') {
            const entryId = (entry.id || entry.cityId || entry.name).toString();
            return entryId === destinationIdStr;
        }
        return false;
    });    if (!exists) {
        savedDestinations.push([destinationIdStr, destinationObj]);
        localStorage.setItem('selectedDestinations', JSON.stringify(savedDestinations));
        
        // Update the UI to show the new state
        if (window.destinationsManager) {
            window.destinationsManager.updateDisplay();
        }
        
        // Show success message with link to planner
        const message = `${destinationObj.name} saved to your trip! Go to Planner to view all destinations.`;
        if (confirm(message + '\n\nWould you like to go to the Planner now?')) {
            window.location.href = 'planner.html';
        }
    } else {
        alert(`${destinationObj.name} is already in your trip planner.`);
    }
};

// Remove destination from planner
window.removeFromPlanner = function(destinationId) {
    let savedDestinations = JSON.parse(localStorage.getItem('selectedDestinations') || '[]');
    const destinationIdStr = destinationId.toString();
    
    // Filter out the destination to remove
    savedDestinations = savedDestinations.filter(entry => {
        if (Array.isArray(entry)) {
            return entry[0] && entry[0].toString() !== destinationIdStr;
        } else if (entry && typeof entry === 'object') {
            const entryId = (entry.id || entry.cityId || entry.name).toString();
            return entryId !== destinationIdStr;
        }
        return true;
    });
    
    localStorage.setItem('selectedDestinations', JSON.stringify(savedDestinations));
    
    // Update the UI to show the new state
    if (window.destinationsManager) {
        window.destinationsManager.updateDisplay();
    }
    
    // Find destination name for confirmation
    let destinationName = 'Destination';
    if (window.destinationsManager && Array.isArray(window.destinationsManager.destinations)) {
        const dest = window.destinationsManager.destinations.find(d => 
            (d.id && d.id.toString() === destinationIdStr) ||
            (d.cityId && d.cityId.toString() === destinationIdStr)
        );
        if (dest) destinationName = dest.name;
    }
    
    alert(`${destinationName} removed from your trip planner.`);
};

// Filter functions
window.showAllDestinations = function() {
    if (window.destinationsManager) {
        window.destinationsManager.loadAllDestinations();
    }
};

window.showOnlyCapitals = function() {
    if (window.destinationsManager) {
        window.destinationsManager.showOnlyCapitals();
    }
};

window.filterByRegion = function(regionName) {
    if (window.destinationsManager) {
        window.destinationsManager.filterByRegion(regionName);
    }
};

// Export for use in other modules
window.DestinationsManager = DestinationsManager;
