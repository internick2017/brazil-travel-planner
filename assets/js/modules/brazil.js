// Brazil API Module - Brazilian Government Data Integration
// Provides access to holidays, states, cities, and CEP data

class BrazilAPI {
    constructor() {
        this.baseURL = 'https://brasilapi.com.br/api';
        this.cache = new Map();
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours cache for holidays/states
        
        console.log('🇧🇷 Brazil API module initialized');
    }

    // Get Brazilian holidays for a specific year
    async getHolidays(year = new Date().getFullYear()) {
        const cacheKey = `holidays_${year}`;
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            console.log(`📅 Using cached holidays for ${year}`);
            return cached;
        }

        try {
            console.log(`🇧🇷 Fetching Brazilian holidays for ${year}...`);
            
            const response = await fetch(`${this.baseURL}/feriados/v1/${year}`);
            
            if (!response.ok) {
                throw new Error(`Brazil API Error: ${response.status} ${response.statusText}`);
            }

            const holidays = await response.json();
            
            // Cache the result
            this.setCachedData(cacheKey, holidays);
            
            console.log(`✅ Successfully fetched ${holidays.length} holidays for ${year}`);
            return holidays;
            
        } catch (error) {
            console.error('❌ Brazil holidays API error:', error);
            throw new Error(`Failed to fetch Brazilian holidays: ${error.message}`);
        }
    }

    // Get all Brazilian states
    async getStates() {
        const cacheKey = 'brazil_states';
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            console.log('🏛️ Using cached Brazilian states');
            return cached;
        }

        try {
            console.log('🗺️ Fetching Brazilian states...');
            
            const response = await fetch(`${this.baseURL}/ibge/uf/v1`);
            
            if (!response.ok) {
                throw new Error(`Brazil API Error: ${response.status} ${response.statusText}`);
            }

            const states = await response.json();
            
            // Cache the result
            this.setCachedData(cacheKey, states);
            
            console.log(`✅ Successfully fetched ${states.length} Brazilian states`);
            return states;
            
        } catch (error) {
            console.error('❌ Brazil states API error:', error);
            throw new Error(`Failed to fetch Brazilian states: ${error.message}`);
        }
    }

    // Get cities by state
    async getCitiesByState(stateCode) {
        const cacheKey = `cities_${stateCode}`;
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            console.log(`🏙️ Using cached cities for ${stateCode}`);
            return cached;
        }

        try {
            console.log(`🏙️ Fetching cities for state ${stateCode}...`);
            
            const response = await fetch(`${this.baseURL}/ibge/municipios/v1/${stateCode}`);
            
            if (!response.ok) {
                throw new Error(`Brazil API Error: ${response.status} ${response.statusText}`);
            }

            const cities = await response.json();
            
            // Cache the result
            this.setCachedData(cacheKey, cities);
            
            console.log(`✅ Successfully fetched ${cities.length} cities for ${stateCode}`);
            return cities;
            
        } catch (error) {
            console.error(`❌ Brazil cities API error for ${stateCode}:`, error);
            throw new Error(`Failed to fetch cities for ${stateCode}: ${error.message}`);
        }
    }

    // Get CEP (postal code) information
    async getCEP(cep) {
        try {
            console.log(`📮 Fetching CEP information for ${cep}...`);
            
            // Clean CEP (remove spaces, dashes)
            const cleanCEP = cep.replace(/\D/g, '');
            
            if (cleanCEP.length !== 8) {
                throw new Error('CEP must have 8 digits');
            }
            
            const response = await fetch(`${this.baseURL}/cep/v1/${cleanCEP}`);
            
            if (!response.ok) {
                throw new Error(`Brazil API Error: ${response.status} ${response.statusText}`);
            }

            const cepData = await response.json();
            
            console.log(`✅ Successfully fetched CEP data for ${cep}`);
            return cepData;
            
        } catch (error) {
            console.error(`❌ Brazil CEP API error for ${cep}:`, error);
            throw new Error(`Failed to fetch CEP data: ${error.message}`);
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

    // Get holidays for travel planning - returns upcoming holidays
    async getUpcomingHolidays(months = 6) {
        try {
            const currentYear = new Date().getFullYear();
            const nextYear = currentYear + 1;
            
            // Get holidays for current and next year
            const [currentYearHolidays, nextYearHolidays] = await Promise.all([
                this.getHolidays(currentYear),
                this.getHolidays(nextYear)
            ]);
            
            const allHolidays = [...currentYearHolidays, ...nextYearHolidays];
            const today = new Date();
            const futureDate = new Date();
            futureDate.setMonth(today.getMonth() + months);
            
            // Filter upcoming holidays
            const upcomingHolidays = allHolidays.filter(holiday => {
                const holidayDate = new Date(holiday.date);
                return holidayDate >= today && holidayDate <= futureDate;
            }).sort((a, b) => new Date(a.date) - new Date(b.date));
            
            return upcomingHolidays;
            
        } catch (error) {
            console.error('❌ Error getting upcoming holidays:', error);
            throw error;
        }
    }

    // Format holiday data for display
    formatHolidayDisplay(holiday) {
        const date = new Date(holiday.date);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        return {
            name: holiday.name,
            date: holiday.date,
            formattedDate: date.toLocaleDateString('pt-BR', options),
            dayOfWeek: date.toLocaleDateString('pt-BR', { weekday: 'long' }),
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
            type: holiday.type || 'national'
        };
    }

    // Get state information by code
    async getStateInfo(stateCode) {
        try {
            const states = await this.getStates();
            const state = states.find(s => s.sigla === stateCode.toUpperCase());
            
            if (!state) {
                throw new Error(`State not found: ${stateCode}`);
            }
            
            return state;
            
        } catch (error) {
            console.error(`❌ Error getting state info for ${stateCode}:`, error);
            throw error;
        }
    }

    // Get Brazilian regions
    getBrazilianRegions() {
        return [
            { name: 'Norte', states: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'] },
            { name: 'Nordeste', states: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'] },
            { name: 'Centro-Oeste', states: ['GO', 'MT', 'MS', 'DF'] },
            { name: 'Sudeste', states: ['ES', 'MG', 'RJ', 'SP'] },
            { name: 'Sul', states: ['PR', 'RS', 'SC'] }
        ];
    }
}

// Export for use in other modules
window.BrazilAPI = BrazilAPI;
