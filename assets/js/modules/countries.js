// Countries API Module - REST Countries Integration
// Provides access to country information, especially Brazil-specific data

class CountriesAPI {
    constructor() {
        this.baseURL = 'https://restcountries.com/v3.1';
        this.cache = new Map();
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours cache
        
        console.log('🌎 Countries API module initialized');
    }

    // Get Brazil country information
    async getBrazilInfo() {
        const cacheKey = 'brazil_country_info';
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            console.log('🇧🇷 Using cached Brazil country information');
            return cached;
        }

        try {
            console.log('🌎 Fetching Brazil country information...');
            
            const response = await fetch(`${this.baseURL}/name/brazil`);
            
            if (!response.ok) {
                throw new Error(`Countries API Error: ${response.status} ${response.statusText}`);
            }

            const countries = await response.json();
            const brazil = countries[0]; // Brazil should be the first result
            
            // Cache the result
            this.setCachedData(cacheKey, brazil);
            
            console.log('✅ Successfully fetched Brazil country information');
            return brazil;
            
        } catch (error) {
            console.error('❌ Countries API error:', error);
            throw new Error(`Failed to fetch Brazil information: ${error.message}`);
        }
    }

    // Get neighboring countries information
    async getNeighboringCountries() {
        const cacheKey = 'brazil_neighbors';
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            console.log('🗺️ Using cached neighboring countries');
            return cached;
        }

        try {
            console.log('🌎 Fetching Brazil neighboring countries...');
            
            const brazil = await this.getBrazilInfo();
            const neighborCodes = brazil.borders || [];
            
            if (neighborCodes.length === 0) {
                console.log('ℹ️ No border information available');
                return [];
            }

            // Fetch neighbor countries by their alpha codes
            const neighborPromises = neighborCodes.map(async (code) => {
                const response = await fetch(`${this.baseURL}/alpha/${code}`);
                if (response.ok) {
                    const countryData = await response.json();
                    return countryData[0];
                }
                return null;
            });

            const neighbors = await Promise.all(neighborPromises);
            const validNeighbors = neighbors.filter(country => country !== null);
            
            // Cache the result
            this.setCachedData(cacheKey, validNeighbors);
            
            console.log(`✅ Successfully fetched ${validNeighbors.length} neighboring countries`);
            return validNeighbors;
            
        } catch (error) {
            console.error('❌ Error fetching neighboring countries:', error);
            throw new Error(`Failed to fetch neighboring countries: ${error.message}`);
        }
    }

    // Get countries by region (South America)
    async getSouthAmericanCountries() {
        const cacheKey = 'south_america_countries';
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            console.log('🌎 Using cached South American countries');
            return cached;
        }

        try {
            console.log('🌎 Fetching South American countries...');
            
            const response = await fetch(`${this.baseURL}/region/south%20america`);
            
            if (!response.ok) {
                throw new Error(`Countries API Error: ${response.status} ${response.statusText}`);
            }

            const countries = await response.json();
            
            // Cache the result
            this.setCachedData(cacheKey, countries);
            
            console.log(`✅ Successfully fetched ${countries.length} South American countries`);
            return countries;
            
        } catch (error) {
            console.error('❌ Error fetching South American countries:', error);
            throw new Error(`Failed to fetch South American countries: ${error.message}`);
        }
    }

    // Utility methods for caching
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }
        return null;
    }

    setCachedData(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    // Format Brazil info for display
    async getBrazilDisplayInfo() {
        try {
            const brazil = await this.getBrazilInfo();
            
            return {
                name: brazil.name.common,
                officialName: brazil.name.official,
                capital: brazil.capital?.[0] || 'Brasília',
                population: brazil.population,
                area: brazil.area,
                region: brazil.region,
                subregion: brazil.subregion,
                languages: Object.values(brazil.languages || {}),
                currencies: Object.values(brazil.currencies || {}),
                timezones: brazil.timezones || [],
                flag: brazil.flag,
                flagUrl: brazil.flags?.png || brazil.flags?.svg,
                coatOfArms: brazil.coatOfArms?.png || brazil.coatOfArms?.svg,
                maps: brazil.maps,
                continents: brazil.continents || [],
                borderCountries: brazil.borders || []
            };
            
        } catch (error) {
            console.error('❌ Error formatting Brazil display info:', error);
            throw error;
        }
    }

    // Format population number for display
    formatPopulation(population) {
        if (population >= 1000000000) {
            return (population / 1000000000).toFixed(1) + 'B';
        } else if (population >= 1000000) {
            return (population / 1000000).toFixed(1) + 'M';
        } else if (population >= 1000) {
            return (population / 1000).toFixed(1) + 'K';
        }
        return population.toString();
    }

    // Format area number for display
    formatArea(area) {
        return new Intl.NumberFormat('pt-BR').format(area) + ' km²';
    }

    // Get currency information
    async getBrazilCurrency() {
        try {
            const brazil = await this.getBrazilInfo();
            const currencies = brazil.currencies || {};
            
            // Get Brazilian Real (BRL) information
            const brl = currencies.BRL;
            
            if (brl) {
                return {
                    code: 'BRL',
                    name: brl.name,
                    symbol: brl.symbol
                };
            }
            
            return null;
            
        } catch (error) {
            console.error('❌ Error getting Brazil currency:', error);
            return null;
        }
    }

    // Get timezone information for travel planning
    async getBrazilTimezones() {
        try {
            const brazil = await this.getBrazilInfo();
            return brazil.timezones || [];
            
        } catch (error) {
            console.error('❌ Error getting Brazil timezones:', error);
            return [];
        }
    }

    // Get basic travel information
    async getTravelInfo() {
        try {
            const brazil = await this.getBrazilDisplayInfo();
            const neighbors = await this.getNeighboringCountries();
            
            return {
                country: brazil,
                neighboringCountries: neighbors.map(country => ({
                    name: country.name.common,
                    capital: country.capital?.[0],
                    flag: country.flag,
                    borders: country.borders || []
                })),
                totalNeighbors: neighbors.length,
                timezonesCount: brazil.timezones.length,
                languages: brazil.languages,
                currency: await this.getBrazilCurrency()
            };
            
        } catch (error) {
            console.error('❌ Error getting travel info:', error);
            throw error;
        }
    }
}

// Export for use in other modules
window.CountriesAPI = CountriesAPI;
