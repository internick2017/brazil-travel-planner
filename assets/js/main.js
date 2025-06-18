// Brazil Travel Planner - Main JavaScript Application

class BrazilTravelApp {
    constructor() {
        // Initialize APIs
        this.weatherAPI = null;
        this.countriesAPI = null;
        this.brazilAPI = null;
        this.weatherAlertSystem = null;
        this.destinations = this.getBrazilianDestinations();
        
        // Initialize selected destinations from localStorage
        const savedDestinations = JSON.parse(localStorage.getItem('selectedDestinations') || '[]');
        this.selectedDestinations = new Map(savedDestinations);        this.maxDestinations = 5; // Maximum number of destinations that can be added
        
        this.init();
    }    async init() {
        console.log('🇧🇷 Brazil Travel App initializing...');
        this.updateNavigationCounter();
        
        // Initialize APIs first
        this.initializeAPIs();
          // Initialize modules
        if (this.weatherAPI) {
            console.log('🌤️ Weather API initialized');
            this.initWeatherAlerts();
            this.initWeatherComparison();
            this.initTravelDatesCalculator();
        }
        
        if (this.brazilAPI) {
            console.log('🇧🇷 Brazil API initialized');
        }
        
        if (this.countriesAPI) {
            console.log('🌍 Countries API initialized');
        }

        // Initialize enhanced animations
        this.initAnimations();        // Load initial data
        try {
            await this.loadInitialWeatherData();
            await this.loadUpcomingHolidays();
        } catch (error) {
            console.error('❌ Error loading data:', error);
            // Ensure fallback data is shown
            this.loadStaticWeatherData(document.getElementById('weatherPreview'));
            this.renderFallbackHolidays();
        }
          // Initialize page-specific features
        this.initializePage();
        
        console.log('✅ Brazil Travel App ready!');
    }

