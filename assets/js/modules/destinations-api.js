// Destinations API Module - Dynamic Brazilian Destinations from Brasil API
// Handles fetching and processing destination data from multiple APIs

class DestinationsAPI {
    constructor() {
        this.baseURL = 'https://brasilapi.com.br/api';
        this.cache = new Map();
        this.cacheExpiry = 60 * 60 * 1000; // 1 hour cache for destinations
        this.allCities = [];
        
        console.log('🏙️ Destinations API module initialized');
    }

    /**
     * Fetch all cities with weather stations from CPTEC
     * @returns {Promise<Array>} Array of cities with weather station data
     */
    async fetchAllCities() {
        const cacheKey = 'all_cities_cptec';
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            console.log('🔄 Using cached cities data');
            this.allCities = cached;
            return cached;
        }

        try {
            console.log('🌐 Fetching all cities from CPTEC API...');
            
            const response = await fetch(`${this.baseURL}/cptec/v1/cidade`);
            
            if (!response.ok) {
                throw new Error(`CPTEC API Error: ${response.status} ${response.statusText}`);
            }

            const cities = await response.json();
            
            // Cache the result
            this.setCachedData(cacheKey, cities);
            this.allCities = cities;
            
            console.log(`✅ Successfully fetched ${cities.length} cities from CPTEC`);
            return cities;
            
        } catch (error) {
            console.error('❌ CPTEC cities API error:', error);
            throw new Error(`Failed to fetch Brazilian cities: ${error.message}`);
        }
    }

    /**
     * Get major Brazilian destinations (capitals and important cities)
     * @returns {Promise<Array>} Array of major destinations
     */
    async getMajorDestinations() {
        try {
            if (this.allCities.length === 0) {
                await this.fetchAllCities();
            }

            const majorCities = this.filterMajorCities(this.allCities);
            const destinations = await Promise.all(
                majorCities.map(city => this.convertCityToDestination(city))
            );

            return destinations.filter(dest => dest !== null);
            
        } catch (error) {
            console.error('❌ Error getting major destinations:', error);
            return this.getFallbackDestinations();
        }
    }

    /**
     * Get all available destinations (up to a limit)
     * @param {number} limit - Maximum number of destinations to return
     * @returns {Promise<Array>} Array of all destinations
     */
    async getAllDestinations(limit = 50) {
        try {
            if (this.allCities.length === 0) {
                await this.fetchAllCities();
            }

            const selectedCities = this.allCities.slice(0, limit);
            const destinations = await Promise.all(
                selectedCities.map(city => this.convertCityToDestination(city))
            );

            return destinations.filter(dest => dest !== null);
            
        } catch (error) {
            console.error('❌ Error getting all destinations:', error);
            return this.getFallbackDestinations();
        }
    }

    /**
     * Search destinations by name, state, or category
     * @param {string} searchTerm - Search term
     * @param {number} limit - Maximum results
     * @returns {Promise<Array>} Array of matching destinations
     */
    async searchDestinations(searchTerm, limit = 20) {
        try {
            if (this.allCities.length === 0) {
                await this.fetchAllCities();
            }

            const searchLower = searchTerm.toLowerCase();
            const matchingCities = this.allCities.filter(city =>
                city.nome.toLowerCase().includes(searchLower) ||
                city.estado.toLowerCase().includes(searchLower)
            ).slice(0, limit);

            const destinations = await Promise.all(
                matchingCities.map(city => this.convertCityToDestination(city))
            );

            return destinations.filter(dest => dest !== null);
            
        } catch (error) {
            console.error('❌ Error searching destinations:', error);
            return [];
        }
    }

    /**
     * Get destinations by state
     * @param {string} stateCode - Brazilian state code (e.g., 'SP', 'RJ')
     * @returns {Promise<Array>} Array of destinations in the state
     */
    async getDestinationsByState(stateCode) {
        try {
            if (this.allCities.length === 0) {
                await this.fetchAllCities();
            }

            const stateCities = this.allCities.filter(city =>
                city.estado.toUpperCase() === stateCode.toUpperCase()
            );

            const destinations = await Promise.all(
                stateCities.map(city => this.convertCityToDestination(city))
            );

            return destinations.filter(dest => dest !== null);
            
        } catch (error) {
            console.error('❌ Error getting destinations by state:', error);
            return [];
        }
    }

    /**
     * Filter cities to show only major/important ones
     * @param {Array} cities - Array of cities from API
     * @returns {Array} Filtered array of major cities
     */
    filterMajorCities(cities) {
        const majorCityNames = [
            'Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador', 'Fortaleza',
            'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Goiânia',
            'Belém', 'Porto Alegre', 'Guarulhos', 'Campinas', 'São Luís',
            'São Gonçalo', 'Maceió', 'Duque de Caxias', 'Natal', 'Florianópolis',
            'Teresina', 'Campo Grande', 'São Bernardo do Campo', 'João Pessoa',
            'Osasco', 'Santo André', 'Jaboatão dos Guararapes', 'Contagem',
            'Aracaju', 'Feira de Santana', 'Cuiabá', 'Joinville', 'Juiz de Fora',
            'Londrina', 'Aparecida de Goiânia', 'Ananindeua', 'Porto Velho',
            'Serra', 'Niterói', 'Caxias do Sul', 'Campos dos Goytacazes',
            'São José do Rio Preto', 'Ribeirão Preto', 'Uberlândia', 'Sorocaba',
            'Vitória', 'Vila Velha', 'Carapicuíba', 'Canoas', 'Iguaçu',
            'Betim', 'Contagem', 'Diadema', 'Piracicaba', 'Cariacica'
        ];

        // State capitals
        const stateCapitals = [
            'aracaju', 'maceió', 'natal', 'joão pessoa', 'fortaleza', 'teresina',
            'são luís', 'belém', 'macapá', 'boa vista', 'rio branco', 'porto velho',
            'cuiabá', 'campo grande', 'goiânia', 'palmas', 'brasília', 'vitória',
            'rio de janeiro', 'são paulo', 'belo horizonte', 'curitiba',
            'florianópolis', 'porto alegre'
        ];

        const filtered = cities.filter(city => {
            const cityNameLower = city.nome.toLowerCase();
            
            // Check if it's a state capital
            if (stateCapitals.includes(cityNameLower)) {
                return true;
            }
            
            // Check if it matches major city names
            return majorCityNames.some(major => {
                const majorLower = major.toLowerCase();
                return cityNameLower.includes(majorLower.split(' ')[0]) ||
                       majorLower.includes(cityNameLower) ||
                       this.fuzzyMatch(cityNameLower, majorLower);
            });
        });

        // Remove duplicates
        const uniqueCities = filtered.filter((city, index, self) =>
            index === self.findIndex(c => c.nome === city.nome && c.estado === city.estado)
        );

        console.log(`🏙️ Filtered to ${uniqueCities.length} major cities from ${cities.length} total`);
        return uniqueCities.slice(0, 30); // Limit to 30 major cities
    }

    /**
     * Fuzzy matching for similar city names
     * @param {string} str1 - First string
     * @param {string} str2 - Second string
     * @returns {boolean} Whether strings are similar
     */
    fuzzyMatch(str1, str2) {
        const similarity = this.calculateSimilarity(str1, str2);
        return similarity > 0.7; // 70% similarity threshold
    }

    /**
     * Calculate string similarity
     * @param {string} str1 - First string
     * @param {string} str2 - Second string
     * @returns {number} Similarity score (0-1)
     */
    calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }

    /**
     * Calculate Levenshtein distance between two strings
     * @param {string} str1 - First string
     * @param {string} str2 - Second string
     * @returns {number} Edit distance
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    /**
     * Convert CPTEC city data to destination format
     * @param {Object} city - City data from CPTEC API
     * @returns {Promise<Object>} Destination object
     */    async convertCityToDestination(city) {
        try {
            const destination = {
                id: city.id, // Add id field for compatibility
                name: city.nome,
                coords: this.getCityCoordinates(city.nome, city.estado),
                description: this.generateCityDescription(city.nome, city.estado),
                highlights: this.getCityHighlights(city.nome),
                bestTime: this.getBestTimeToVisit(city.estado),
                avgTemp: '24°C', // Will be updated with real weather data
                category: this.getCityCategory(city.nome, city.estado),
                estado: city.estado,
                state: this.getStateName(city.estado), // Add state name for planner compatibility
                region: this.getRegionFromState(city.estado), // Add region for planner compatibility
                activities: this.getCityActivities(city.nome, city.estado), // Add activities for planner compatibility
                matchPercentage: 85, // Default match percentage
                cityId: city.id, // CPTEC city ID for weather data
                source: 'brasil-api'
            };

            return destination;} catch (error) {
            console.warn(`Failed to process city ${city.nome}:`, error);
            return null;
        }
    }

    /**
     * Get full state name from state code
     * @param {string} estado - State code (e.g., 'SP', 'RJ')
     * @returns {string} Full state name
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
     * @param {string} estado - State code (e.g., 'SP', 'RJ')
     * @returns {string} Region name
     */
    getRegionFromState(estado) {
        const stateRegions = {
            // North (Norte)
            'AC': 'North', 'AM': 'North', 'AP': 'North', 'PA': 'North', 'RO': 'North', 'RR': 'North', 'TO': 'North',
            // Northeast (Nordeste)
            'AL': 'Northeast', 'BA': 'Northeast', 'CE': 'Northeast', 'MA': 'Northeast', 'PB': 'Northeast', 
            'PE': 'Northeast', 'PI': 'Northeast', 'RN': 'Northeast', 'SE': 'Northeast',
            // Central-West (Centro-Oeste)
            'DF': 'Central-West', 'GO': 'Central-West', 'MT': 'Central-West', 'MS': 'Central-West',
            // Southeast (Sudeste)
            'ES': 'Southeast', 'MG': 'Southeast', 'RJ': 'Southeast', 'SP': 'Southeast',
            // South (Sul)
            'PR': 'South', 'RS': 'South', 'SC': 'South'
        };
        return stateRegions[estado] || 'Brazil';
    }

    /**
     * Generate dynamic description for a city
     * @param {string} cityName - Name of the city
     * @param {string} estado - State code
     * @returns {string} Generated description
     */
    generateCityDescription(cityName, estado) {
        const stateNames = {
            'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
            'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
            'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
            'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
            'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
            'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
            'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
        };

        const stateName = stateNames[estado] || estado;
        
        const descriptions = [
            `Explore ${cityName}, a vibrant city in ${stateName} with rich Brazilian culture and local attractions.`,
            `Discover ${cityName} in ${stateName} - experience authentic Brazilian lifestyle, cuisine, and traditions.`,
            `Visit ${cityName}, ${stateName}, and immerse yourself in local culture, history, and natural beauty.`,
            `${cityName} offers a unique glimpse into ${stateName}'s heritage, featuring local cuisine and cultural sites.`
        ];        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    /**
     * Get activities for a city based on its characteristics
     * @param {string} cityName - Name of the city
     * @param {string} estado - State code
     * @returns {Array} Array of activities
     */
    getCityActivities(cityName, estado) {
        const cityLower = cityName.toLowerCase();
        const activities = [];
        
        // Coastal cities get Beach activities
        const coastalStates = ['RJ', 'SP', 'ES', 'BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA', 'PA', 'AP', 'RR', 'AM', 'SC', 'PR', 'RS'];
        const coastalCities = ['rio de janeiro', 'salvador', 'fortaleza', 'recife', 'natal', 'joão pessoa', 'maceió', 'aracaju', 'vitória', 'florianópolis', 'porto alegre'];
        
        if (coastalStates.includes(estado) || coastalCities.some(city => cityLower.includes(city))) {
            activities.push('Beach');
        }
        
        // Capital cities and major cities get Historic and Culture
        const majorCities = ['rio de janeiro', 'são paulo', 'brasília', 'salvador', 'fortaleza', 'belo horizonte', 'manaus', 'curitiba', 'recife', 'goiânia'];
        if (majorCities.some(city => cityLower.includes(city.split(' ')[0])) || estado === 'DF') {
            activities.push('Historic', 'Culture', 'Nightlife');
        }
        
        // Cities with nature/adventure potential
        const adventureStates = ['AM', 'PA', 'MT', 'GO', 'MG', 'PR', 'SC', 'RS'];
        const natureCities = ['manaus', 'belém', 'cuiabá', 'pantanal', 'foz do iguaçu', 'bonito'];
        
        if (adventureStates.includes(estado) || natureCities.some(city => cityLower.includes(city))) {
            activities.push('Adventure', 'Nature');
        }
        
        // All cities have some level of culture and local attractions
        if (activities.length === 0) {
            activities.push('Culture', 'Historic');
        }
        
        return activities;
    }

    /**
     * Get approximate coordinates for Brazilian cities
     * @param {string} cityName - Name of the city
     * @param {string} estado - State code
     * @returns {Array} [longitude, latitude]
     */
    getCityCoordinates(cityName, estado) {
        // Comprehensive coordinates database for major Brazilian cities
        const cityCoords = {
            // Major cities and capitals
            'Rio de Janeiro': [-43.1729, -22.9068],
            'São Paulo': [-46.6333, -23.5505],
            'Brasília': [-47.9292, -15.7801],
            'Salvador': [-38.5014, -12.9730],
            'Fortaleza': [-38.5267, -3.7319],
            'Belo Horizonte': [-43.9378, -19.9208],
            'Manaus': [-60.0258, -3.1190],
            'Curitiba': [-49.2577, -25.4244],
            'Recife': [-34.8755, -8.0476],
            'Goiânia': [-49.2532, -16.6869],
            'Belém': [-48.5044, -1.4558],
            'Porto Alegre': [-51.2177, -30.0346],
            'Florianópolis': [-48.5482, -27.5969],
            'Natal': [-35.2094, -5.7945],
            'Campo Grande': [-54.6295, -20.4697],
            'João Pessoa': [-34.8641, -7.1195],
            'Teresina': [-42.8019, -5.0892],
            'Maceió': [-35.7353, -9.6658],
            'Aracaju': [-37.0731, -10.9472],
            'Cuiabá': [-56.0967, -15.6014],
            'São Luís': [-44.3028, -2.5307],
            'Vitória': [-40.3376, -20.3155],
            'Macapá': [-51.0694, 0.0389],
            'Boa Vista': [-60.6753, 2.8235],
            'Rio Branco': [-67.8099, -9.9750],
            'Porto Velho': [-63.9004, -8.7619],
            'Palmas': [-48.3603, -10.1753],
            
            // Other major cities
            'Guarulhos': [-46.5331, -23.4628],
            'Campinas': [-47.0608, -22.9099],
            'São Gonçalo': [-43.0642, -22.8268],
            'Duque de Caxias': [-43.3123, -22.7858],
            'Nova Iguaçu': [-43.4511, -22.7592],
            'São Bernardo do Campo': [-46.5650, -23.6914],
            'Osasco': [-46.7918, -23.5322],
            'Santo André': [-46.5384, -23.6633],
            'Jaboatão dos Guararapes': [-35.0149, -8.1128],
            'Contagem': [-44.0536, -19.9317],
            'Feira de Santana': [-38.9662, -12.2578],
            'Joinville': [-48.8455, -26.3044],
            'Juiz de Fora': [-43.3504, -21.7587],
            'Londrina': [-51.1624, -23.3045],
            'Aparecida de Goiânia': [-49.2437, -16.8173],
            'Ananindeua': [-48.3719, -1.3656],
            'Serra': [-40.3079, -20.1288],
            'Niterói': [-43.1039, -22.8831],
            'Caxias do Sul': [-51.1794, -29.1678]
        };

        // State center coordinates as fallback
        const stateCoords = {
            'AC': [-70.55, -9.0238], 'AL': [-36.782, -9.5713], 'AP': [-52.036, 1.41],
            'AM': [-64.205, -3.4168], 'BA': [-41.331, -12.5797], 'CE': [-39.59, -5.4984],
            'DF': [-47.9292, -15.7801], 'ES': [-40.308, -19.1834], 'GO': [-49.3132, -16.5],
            'MA': [-45.44, -4.9609], 'MT': [-56.0967, -12.6819], 'MS': [-54.6295, -20.7722],
            'MG': [-45.2471, -18.5122], 'PA': [-52.9714, -1.9981], 'PB': [-36.782, -7.28],
            'PR': [-51.6332, -24.89], 'PE': [-37.336, -8.8137], 'PI': [-43.2532, -7.7183],
            'RJ': [-43.4361, -22.3539], 'RN': [-36.782, -5.4026], 'RS': [-53.5, -30.17],
            'RO': [-63.5, -11.22], 'RR': [-61.5, 1.99], 'SC': [-50.1965, -27.2423],
            'SP': [-48.6882, -22.1896], 'SE': [-37.336, -10.5741], 'TO': [-48.2982, -10.17]
        };

        // Try exact match first
        if (cityCoords[cityName]) {
            return cityCoords[cityName];
        }

        // Try partial match
        for (const [name, coords] of Object.entries(cityCoords)) {
            if (name.toLowerCase().includes(cityName.toLowerCase()) ||
                cityName.toLowerCase().includes(name.toLowerCase())) {
                return coords;
            }
        }

        // Fallback to state center
        return stateCoords[estado] || [-47.9292, -15.7801]; // Default to Brasília
    }

    /**
     * Get city highlights based on known attractions and regional characteristics
     * @param {string} cityName - Name of the city
     * @returns {Array} Array of highlight strings
     */
    getCityHighlights(cityName) {
        const specificHighlights = {
            'Rio de Janeiro': ['Christ the Redeemer', 'Copacabana Beach', 'Sugarloaf Mountain', 'Carnival'],
            'São Paulo': ['Art Museums', 'Food Scene', 'Vila Madalena', 'Japanese District'],
            'Brasília': ['Cathedral', 'National Congress', 'JK Bridge', 'City Park'],
            'Salvador': ['Pelourinho', 'Historic Center', 'Beaches', 'Capoeira'],
            'Manaus': ['Meeting of Waters', 'Amazon Tours', 'Opera House', 'Jungle Lodge'],
            'Florianópolis': ['Joaquina Beach', 'Lagoa da Conceição', 'Surfing', 'Sand Dunes'],
            'Fortaleza': ['Beaches', 'Dragão do Mar', 'Historic Center', 'Nightlife'],
            'Belo Horizonte': ['Pampulha', 'Central Market', 'Museums', 'Mountains'],
            'Curitiba': ['Botanical Garden', 'Opera de Arame', 'Parks', 'Architecture'],
            'Recife': ['Historic Center', 'Beaches', 'Frevo', 'Carnival'],
            'Porto Alegre': ['Historic Center', 'Parks', 'Culture', 'Gaucho Traditions'],
            'Belém': ['Ver-o-Peso Market', 'Amazon Culture', 'Historic Center', 'Cuisine'],
            'Goiânia': ['Parks', 'Art Deco Architecture', 'Culture', 'Nightlife'],
            'Campo Grande': ['Pantanal Gateway', 'Parks', 'Culture', 'Ecotourism'],
            'Teresina': ['Parks', 'Rivers', 'Culture', 'Historic Sites'],
            'Maceió': ['Beaches', 'Coral Reefs', 'Historic Center', 'Handicrafts'],
            'Natal': ['Beaches', 'Sand Dunes', 'Fortress', 'Coastal Tours'],
            'João Pessoa': ['Beaches', 'Historic Center', 'Culture', 'Architecture'],
            'Aracaju': ['Beaches', 'Historic Center', 'Culture', 'River Tours'],
            'Cuiabá': ['Pantanal Access', 'Arena Stadium', 'Culture', 'Nature Tours'],
            'Vitória': ['Beaches', 'Islands', 'Historic Center', 'Mountains']
        };

        if (specificHighlights[cityName]) {
            return specificHighlights[cityName];
        }

        // Generic highlights based on common Brazilian city features
        const genericHighlights = [
            ['Historic Sites', 'Local Culture', 'Regional Cuisine', 'Natural Beauty'],
            ['Churches', 'Markets', 'Parks', 'Local Festivals'],
            ['Cultural Centers', 'Traditional Food', 'Architecture', 'Music Scene'],
            ['Local Museums', 'Artisan Crafts', 'City Parks', 'Community Events'],
            ['Historic Downtown', 'Local Cuisine', 'Cultural Sites', 'Natural Areas']
        ];

        return genericHighlights[Math.floor(Math.random() * genericHighlights.length)];
    }

    /**
     * Get best time to visit based on Brazilian regions and climate
     * @param {string} estado - State code
     * @returns {string} Best time to visit description
     */
    getBestTimeToVisit(estado) {
        const northStates = ['AM', 'RO', 'AC', 'RR', 'PA', 'AP', 'TO'];
        const northeastStates = ['MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'];
        const southStates = ['RS', 'SC', 'PR'];
        const southeastStates = ['SP', 'RJ', 'MG', 'ES'];
        const centralWestStates = ['MT', 'MS', 'GO', 'DF'];

        if (northStates.includes(estado)) {
            return 'Jun-Nov (Dry season, less humidity)';
        } else if (northeastStates.includes(estado)) {
            return 'May-Sep (Dry season, pleasant weather)';
        } else if (southStates.includes(estado)) {
            return 'Dec-Mar (Summer, warm weather)';
        } else if (southeastStates.includes(estado)) {
            return 'Apr-Oct (Mild weather, less rain)';
        } else if (centralWestStates.includes(estado)) {
            return 'May-Sep (Dry season, cooler temperatures)';
        } else {
            return 'Year-round (Check local climate)';
        }
    }

    /**
     * Categorize cities based on characteristics and region
     * @param {string} cityName - Name of the city
     * @param {string} estado - State code
     * @returns {string} Category description
     */
    getCityCategory(cityName, estado) {
        const specificCategories = {
            'Rio de Janeiro': 'Beach & Culture',
            'São Paulo': 'Urban & Business',
            'Brasília': 'Architecture & Politics',
            'Salvador': 'History & Beach',
            'Manaus': 'Nature & Adventure',
            'Florianópolis': 'Beach & Technology',
            'Fortaleza': 'Beach & Culture',
            'Belo Horizonte': 'Culture & Mountains',
            'Curitiba': 'Urban & Parks',
            'Recife': 'History & Beach',
            'Porto Alegre': 'Culture & Traditions',
            'Belém': 'Culture & Nature'
        };

        if (specificCategories[cityName]) {
            return specificCategories[cityName];
        }

        // Category based on state characteristics
        const northStates = ['AM', 'RO', 'AC', 'RR', 'PA', 'AP', 'TO'];
        const coastalStates = ['CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA', 'ES', 'RJ', 'SP', 'PR', 'SC', 'RS'];
        const mountainStates = ['MG', 'RJ', 'ES', 'SP'];

        if (northStates.includes(estado)) {
            return 'Nature & Adventure';
        } else if (coastalStates.includes(estado)) {
            return 'Beach & Culture';
        } else if (mountainStates.includes(estado)) {
            return 'Culture & Mountains';
        } else {
            return 'Culture & Tourism';
        }
    }

    /**
     * Get fallback destinations when API fails
     * @returns {Array} Array of static destinations
     */
    getFallbackDestinations() {
        return [
            {
                name: 'Rio de Janeiro',
                coords: [-43.1729, -22.9068],
                description: 'Famous for Christ the Redeemer, Copacabana Beach, and vibrant culture',
                highlights: ['Christ the Redeemer', 'Copacabana Beach', 'Sugarloaf Mountain', 'Carnival'],
                bestTime: 'Dec-Mar (Summer)',
                avgTemp: '25°C',
                category: 'Beach & Culture',
                estado: 'RJ',
                source: 'static'
            },
            {
                name: 'São Paulo',
                coords: [-46.6333, -23.5505],
                description: 'Brazil\'s largest city with amazing food, art, and nightlife',
                highlights: ['Art Museums', 'Food Scene', 'Vila Madalena', 'Japanese District'],
                bestTime: 'Apr-Oct (Dry season)',
                avgTemp: '20°C',
                category: 'Urban & Business',
                estado: 'SP',
                source: 'static'
            },
            {
                name: 'Brasília',
                coords: [-47.9292, -15.7801],
                description: 'Modern capital with unique architecture and government buildings',
                highlights: ['Cathedral', 'National Congress', 'JK Bridge', 'City Park'],
                bestTime: 'May-Sep (Dry season)',
                avgTemp: '21°C',
                category: 'Architecture & Politics',
                estado: 'DF',
                source: 'static'
            }
        ];
    }

    /**
     * Cache management methods
     */
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
            return cached.data;
        }
        return null;
    }

    setCachedData(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
        console.log('🗑️ Destinations cache cleared');
    }
}

// Export for use in other modules
window.DestinationsAPI = DestinationsAPI;
