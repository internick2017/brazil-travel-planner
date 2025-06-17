// Brazil Travel Planner - Main JavaScript Application

class BrazilTravelApp {
    constructor() {        // Initialize APIs
        this.weatherAPI = null;
        this.countriesAPI = null;
        this.brazilAPI = null;
        this.weatherAlertSystem = null;
        this.destinations = this.getBrazilianDestinations();
        this.init();
    }

    async init() {
        console.log('🇧🇷 Brazil Travel Planner - Initializing...');
        
        // Initialize APIs
        this.initializeAPIs();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Load page-specific content
        if (window.location.pathname.includes('destinations.html')) {
            this.loadDestinations();
            this.initDestinationHandlers();        } else {
            // Load initial weather data for home page
            await this.loadInitialWeatherData();
            // Load Brazilian holidays
            await this.loadBrazilianHolidays();
        }
          // Initialize search functionality
        this.initSearch();
        
        // Initialize weather alert system
        this.initWeatherAlerts();
        
        console.log('✅ Brazil Travel Planner - Ready!');
    }    initializeAPIs() {
        // Initialize Weather API if config is available
        if (window.WeatherAPI && window.API_CONFIG) {
            this.weatherAPI = new WeatherAPI();
            console.log('🌤️ Weather API initialized');
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
        if (window.WeatherAlertSystem && this.weatherAPI) {
            this.weatherAlertSystem = new WeatherAlertSystem(this.weatherAPI);
            console.log('🚨 Weather Alert System initialized');
        } else {
            console.warn('⚠️ Weather Alert System not available. Weather alerts disabled.');
        }
    }

    async loadInitialWeatherData() {
        const weatherPreview = document.getElementById('weatherPreview');
        
        if (!weatherPreview) return;

        try {
            if (this.weatherAPI && this.weatherAPI.apiKey && this.weatherAPI.apiKey !== 'YOUR_VISUAL_CROSSING_API_KEY_HERE') {
                // Use real weather API
                weatherPreview.innerHTML = `
                    <div class="text-center">
                        <div class="spinner-border spinner-border-sm text-warning" role="status">
                            <span class="visually-hidden">Loading weather...</span>
                        </div>
                        <p class="mt-2 mb-0 text-white-50">Loading current weather for Brazilian cities...</p>
                    </div>
                `;

                const cities = ['Rio de Janeiro,Brazil', 'São Paulo,Brazil'];
                const weatherData = await this.weatherAPI.getMultipleCitiesWeather(cities);
                
                let weatherHTML = '<div class="row">';
                
                for (const [city, result] of Object.entries(weatherData)) {
                    if (result.success) {
                        const formatted = this.weatherAPI.formatWeatherDisplay(result.data);
                        const cityName = city.split(',')[0];
                        const iconClass = this.getWeatherIcon(formatted.condition);
                        
                        weatherHTML += `
                            <div class="col-md-6 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="${iconClass} fa-2x text-warning me-3 weather-icon"></i>
                                    <div>
                                        <h6 class="mb-1">${cityName}</h6>
                                        <p class="mb-0">${formatted.temperature}°C - ${formatted.condition}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                    } else {
                        const cityName = city.split(',')[0];
                        weatherHTML += `
                            <div class="col-md-6 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-exclamation-triangle fa-2x text-warning me-3"></i>
                                    <div>
                                        <h6 class="mb-1">${cityName}</h6>
                                        <p class="mb-0">Weather unavailable</p>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }
                
                weatherHTML += '</div>';
                weatherHTML += `
                    <small class="text-white-50">
                        <i class="fas fa-clock me-1"></i>
                        Updated: ${new Date().toLocaleTimeString()} (Live API)
                    </small>
                `;
                weatherPreview.innerHTML = weatherHTML;
                
                console.log('✅ Live weather data loaded successfully');
                
            } else {
                // Fallback to static data
                console.log('⚠️ Using static weather data - API not configured');
                this.loadStaticWeatherData(weatherPreview);
            }
        } catch (error) {
            console.error('Weather API error:', error);
            this.loadStaticWeatherData(weatherPreview);
        }
    }

    loadStaticWeatherData(weatherPreview) {
        // Fallback static weather data
        setTimeout(() => {
            weatherPreview.innerHTML = `
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-sun fa-2x text-warning me-3 weather-icon"></i>
                            <div>
                                <h6 class="mb-1">Rio de Janeiro</h6>
                                <p class="mb-0">28°C - Sunny</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-cloud-rain fa-2x text-info me-3 weather-icon"></i>
                            <div>
                                <h6 class="mb-1">São Paulo</h6>
                                <p class="mb-0">22°C - Rainy</p>
                            </div>
                        </div>
                    </div>
                </div>
                <small class="text-white-50">
                    <i class="fas fa-clock me-1"></i>
                    Updated: ${new Date().toLocaleTimeString()} (Demo Data)
                </small>
            `;
        }, 1500);
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
                            <button class="btn btn-outline-danger btn-sm favorite-btn" data-destination-id="${dest.id}">
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
                            <button class="btn btn-primary btn-sm view-details-btn" data-destination-id="${dest.id}">
                                View Details
                            </button>
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
        
        this.generateTripItinerary(formData);
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
    }

    generateTripItinerary(formData) {
        const generatedTrip = document.getElementById('generatedTrip');
        const tripItinerary = document.getElementById('tripItinerary');
        
        if (!generatedTrip || !tripItinerary) return;
        
        // Show loading state
        tripItinerary.innerHTML = `
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Generating your trip...</span>
                </div>
                <p class="mt-3">Creating your personalized Brazil itinerary...</p>
            </div>
        `;
        
        generatedTrip.classList.remove('d-none');
        
        // Simulate trip generation
        setTimeout(() => {
            const itinerary = this.createItinerary(formData);
            tripItinerary.innerHTML = itinerary;
            
            // Scroll to generated trip
            generatedTrip.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    }

    createItinerary(formData) {
        const recommendedDestinations = this.getRecommendedDestinations(formData.activities);
        
        return `
            <div class="trip-header mb-4">
                <h4 class="text-primary">${formData.tripName}</h4>
                <div class="row">
                    <div class="col-md-3">
                        <small class="text-muted">Duration:</small>
                        <br><strong>${formData.duration} days</strong>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted">Dates:</small>
                        <br><strong>${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}</strong>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted">Budget:</small>
                        <br><strong>${formData.budget.charAt(0).toUpperCase() + formData.budget.slice(1)}</strong>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted">Activities:</small>
                        <br><strong>${formData.activities.join(', ')}</strong>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-12">
                    <h5 class="mb-3"><i class="fas fa-map-marker-alt me-2"></i>Recommended Destinations</h5>
                    <div class="row">
                        ${recommendedDestinations.map(dest => `
                            <div class="col-md-6 mb-3">
                                <div class="card">
                                    <div class="card-body">
                                        <h6 class="card-title">${dest.name}</h6>
                                        <p class="card-text small">${dest.description}</p>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <small class="text-muted">
                                                <i class="fas fa-calendar me-1"></i>
                                                ${dest.recommendedDays} days
                                            </small>
                                            <span class="badge bg-success">${dest.match}% match</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="mt-4">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Weather Tip:</strong> Your selected dates fall during ${this.getSeasonInfo(formData.startDate)} - perfect for most outdoor activities!
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

    getRecommendedDestinations(selectedActivities) {
        const activityMap = {
            'Beach': ['Rio de Janeiro', 'Florianópolis', 'Salvador'],
            'Historic': ['Salvador', 'Brasília', 'São Paulo'],
            'Adventure': ['Manaus', 'Florianópolis'],
            'Nightlife': ['Rio de Janeiro', 'São Paulo']
        };
        
        const destinationScores = {};
        
        selectedActivities.forEach(activity => {
            if (activityMap[activity]) {
                activityMap[activity].forEach(dest => {
                    destinationScores[dest] = (destinationScores[dest] || 0) + 1;
                });
            }
        });
        
        // Convert to array and sort by score
        const recommendations = Object.entries(destinationScores)
            .map(([name, score]) => {
                const dest = this.destinations.find(d => d.name === name);
                return {
                    name,
                    description: dest ? dest.description : 'Amazing Brazilian destination',
                    match: Math.min(95, 70 + (score * 10)),
                    recommendedDays: score > 2 ? 4 : score > 1 ? 3 : 2
                };
            })
            .sort((a, b) => b.match - a.match)
            .slice(0, 4);
        
        return recommendations;
    }

    getSeasonInfo(startDate) {
        const month = new Date(startDate).getMonth();
        
        if (month >= 5 && month <= 8) {
            return "dry season (winter)";
        } else if (month >= 11 || month <= 2) {
            return "wet season (summer)";
        } else {
            return "transition season";
        }
    }

    async loadBrazilianHolidays() {
        const holidaysWidget = document.getElementById('holidaysWidget');
        
        if (!holidaysWidget) return;

        try {
            if (this.brazilAPI) {
                // Use real Brazil API
                const upcomingHolidays = await this.brazilAPI.getUpcomingHolidays(6);
                
                if (upcomingHolidays.length === 0) {
                    holidaysWidget.innerHTML = `
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            No upcoming holidays in the next 6 months
                        </div>
                    `;
                    return;
                }

                let holidaysHTML = '<div class="row">';
                
                upcomingHolidays.slice(0, 4).forEach(holiday => {
                    const formatted = this.brazilAPI.formatHolidayDisplay(holiday);
                    const holidayDate = new Date(holiday.date);
                    const month = holidayDate.toLocaleDateString('en-US', { month: 'short' });
                    const day = holidayDate.getDate();
                    
                    holidaysHTML += `
                        <div class="col-lg-3 col-md-6 mb-3">
                            <div class="card bg-light text-dark">
                                <div class="card-body text-center">
                                    <div class="d-flex align-items-center justify-content-center mb-2">
                                        <div class="me-3">
                                            <div class="bg-warning text-dark rounded p-2" style="min-width: 60px;">
                                                <div class="fw-bold">${month}</div>
                                                <div class="h4 mb-0">${day}</div>
                                            </div>
                                        </div>
                                        <div class="text-start">
                                            <h6 class="card-title mb-1">${holiday.name}</h6>
                                            <small class="text-muted">${formatted.dayOfWeek}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                holidaysHTML += '</div>';
                
                if (upcomingHolidays.length > 4) {
                    holidaysHTML += `
                        <div class="text-center mt-3">
                            <small class="text-white-50">
                                <i class="fas fa-plus me-1"></i>
                                ${upcomingHolidays.length - 4} more holidays this year
                            </small>
                        </div>
                    `;
                }
                
                holidaysWidget.innerHTML = holidaysHTML;
                console.log('✅ Brazilian holidays loaded successfully');
                
            } else {
                // Fallback to static data
                this.loadStaticHolidaysData(holidaysWidget);
            }
        } catch (error) {
            console.error('Brazil holidays API error:', error);
            this.loadStaticHolidaysData(holidaysWidget);
        }
    }

    loadStaticHolidaysData(holidaysWidget) {
        // Fallback static holidays data
        setTimeout(() => {
            holidaysWidget.innerHTML = `
                <div class="row">
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card bg-light text-dark">
                            <div class="card-body text-center">
                                <div class="d-flex align-items-center justify-content-center mb-2">
                                    <div class="me-3">
                                        <div class="bg-warning text-dark rounded p-2" style="min-width: 60px;">
                                            <div class="fw-bold">Sep</div>
                                            <div class="h4 mb-0">7</div>
                                        </div>
                                    </div>
                                    <div class="text-start">
                                        <h6 class="card-title mb-1">Independence Day</h6>
                                        <small class="text-muted">Sunday</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card bg-light text-dark">
                            <div class="card-body text-center">
                                <div class="d-flex align-items-center justify-content-center mb-2">
                                    <div class="me-3">
                                        <div class="bg-warning text-dark rounded p-2" style="min-width: 60px;">
                                            <div class="fw-bold">Oct</div>
                                            <div class="h4 mb-0">12</div>
                                        </div>
                                    </div>
                                    <div class="text-start">
                                        <h6 class="card-title mb-1">Our Lady of Aparecida</h6>
                                        <small class="text-muted">Sunday</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card bg-light text-dark">
                            <div class="card-body text-center">
                                <div class="d-flex align-items-center justify-content-center mb-2">
                                    <div class="me-3">
                                        <div class="bg-warning text-dark rounded p-2" style="min-width: 60px;">
                                            <div class="fw-bold">Dec</div>
                                            <div class="h4 mb-0">25</div>
                                        </div>
                                    </div>
                                    <div class="text-start">
                                        <h6 class="card-title mb-1">Christmas</h6>
                                        <small class="text-muted">Wednesday</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-3">
                    <small class="text-white-50">
                        <i class="fas fa-info-circle me-1"></i>
                        Demo holiday data - API not connected
                    </small>
                </div>
            `;
        }, 1500);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BrazilTravelApp();
});

window.BrazilTravelApp = BrazilTravelApp;