    initializePage() {
        // Initialize event listeners
        this.initEventListeners();
        
        // Initialize page-specific features based on current page
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('planner')) {
            this.initPlannerPage();
        } else if (currentPage.includes('destinations')) {
            this.initDestinationsPage();        } else if (currentPage.includes('index') || currentPage === '/') {
            this.initHomePage();
        }
    }

    initializeAPIs() {
        // Initialize Weather API if config is available
        if (window.WeatherAPI && window.API_CONFIG) {
            this.weatherAPI = new WeatherAPI();
            console.log('🌤️ Weather API initialized');
            
            // Check if API key is properly configured
            if (this.weatherAPI.apiKey && this.weatherAPI.apiKey !== 'YOUR_VISUAL_CROSSING_API_KEY_HERE') {
                console.log('✅ Weather API key configured');
            } else {
                console.log('⚠️ Weather API key not configured - will use static data');
            }
        } else {
            console.warn('⚠️ Weather API not available. Make sure config.js and weather.js are loaded.');
        }
        
        // Initialize Brazil API
        if (window.BrazilAPI) {
            this.brazilAPI = new BrazilAPI();
            console.log('🇧🇷 Brazil API initialized');
        } else {
            console.warn('⚠️ Brazil API not available. Make sure brazil.js is loaded.');
        }
        
        // Initialize Countries API
        if (window.CountriesAPI) {
            this.countriesAPI = new CountriesAPI();
            console.log('🌎 Countries API initialized');
        } else {
            console.warn('⚠️ Countries API not available. Make sure countries.js is loaded.');
        }
    }

    initEventListeners() {
        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', this.handleSearch.bind(this));
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }

        // Mobile navigation
        this.initMobileNavigation();
        
        // Trip planner functionality
        this.initTripPlanner();
    }

    initMobileNavigation() {
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        
        bottomNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Remove active class from all items
                bottomNavItems.forEach(nav => nav.classList.remove('active'));
                // Add active class to clicked item
                e.currentTarget.classList.add('active');
            });
        });
    }    initWeatherAlerts() {
        // Initialize Weather Alert System if available
        if (window.WeatherAlertSystem) {
            this.weatherAlertSystem = new WeatherAlertSystem(this.weatherAPI);
            console.log('🚨 Weather Alert System initialized');
        } else {
            console.warn('⚠️ Weather Alert System not available. Weather alerts disabled.');
        }
    }

    initWeatherComparison() {
        if (window.WeatherComparison) {
            this.weatherComparison = new WeatherComparison(this.weatherAPI);
            console.log('🌡️ Weather Comparison module initialized');
        }
    }    initTravelDatesCalculator() {
        if (window.TravelDatesCalculator) {
            this.travelDatesCalculator = new TravelDatesCalculator(this.weatherAPI);
            console.log('📅 Travel Dates Calculator initialized');
        }
    }

    initAnimations() {
        // Enhanced animations are initialized automatically via animation-controller.js
        // But we can add custom animations here for specific app features
        
        // Add smooth transitions to destination cards
        const destinationCards = document.querySelectorAll('.destination-card');
        destinationCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fadeInUp');
        });

        // Add loading animation to weather widgets
        const weatherWidgets = document.querySelectorAll('.weather-widget');        weatherWidgets.forEach(widget => {
            widget.classList.add('loading-pulse');
        });
    }    async loadUpcomingHolidays() {
        console.log('📅 Starting holiday loading...');        if (window.HolidayAPI) {
            try {
                console.log('📅 Loading holidays for year:', new Date().getFullYear());
                const holidays = await HolidayAPI.fetchHolidays();
                
                // Filter for upcoming holidays only
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
                
                const upcomingHolidays = holidays.filter(holiday => {
                    const holidayDate = new Date(holiday.date);
                    return holidayDate >= today;
                }).slice(0, 5); // Next 5 upcoming holidays
                  this.upcomingHolidays = upcomingHolidays;
                this.renderHolidaysWidget();
            } catch (error) {
                console.warn('📅 Could not load holidays from API, using fallback:', error);
                // Use fallback holidays if API fails
                const fallbackHolidays = HolidayAPI.getFallbackHolidays();
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                this.upcomingHolidays = fallbackHolidays.filter(holiday => {
                    const holidayDate = new Date(holiday.date);
                    return holidayDate >= today;
                }).slice(0, 5);
                
                this.renderHolidaysWidget();
            }
        } else {
            console.warn('📅 HolidayAPI not available');
            this.renderFallbackHolidays();
        }
    }    async loadInitialWeatherData() {
        const weatherPreview = document.getElementById('weatherPreview');
        if (!weatherPreview) {
            console.error('❌ weatherPreview element not found');
            return;
        }

        // Show loading spinner
        weatherPreview.innerHTML = `
            <div class="text-center">
                <div class="spinner-border spinner-border-sm text-warning" role="status"></div>
                <p class="mt-2 mb-0 text-white-50">Loading live weather data...</p>
            </div>
        `;

        try {
            // Only try real-time weather if API is properly initialized
            if (this.weatherAPI && this.weatherAPI.apiKey && this.weatherAPI.apiKey !== 'YOUR_VISUAL_CROSSING_API_KEY_HERE') {
                const weatherData = await this.loadRealTimeWeatherData();
                this.renderLiveWeatherData(weatherPreview, weatherData);
            } else {
                this.loadStaticWeatherData(weatherPreview);
            }
        } catch (error) {
            console.warn('⚠️ Real-time weather failed, using static data.', error);
            this.loadStaticWeatherData(weatherPreview);
        }
    }

    // Fetch real-time weather for major cities
    async loadRealTimeWeatherData() {
        if (!this.weatherAPI) throw new Error('Weather API not initialized');

        const cities = ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'];
        const promises = cities.map(name =>
            this.weatherAPI.getCurrentWeather(`${name},Brazil`)
                .then(data => ({ name, data, success: true }))
                .catch(err => ({ name, err, success: false }))
        );
        const results = await Promise.all(promises);        return results.map(item => {
            if (item.success && item.data) {
                // Extract current conditions from Visual Crossing API response
                const current = item.data.currentConditions || item.data.days?.[0] || {};
                const cond = current.conditions || current.condition || 'Clear';
                const temp = current.temp || current.temperature || 25;
                const humidity = current.humidity || 60;
                const windSpeed = current.windspeed || current.windSpeed || 10;
                
                return {
                    city: item.name,
                    temperature: Math.round(temp),
                    condition: cond,
                    icon: this.getWeatherIcon(cond),
                    humidity: Math.round(humidity),
                    windSpeed: Math.round(windSpeed),
                    isLive: true
                };
            } else {
                console.warn(`Failed to get weather for ${item.name}:`, item.err);
                return this.getFallbackCityWeather(item.name);
            }
        });
    }

    // Fallback static weather
    getFallbackCityWeather(cityName) {
        const fallback = {
            'Rio de Janeiro': { temp: 28, cond: 'Partly cloudy', hum: 70, wind: 12 },
            'São Paulo': { temp: 22, cond: 'Cloudy', hum: 65, wind: 8 },
            'Brasília': { temp: 26, cond: 'Clear', hum: 45, wind: 15 },
            'Salvador': { temp: 29, cond: 'Sunny', hum: 75, wind: 14 }
        }[cityName] || { temp: 25, cond: 'Clear', hum: 60, wind: 10 };
        return {
            city: cityName,
            temperature: fallback.temp,
            condition: fallback.cond,
            icon: this.getWeatherIcon(fallback.cond),
            humidity: fallback.hum,
            windSpeed: fallback.wind,            isLive: false
        };
    }    // Render weather cards
    renderLiveWeatherData(container, data) {
        console.log('🌤️ Rendering weather data to container:', container);
        const live = data.some(d => d.isLive);
        const weatherHTML = `
            <div class="weather-grid">
                ${data.map(d => `
                    <div class="weather-card-modern">
                        <div class="weather-card-header">
                            <h6 class="city-name">${d.city}</h6>
                            <div class="weather-icon">
                                <i class="${d.icon}"></i>
                            </div>
                        </div>
                        <div class="weather-card-body">
                            <div class="temperature">${d.temperature}°</div>
                            <div class="condition">${d.condition}</div>
                            <div class="weather-details">
                                <span class="detail-item">
                                    <i class="fas fa-tint"></i> ${d.humidity}%
                                </span>
                                <span class="detail-item">
                                    <i class="fas fa-wind"></i> ${d.windSpeed}km/h
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="weather-footer">
                <small class="update-time">
                    <i class="fas fa-clock"></i> ${new Date().toLocaleTimeString()}
                    ${live ? '<span class="status-badge live">LIVE</span>' : '<span class="status-badge cached">CACHED</span>'}
                </small>
            </div>        `;
          container.innerHTML = weatherHTML;
    }

    getWeatherIcon(condition) {
        const conditionLower = condition.toLowerCase();
        
        if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
            return 'fas fa-sun';
        } else if (conditionLower.includes('cloud')) {
            return 'fas fa-cloud';
        } else if (conditionLower.includes('rain')) {
            return 'fas fa-cloud-rain';
        } else if (conditionLower.includes('storm')) {
            return 'fas fa-bolt';
        } else {
            return 'fas fa-cloud-sun';
        }
    }

    getHolidayIcon(holidayName) {
        const nameLower = holidayName.toLowerCase();
        
        if (nameLower.includes('carnaval')) {
            return 'fas fa-masks-theater';
        } else if (nameLower.includes('natal') || nameLower.includes('christmas')) {
            return 'fas fa-gifts';
        } else if (nameLower.includes('páscoa') || nameLower.includes('santa')) {
            return 'fas fa-cross';
        } else if (nameLower.includes('independência') || nameLower.includes('tiradentes')) {
            return 'fas fa-flag';
        } else if (nameLower.includes('trabalho') || nameLower.includes('work')) {
            return 'fas fa-hammer';
        } else if (nameLower.includes('finados') || nameLower.includes('consciência')) {
            return 'fas fa-heart';
        } else if (nameLower.includes('aparecida') || nameLower.includes('nossa')) {
            return 'fas fa-church';
        } else if (nameLower.includes('república') || nameLower.includes('proclamação')) {
            return 'fas fa-landmark';
        } else if (nameLower.includes('corpus')) {
            return 'fas fa-dove';
        } else if (nameLower.includes('mundial') || nameLower.includes('ano')) {
            return 'fas fa-champagne-glasses';
        } else {
            return 'fas fa-calendar-day';
        }
    }

    initSearch() {
        const searchInput = document.getElementById('searchInput');
        
        if (searchInput) {
            // Add autocomplete functionality (placeholder)
            searchInput.addEventListener('input', this.handleSearchInput.bind(this));
        }
    }

    handleSearchInput(e) {
        const query = e.target.value.toLowerCase();
        
        // Placeholder for autocomplete functionality
        if (query.length >= 2) {
            console.log('Searching for:', query);
        }
    }

    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput?.value.trim();
        
        if (!query) {
            this.showAlert('Please enter a destination to search', 'warning');
            return;
        }
        
        console.log('Searching for destination:', query);
        this.showAlert(`Searching for "${query}"...`, 'info');
        
        setTimeout(() => {
            window.location.href = `pages/destinations.html?search=${encodeURIComponent(query)}`;
        }, 1000);
    }

    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
        `;
        
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    getBrazilianDestinations() {
        return [
            {
                id: 1,
                name: "Rio de Janeiro",
                state: "Rio de Janeiro",
                region: "Southeast",
                description: "Famous for its stunning beaches, Christ the Redeemer statue, and vibrant culture.",
                image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=300&fit=crop",
                temperature: "28°C",
                weather: "Sunny",
                weatherIcon: "fas fa-sun",
                activities: ["Beach", "Historic", "Nightlife"],
                matchPercentage: 95,
                crowdLevel: "High"
            },
            {
                id: 2,
                name: "São Paulo",
                state: "São Paulo", 
                region: "Southeast",
                description: "Brazil's largest city, known for its incredible food scene and cultural diversity.",
                image: "https://images.unsplash.com/photo-1541990079-6bd3d3e5b6de?w=400&h=300&fit=crop",
                temperature: "22°C",
                weather: "Partly Cloudy",
                weatherIcon: "fas fa-cloud-sun",
                activities: ["Urban", "Food", "Culture"],
                matchPercentage: 88,
                crowdLevel: "High"
            },
            {
                id: 3,
                name: "Salvador",
                state: "Bahia",
                region: "Northeast",
                description: "Historic colonial city with rich Afro-Brazilian culture and beautiful beaches.",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
                temperature: "29°C",
                weather: "Sunny",
                weatherIcon: "fas fa-sun",
                activities: ["Historic", "Beach", "Culture"],
                matchPercentage: 92,
                crowdLevel: "Medium"
            },
            {
                id: 4,
                name: "Florianópolis", 
                state: "Santa Catarina",
                region: "South",
                description: "Island paradise with 42 beaches and excellent surfing conditions.",
                image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop",
                temperature: "24°C",
                weather: "Partly Cloudy",
                weatherIcon: "fas fa-cloud-sun",
                activities: ["Beach", "Adventure", "Nature"],
                matchPercentage: 90,
                crowdLevel: "Medium"
            },
            {
                id: 5,
                name: "Manaus",
                state: "Amazonas",
                region: "North", 
                description: "Gateway to the Amazon rainforest with incredible biodiversity.",
                image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
                temperature: "31°C",
                weather: "Humid",
                weatherIcon: "fas fa-cloud-rain",
                activities: ["Adventure", "Nature", "Wildlife"],
                matchPercentage: 85,
                crowdLevel: "Low"
            },
            {
                id: 6,
                name: "Brasília",
                state: "Distrito Federal",
                region: "Center-West",
                description: "Brazil's modernist capital with unique architecture and urban planning.",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
                temperature: "26°C",
                weather: "Clear",
                weatherIcon: "fas fa-sun",
                activities: ["Architecture", "Culture", "Historic"],
                matchPercentage: 78,
                crowdLevel: "Low"
            }
        ];
    }

    loadDestinations() {
        const container = document.getElementById('destinationsContainer');
        if (!container) return;

        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        
        let filteredDestinations = this.destinations;
        
        if (searchQuery) {
            filteredDestinations = this.destinations.filter(dest => 
                dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dest.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dest.region.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        container.innerHTML = this.renderDestinationCards(filteredDestinations, searchQuery);
    }

    renderDestinationCards(destinations, searchQuery = null) {
        if (destinations.length === 0) {
            return `
                <div class="col-12 text-center">
                    <div class="alert alert-info">
                        <i class="fas fa-search me-2"></i>
                        ${searchQuery ? `No destinations found for "${searchQuery}"` : 'No destinations available'}
                    </div>
                </div>
            `;
        }

        // Load previously selected destinations
        const savedDestinations = JSON.parse(localStorage.getItem('selectedDestinations') || '[]');
        this.selectedDestinations = new Map(savedDestinations);

        return destinations.map(dest => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card destination-card h-100 shadow-sm">
                    <div class="position-relative">
                        <img src="${dest.image}" class="card-img-top destination-image" alt="${dest.name}" style="height: 200px; object-fit: cover;">
                        <div class="position-absolute top-0 end-0 m-2">
                            <span class="badge bg-success">${dest.matchPercentage}% Match</span>
                        </div>
                        <div class="position-absolute bottom-0 start-0 m-2">
                            <span class="badge bg-dark bg-opacity-75">
                                <i class="${dest.weatherIcon} me-1"></i>
                                ${dest.temperature}
                            </span>
                        </div>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title mb-1">${dest.name}</h5>
                            <button class="btn btn-sm favorite-btn" data-destination-id="${dest.id}">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                        <p class="text-muted small mb-2">${dest.state} • ${dest.region}</p>
                        <p class="card-text flex-grow-1">${dest.description}</p>
                        <div class="mb-3">
                            <div class="d-flex flex-wrap gap-1">
                                ${dest.activities.map(activity => `
                                    <span class="badge bg-light text-dark">${activity}</span>
                                `).join('')}
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="fas fa-users me-1"></i>
                                ${dest.crowdLevel} crowds
                            </small>
                            <div class="btn-group">
                                <button class="btn btn-outline-primary btn-sm view-details-btn" data-destination-id="${dest.id}">
                                    <i class="fas fa-info-circle me-1"></i>Details
                                </button>                                <button class="btn ${this.selectedDestinations.has(dest.id.toString()) ? 'btn-success' : 'btn-primary'} btn-sm add-to-plan-btn" data-destination-id="${dest.id}">
                                    ${this.selectedDestinations.has(dest.id.toString()) ? 
                                        '<i class="fas fa-check me-1"></i>Added' : 
                                        '<i class="fas fa-plus me-1"></i>Add to Plan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    initDestinationHandlers() {
        // Favorite button handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-btn')) {
                const btn = e.target.closest('.favorite-btn');
                const icon = btn.querySelector('i');
                
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    btn.classList.remove('btn-outline-danger');
                    btn.classList.add('btn-danger');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    btn.classList.remove('btn-danger');
                    btn.classList.add('btn-outline-danger');
                }
            }
        });

        // View details button handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-details-btn')) {
                const destinationId = e.target.closest('.view-details-btn').dataset.destinationId;
                this.showDestinationDetails(destinationId);
            }
        });

        // Add to Plan button handlers
        document.addEventListener('click', (e) => {
            const addToPlanBtn = e.target.closest('.add-to-plan-btn');
            if (addToPlanBtn) {
                const destinationId = addToPlanBtn.dataset.destinationId;
                this.handleAddToPlan(destinationId);
            }
        });

        // Load any previously selected destinations
        const savedDestinations = JSON.parse(localStorage.getItem('selectedDestinations') || '[]');
        this.selectedDestinations = new Map(savedDestinations);
        
        // Update the UI to reflect loaded destinations
        this.selectedDestinations.forEach((_, id) => {
            this.updateAddToPlanButton(id, true);
        });
        this.updatePlannerLink();
    }

    showDestinationDetails(destinationId) {
        const destination = this.destinations.find(d => d.id == destinationId);
        if (!destination) return;

        this.showAlert(`You selected ${destination.name}! Details page coming soon.`, 'info');
    }

    initTripPlanner() {
        const tripForm = document.getElementById('tripPlannerForm');
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        const durationSelect = document.getElementById('tripDuration');
        
        if (tripForm) {
            // Load pre-selected destinations if any
            const urlParams = new URLSearchParams(window.location.search);
            const selectedDestIds = urlParams.get('destinations')?.split(',') || [];
            const savedDestinations = JSON.parse(localStorage.getItem('selectedDestinations') || '[]');
            
            this.selectedDestinations = new Map(savedDestinations);
            
            if (selectedDestIds.length > 0 || this.selectedDestinations.size > 0) {
                const selectedDestinationsDiv = document.createElement('div');
                selectedDestinationsDiv.className = 'selected-destinations mb-4';
                selectedDestinationsDiv.innerHTML = `
                    <h5 class="mb-3">Selected Destinations</h5>
                    <div class="row g-3">
                        ${Array.from(this.selectedDestinations.values()).map(dest => `
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-start">
                                            <h6 class="card-title mb-1">${dest.name}</h6>
                                            <button type="button" class="btn btn-sm btn-outline-danger remove-destination" 
                                                    data-destination-id="${dest.id}">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                        <p class="text-muted small mb-0">${dest.state} • ${dest.region}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                
                // Insert before the form
                tripForm.parentNode.insertBefore(selectedDestinationsDiv, tripForm);
                
                // Add event listeners for remove buttons
                document.querySelectorAll('.remove-destination').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const destId = e.currentTarget.dataset.destinationId;
                        this.selectedDestinations.delete(destId);
                        localStorage.setItem('selectedDestinations', 
                            JSON.stringify(Array.from(this.selectedDestinations.entries())));
                        e.currentTarget.closest('.col-md-6').remove();
                        
                        // If no destinations left, remove the section
                        if (this.selectedDestinations.size === 0) {
                            selectedDestinationsDiv.remove();
                        }
                    });
                });
            }

            tripForm.addEventListener('submit', this.handleTripSubmission.bind(this));
        }
        
        if (startDateInput && endDateInput && durationSelect) {
            // Auto-calculate end date when start date or duration changes
            startDateInput.addEventListener('change', this.updateEndDate.bind(this));
            durationSelect.addEventListener('change', this.updateEndDate.bind(this));
            
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            startDateInput.min = today;
        }
    }

    updateEndDate() {
        const startDate = document.getElementById('startDate').value;
        const duration = parseInt(document.getElementById('tripDuration').value);
        const endDateInput = document.getElementById('endDate');
        
        if (startDate && duration) {
            const start = new Date(startDate);
            const end = new Date(start.getTime() + (duration * 24 * 60 * 60 * 1000));
            endDateInput.value = end.toISOString().split('T')[0];
        }
    }

    handleTripSubmission(e) {
        e.preventDefault();
        
        const formData = {
            tripName: document.getElementById('tripName').value,
            duration: document.getElementById('tripDuration').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            budget: document.getElementById('budgetRange').value,
            activities: this.getSelectedActivities()
        };
        
        if (!this.validateTripForm(formData)) {
            return;
        }
        
        // Generate the trip itinerary
        this.generateTripItinerary(formData);

        // Fetch and render holiday calendar for the trip dates
        if (window.HolidayAPI) {
            HolidayAPI.fetchHolidays()
                .then(allHols => HolidayAPI.filterHolidaysByRange(allHols, formData.startDate, formData.endDate))
                .then(filtered => HolidayAPI.renderHolidayCalendar('holidaysCalendar', filtered))
                .catch(err => console.error('Error loading holidays:', err));
        }

        // Generate travel dates recommendation if calculator is available
        if (this.travelDatesCalculator) {
            const preferences = {
                activities: formData.activities,
                budget: formData.budget,
                duration: parseInt(formData.duration)
            };
            
            this.travelDatesCalculator.calculateBestDates(preferences)
                .then(recommendations => {
                    const container = document.getElementById('travelDatesRecommendations');
                    if (container) {
                        this.travelDatesCalculator.renderCalculation('travelDatesRecommendations', recommendations);
                    }
                })
                .catch(err => console.error('Error calculating travel dates:', err));
        }

        // Start weather monitoring if alerts are enabled
        if (this.weatherAlertSystem) {
            this.weatherAlertSystem.checkWeatherAlerts()
                .then(alerts => {
                    if (alerts.length > 0) {
                        console.log(`🚨 ${alerts.length} weather alerts detected`);
                    }
                })
                .catch(err => console.error('Error checking weather alerts:', err));
        }
    }

    getSelectedActivities() {
        const activities = [];
        const checkboxes = ['beachActivity', 'historicActivity', 'adventureActivity', 'nightlifeActivity'];
        
        checkboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox && checkbox.checked) {
                activities.push(checkbox.nextElementSibling.textContent.trim());
            }
        });
        
        return activities;
    }

    validateTripForm(formData) {
        if (!formData.tripName) {
            this.showAlert('Please enter a trip name', 'warning');
            return false;
        }
        
        if (!formData.startDate) {
            this.showAlert('Please select a start date', 'warning');
            return false;
        }
        
        if (formData.activities.length === 0) {
            this.showAlert('Please select at least one activity', 'warning');
            return false;
        }
        
        return true;
    }    generateTripItinerary(formData) {
        const generatedTrip = document.getElementById('generatedTrip');
        const tripItinerary = document.getElementById('tripItinerary');
        
        if (!generatedTrip || !tripItinerary) return;
        
        // Show loading state
        tripItinerary.innerHTML = `
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Generating your intelligent trip plan...</span>
                </div>
                <p class="mt-3">Analyzing destinations, weather, and creating optimal itinerary...</p>
            </div>
        `;
        
        generatedTrip.classList.remove('d-none');
        
        // Get recommended destinations based on activities and dates
        let recommendedDestinations = this.getRecommendedDestinations(
            formData.activities,
            formData.startDate,
            formData.duration
        );

        // If user has pre-selected destinations, use those instead
        if (this.selectedDestinations.size > 0) {
            recommendedDestinations = Array.from(this.selectedDestinations.values()).map(dest => ({
                ...dest,
                matchScore: this.calculateDestinationMatch(dest, formData.activities),
                recommendedDays: this.calculateRecommendedDays(dest, formData.activities)
            }));
        }

        // Generate smart itinerary
        setTimeout(() => {
            const smartItinerary = this.generateSmartItinerary(formData, recommendedDestinations);
            tripItinerary.innerHTML = this.renderSmartItinerary(formData, smartItinerary);
            // Scroll to generated trip
            generatedTrip.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    }

    calculateDestinationMatch(destination, selectedActivities) {
        const matchingActivities = destination.activities.filter(
            activity => selectedActivities.includes(activity)
        );
        return Math.round((matchingActivities.length / selectedActivities.length) * 100);
    }

    createItinerary(formData, recommendedDestinations) {
        if (recommendedDestinations.length === 0) {
            return `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    No destinations match your criteria. Try selecting different activities or dates.
                </div>
            `;
        }

        // Calculate total trip match score
        const averageMatchScore = Math.round(
            recommendedDestinations.reduce((sum, dest) => sum + dest.matchScore, 0) / 
            recommendedDestinations.length
        );

        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);

        return `
            <div class="trip-header mb-4">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="text-primary mb-0">${formData.tripName}</h4>
                    <span class="badge bg-success fs-6">
                        <i class="fas fa-star me-1"></i>${averageMatchScore}% Match
                    </span>
                </div>
                <hr>
                <div class="row g-3">
                    <div class="col-md-3">
                        <small class="text-muted">Duration:</small>
                        <br><strong>${formData.duration} days</strong>
                    </div>
                    <div class="col-md-4">
                        <small class="text-muted">Dates:</small>
                        <br><strong>${startDate.toLocaleDateString('en-US', { dateStyle: 'medium' })} - ${endDate.toLocaleDateString('en-US', { dateStyle: 'medium' })}</strong>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted">Budget Level:</small>
                        <br><strong>${formData.budget.charAt(0).toUpperCase() + formData.budget.slice(1)}</strong>
                    </div>
                    <div class="col-md-2">
                        <small class="text-muted">Cities:</small>
                        <br><strong>${recommendedDestinations.length}</strong>
                    </div>
                </div>
            </div>
            
            <div class="mb-4">
                <h5 class="mb-3"><i class="fas fa-map-marker-alt me-2"></i>Recommended Itinerary</h5>
                <div class="timeline-container">
                    ${recommendedDestinations.map((dest, index) => `
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h6 class="card-title mb-1">
                                            ${index + 1}. ${dest.name}, ${dest.state}
                                        </h6>
                                        <p class="text-muted small mb-2">
                                            <i class="fas fa-clock me-1"></i>${dest.recommendedDays} days recommended
                                            <span class="mx-2">•</span>
                                            <i class="fas fa-thermometer-half me-1"></i>${dest.temperature}
                                            <span class="mx-2">•</span>
                                            <i class="${dest.weatherIcon} me-1"></i>${dest.weather}
                                        </p>
                                    </div>
                                    <span class="badge bg-success">${dest.matchScore}% Match</span>
                                </div>
                                <p class="card-text small mb-2">${dest.description}</p>
                                <div class="d-flex flex-wrap gap-2 mb-2">
                                    ${dest.activities.map(activity => 
                                        `<span class="badge bg-light text-dark">${activity}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="travel-tips bg-light p-3 rounded mb-4">
                <h6 class="mb-3"><i class="fas fa-lightbulb me-2"></i>Travel Tips</h6>
                <div class="row">
                    <div class="col-md-6">
                        <ul class="list-unstyled mb-0">
                            <li class="mb-2">
                                <i class="fas fa-calendar-check text-success me-2"></i>
                                Best time to visit: ${this.getSeasonInfo(formData.startDate)}
                            </li>
                            <li class="mb-2">
                                <i class="fas fa-plane text-success me-2"></i>
                                Consider flying between cities to save time
                            </li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <ul class="list-unstyled mb-0">
                            <li class="mb-2">
                                <i class="fas fa-umbrella-beach text-success me-2"></i>
                                Pack for ${recommendedDestinations[0]?.weather.toLowerCase()} weather
                            </li>
                            <li class="mb-2">
                                <i class="fas fa-dollar-sign text-success me-2"></i>
                                Estimated daily budget: ${this.getBudgetEstimate(formData.budget)}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="text-center mt-4">
                <button class="btn btn-primary me-2" onclick="window.print()">
                    <i class="fas fa-print me-2"></i>Print Itinerary
                </button>
                <button class="btn btn-outline-primary">
                    <i class="fas fa-share me-2"></i>Share Trip
                </button>
            </div>
        `;
    }

    renderSmartItinerary(formData, itinerary) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);

        return `
            <!-- Trip Overview Header -->
            <div class="trip-header mb-4 p-4 bg-light rounded">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="text-primary mb-0">
                        <i class="fas fa-map-marked-alt me-2"></i>${formData.tripName}
                    </h4>
                    <span class="badge bg-success fs-6">
                        <i class="fas fa-star me-1"></i>${itinerary.overview.averageMatch}% Match
                    </span>
                </div>
                
                <div class="row g-3 mb-3">
                    <div class="col-md-2">
                        <small class="text-muted d-block">Duration</small>
                        <strong>${formData.duration} days</strong>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted d-block">Dates</small>
                        <strong>${startDate.toLocaleDateString('en-US', { dateStyle: 'medium' })} - ${endDate.toLocaleDateString('en-US', { dateStyle: 'medium' })}</strong>
                    </div>
                    <div class="col-md-2">
                        <small class="text-muted d-block">Cities</small>
                        <strong>${itinerary.overview.totalCities}</strong>
                    </div>
                    <div class="col-md-2">
                        <small class="text-muted d-block">Distance</small>
                        <strong>${itinerary.overview.totalDistance} km</strong>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted d-block">Transport</small>
                        <strong>${itinerary.overview.bestTransport}</strong>
                    </div>
                </div>

                <!-- Budget Overview -->
                <div class="budget-overview p-3 bg-white rounded border">
                    <h6 class="mb-2"><i class="fas fa-dollar-sign me-2"></i>Budget Estimate</h6>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="text-center">
                                <div class="h4 text-success mb-1">$${itinerary.budget.totalPerDay}</div>
                                <small class="text-muted">Per Day</small>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center">
                                <div class="h4 text-primary mb-1">$${itinerary.budget.totalTrip}</div>
                                <small class="text-muted">Total Trip</small>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center">
                                <div class="h6 text-info mb-1">${formData.budget.charAt(0).toUpperCase() + formData.budget.slice(1)}</div>
                                <small class="text-muted">Budget Level</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Warnings and Recommendations -->
            ${this.renderAlertsSection(itinerary.warnings, itinerary.recommendations)}

            <!-- Daily Schedule -->
            <div class="daily-schedule mb-4">
                <h5 class="mb-3"><i class="fas fa-calendar-alt me-2"></i>Daily Itinerary</h5>
                <div class="timeline">
                    ${itinerary.dailySchedule.map(day => `
                        <div class="timeline-item card mb-3">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h6 class="card-title mb-1">
                                            <span class="badge bg-primary me-2">Day ${day.day}</span>
                                            ${day.city}
                                        </h6>
                                        <div class="weather-info">
                                            <small class="text-muted">
                                                <i class="${day.weather.icon} me-1"></i>
                                                ${day.weather.temperature} • ${day.weather.condition}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="activities mb-3">
                                    <strong class="small">Planned Activities:</strong>
                                    <ul class="mt-1 mb-0">
                                        ${day.activities.map(activity => `<li class="small">${activity}</li>`).join('')}
                                    </ul>
                                </div>
                                
                                ${day.tips.length > 0 ? `
                                    <div class="tips">
                                        <strong class="small text-info">💡 Tips:</strong>
                                        <ul class="mt-1 mb-0">
                                            ${day.tips.map(tip => `<li class="small text-muted">${tip}</li>`).join('')}
                                        </ul>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Budget Breakdown -->
            <div class="budget-breakdown mb-4">
                <h5 class="mb-3"><i class="fas fa-chart-pie me-2"></i>Budget Breakdown</h5>
                <div class="row">
                    ${itinerary.budget.breakdown.map(item => `
                        <div class="col-md-6 col-lg-4 mb-3">
                            <div class="card h-100">
                                <div class="card-body text-center">
                                    <h6 class="card-title">${item.category}</h6>
                                    <div class="h5 text-primary">$${item.amount}</div>
                                    <div class="progress" style="height: 6px;">
                                        <div class="progress-bar" style="width: ${item.percentage}%"></div>
                                    </div>
                                    <small class="text-muted">${item.percentage}% of budget</small>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="text-center mt-4">
                <button class="btn btn-primary me-2" onclick="window.print()">
                    <i class="fas fa-print me-2"></i>Print Itinerary
                </button>
                <button class="btn btn-outline-primary me-2" onclick="brazilTravelApp.exportTripPDF('${formData.tripName}')">
                    <i class="fas fa-file-pdf me-2"></i>Export PDF
                </button>
                <button class="btn btn-outline-secondary" onclick="brazilTravelApp.shareTrip('${formData.tripName}')">
                    <i class="fas fa-share me-2"></i>Share Trip
                </button>
            </div>
        `;
    }

    renderAlertsSection(warnings, recommendations) {
        if (warnings.length === 0 && recommendations.length === 0) return '';

        return `
            <div class="alerts-section mb-4">
                ${warnings.length > 0 ? `
                    <div class="warnings mb-3">
                        <h6 class="text-warning"><i class="fas fa-exclamation-triangle me-2"></i>Travel Warnings</h6>
                        ${warnings.map(warning => `
                            <div class="alert alert-warning alert-sm">
                                <small><strong>${warning.type.toUpperCase()}:</strong> ${warning.message}</small>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${recommendations.length > 0 ? `
                    <div class="recommendations">
                        <h6 class="text-info"><i class="fas fa-lightbulb me-2"></i>Smart Recommendations</h6>
                        ${recommendations.map(rec => `
                            <div class="alert alert-info alert-sm">
                                <small><span class="me-2">${rec.icon}</span><strong>${rec.title}:</strong> ${rec.message}</small>
                            </div>                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Export and sharing functions (placeholder implementations)
    exportTripPDF(tripName) {
        this.showAlert('PDF export feature coming soon! Use the print button for now.', 'info');
    }

    shareTrip(tripName) {
        if (navigator.share) {
            navigator.share({
                title: `My Brazil Trip: ${tripName}`,
                text: 'Check out my Brazil travel itinerary!',
                url: window.location.href
            });
        } else {
            // Fallback for browsers without native sharing
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                this.showAlert('Trip URL copied to clipboard!', 'success');
            });
        }
    }    initHomePage() {
        // Initialize home page specific features
        
        // Initialize destination navigation counter
        this.updateNavigationCounter();
        
        // Render holidays if they are already loaded
        if (this.upcomingHolidays && this.upcomingHolidays.length > 0) {
            this.renderHolidaysWidget();
        }
    }

    initDestinationsPage() {
        // Initialize destinations page specific features
        console.log('🗺️ Initializing destinations page');
        
        // Update navigation counter
        this.updateNavigationCounter();
    }

    initPlannerPage() {
        // Initialize planner page specific features
        console.log('📅 Initializing planner page');
        
        // Initialize trip form if it exists
        const tripForm = document.getElementById('tripPlannerForm');
        if (tripForm) {
            tripForm.addEventListener('submit', this.handleTripSubmission.bind(this));
        }
        
        // Initialize date inputs
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        const durationSelect = document.getElementById('tripDuration');
        
        if (startDateInput && endDateInput && durationSelect) {
            // Auto-calculate end date when start date or duration changes
            startDateInput.addEventListener('change', this.updateEndDate.bind(this));
            durationSelect.addEventListener('change', this.updateEndDate.bind(this));
            
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            startDateInput.min = today;
        }
    }

    updateNavigationCounter() {
        // Update any navigation counters (e.g., selected destinations count)
        const count = this.selectedDestinations ? this.selectedDestinations.size : 0;
        
        // Update any navigation badges or counters
        const counterElements = document.querySelectorAll('.navigation-counter');
        counterElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'inline' : 'none';
        });
    }    // Render holidays widget
    renderHolidaysWidget() {
        const holidaysWidget = document.getElementById('holidaysWidget');
        if (!holidaysWidget) {
            console.error('❌ holidaysWidget element not found');
            return;
        }

        if (!this.upcomingHolidays || this.upcomingHolidays.length === 0) {
            holidaysWidget.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    No upcoming holidays available
                </div>
            `;
            return;
        }
        
        const holidaysHtml = this.upcomingHolidays.map(holiday => {
            const date = new Date(holiday.date);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()}`;
            
            // Get holiday icon based on holiday name
            const holidayIcon = this.getHolidayIcon(holiday.name);
            
            return `
                <div class="holiday-card-modern">
                    <div class="holiday-icon">
                        <i class="${holidayIcon}"></i>
                    </div>
                    <div class="holiday-content">
                        <h6 class="holiday-name">${holiday.name}</h6>
                        <p class="holiday-local-name">${holiday.localName || holiday.name}</p>
                    </div>
                    <div class="holiday-date">
                        <span class="date-badge">${formattedDate}</span>
                    </div>
                </div>
            `;
        }).join('');

        const finalHTML = `
            <div class="holidays-container-modern">
                ${holidaysHtml}
            </div>
        `;        holidaysWidget.innerHTML = finalHTML;
        console.log('✅ Holidays widget rendered successfully');
    }    // Render fallback holidays when API is not available
    renderFallbackHolidays() {
        const holidaysWidget = document.getElementById('holidaysWidget');
        if (!holidaysWidget) {
            console.error('❌ holidaysWidget element not found');
            return;
        }const fallbackHolidays = [
            { name: 'Independence Day', date: '2025-09-07', localName: 'Dia da Independência' },
            { name: 'Our Lady of Aparecida', date: '2025-10-12', localName: 'Nossa Senhora Aparecida' },
            { name: 'All Souls Day', date: '2025-11-02', localName: 'Finados' },
            { name: 'Proclamation of the Republic', date: '2025-11-15', localName: 'Proclamação da República' },
            { name: 'Black Awareness Day', date: '2025-11-20', localName: 'Dia da Consciência Negra' },
            { name: 'Christmas', date: '2025-12-25', localName: 'Natal' }
        ];

        // Filter for upcoming holidays only
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        this.upcomingHolidays = fallbackHolidays.filter(holiday => {
            const holidayDate = new Date(holiday.date);
            return holidayDate >= today;
        }).slice(0, 5);
        this.renderHolidaysWidget();
    }    // Load static weather data when API is not available
    loadStaticWeatherData(container) {
        if (!container) {
            console.error('❌ Weather container not found');
            return;
        }

        const staticWeatherData = [
            {
                city: 'Rio de Janeiro',
                temperature: 28,
                condition: 'Partly cloudy',
                icon: this.getWeatherIcon('Partly cloudy'),
                humidity: 70,
                windSpeed: 12,
                isLive: false
            },
            {
                city: 'São Paulo',
                temperature: 22,
                condition: 'Cloudy',
                icon: this.getWeatherIcon('Cloudy'),
                humidity: 65,
                windSpeed: 8,
                isLive: false
            },
            {
                city: 'Brasília',
                temperature: 26,
                condition: 'Clear',
                icon: this.getWeatherIcon('Clear'),
                humidity: 45,
                windSpeed: 15,
                isLive: false
            },
            {
                city: 'Salvador',
                temperature: 29,
                condition: 'Sunny',
                icon: this.getWeatherIcon('Sunny'),
                humidity: 75,
                windSpeed: 14,
                isLive: false
            }        ];

        this.renderLiveWeatherData(container, staticWeatherData);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BrazilTravelApp();
});