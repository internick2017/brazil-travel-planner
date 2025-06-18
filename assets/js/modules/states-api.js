// States API Module - Dynamic Brazilian States from Brasil API
// Handles fetching and processing Brazilian state data from IBGE APIs

class StatesAPI {
    constructor() {
        this.baseURL = 'https://brasilapi.com.br/api';
        this.cache = new Map();
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hour cache for states
        this.allStates = [];
        
        console.log('🏛️ States API module initialized');
    }

    /**
     * Fetch all Brazilian states from IBGE
     * @returns {Promise<Array>} Array of states
     */
    async fetchAllStates() {
        const cacheKey = 'all_states_ibge';
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            console.log('🔄 Using cached states data');
            this.allStates = cached;
            return cached;
        }

        try {
            console.log('🌐 Fetching all states from IBGE API...');
            
            const response = await fetch(`${this.baseURL}/ibge/uf/v1`);
            
            if (!response.ok) {
                throw new Error(`IBGE API Error: ${response.status} ${response.statusText}`);
            }

            const states = await response.json();
            
            // Cache the result
            this.setCachedData(cacheKey, states);
            this.allStates = states;
            
            console.log(`✅ Successfully fetched ${states.length} states from IBGE`);
            return states;
            
        } catch (error) {
            console.error('❌ IBGE states API error:', error);
            throw new Error(`Failed to fetch Brazilian states: ${error.message}`);
        }
    }

    /**
     * Get state information by code
     * @param {string} stateCode - State code (e.g., 'SP', 'RJ')
     * @returns {Promise<Object>} State information
     */
    async getStateByCode(stateCode) {
        try {
            const response = await fetch(`${this.baseURL}/ibge/uf/v1/${stateCode.toUpperCase()}`);
            
            if (!response.ok) {
                throw new Error(`State ${stateCode} not found`);
            }

            const state = await response.json();
            console.log(`✅ Found state: ${state.nome} (${state.sigla})`);
            return state;
            
        } catch (error) {
            console.error(`❌ Error fetching state ${stateCode}:`, error);
            throw error;
        }
    }

    /**
     * Get municipalities for a specific state
     * @param {string} stateCode - State code
     * @returns {Promise<Array>} Array of municipalities
     */
    async getMunicipalitiesByState(stateCode) {
        const cacheKey = `municipalities_${stateCode.toUpperCase()}`;
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            console.log(`🔄 Using cached municipalities for ${stateCode}`);
            return cached;
        }

        try {
            console.log(`🌐 Fetching municipalities for ${stateCode}...`);
            
            const response = await fetch(`${this.baseURL}/ibge/municipios/v1/${stateCode.toUpperCase()}`);
            
            if (!response.ok) {
                throw new Error(`Municipalities API Error: ${response.status}`);
            }

            const municipalities = await response.json();
            
            // Cache the result
            this.setCachedData(cacheKey, municipalities);
            
            console.log(`✅ Found ${municipalities.length} municipalities in ${stateCode}`);
            return municipalities;
            
        } catch (error) {
            console.error(`❌ Error fetching municipalities for ${stateCode}:`, error);
            throw error;
        }
    }

    /**
     * Get states grouped by region
     * @returns {Promise<Object>} States grouped by region
     */
    async getStatesByRegion() {
        try {
            if (this.allStates.length === 0) {
                await this.fetchAllStates();
            }

            const statesByRegion = this.allStates.reduce((groups, state) => {
                const region = state.regiao.nome;
                if (!groups[region]) {
                    groups[region] = [];
                }
                groups[region].push(state);
                return groups;
            }, {});

            console.log('✅ States grouped by region:', Object.keys(statesByRegion));
            return statesByRegion;
            
        } catch (error) {
            console.error('❌ Error grouping states by region:', error);
            throw error;
        }
    }

    /**
     * Search states by name
     * @param {string} searchTerm - Search term
     * @returns {Promise<Array>} Array of matching states
     */
    async searchStates(searchTerm) {
        try {
            if (this.allStates.length === 0) {
                await this.fetchAllStates();
            }

            const searchLower = searchTerm.toLowerCase();
            const matchingStates = this.allStates.filter(state =>
                state.nome.toLowerCase().includes(searchLower) ||
                state.sigla.toLowerCase().includes(searchLower)
            );

            console.log(`🔍 Found ${matchingStates.length} states matching "${searchTerm}"`);
            return matchingStates;
            
        } catch (error) {
            console.error('❌ Error searching states:', error);
            return [];
        }
    }

    /**
     * Get major cities for a state (combines with destinations API)
     * @param {string} stateCode - State code
     * @returns {Promise<Array>} Array of major cities in the state
     */
    async getMajorCitiesByState(stateCode) {
        try {
            // This method can be used in conjunction with DestinationsAPI
            // to filter destinations by state
            console.log(`🏙️ Getting major cities for ${stateCode}...`);
            
            // For now, return a promise that can be resolved by DestinationsAPI
            return new Promise((resolve) => {
                // This will be resolved by the destinations manager
                resolve([]);
            });
            
        } catch (error) {
            console.error(`❌ Error getting major cities for ${stateCode}:`, error);
            throw error;
        }
    }

    /**
     * Get state capitals
     * @returns {Promise<Array>} Array of state capitals
     */
    async getStateCapitals() {
        try {
            if (this.allStates.length === 0) {
                await this.fetchAllStates();
            }

            // Map of state codes to their capitals
            const stateCapitals = {
                'AC': 'Rio Branco',
                'AL': 'Maceió',
                'AP': 'Macapá',
                'AM': 'Manaus',
                'BA': 'Salvador',
                'CE': 'Fortaleza',
                'DF': 'Brasília',
                'ES': 'Vitória',
                'GO': 'Goiânia',
                'MA': 'São Luís',
                'MT': 'Cuiabá',
                'MS': 'Campo Grande',
                'MG': 'Belo Horizonte',
                'PA': 'Belém',
                'PB': 'João Pessoa',
                'PR': 'Curitiba',
                'PE': 'Recife',
                'PI': 'Teresina',
                'RJ': 'Rio de Janeiro',
                'RN': 'Natal',
                'RS': 'Porto Alegre',
                'RO': 'Porto Velho',
                'RR': 'Boa Vista',
                'SC': 'Florianópolis',
                'SP': 'São Paulo',
                'SE': 'Aracaju',
                'TO': 'Palmas'
            };

            const capitals = this.allStates.map(state => ({
                state: state,
                capital: stateCapitals[state.sigla],
                stateCode: state.sigla,
                stateName: state.nome,
                region: state.regiao.nome
            }));

            console.log(`✅ Retrieved ${capitals.length} state capitals`);
            return capitals;
            
        } catch (error) {
            console.error('❌ Error getting state capitals:', error);
            throw error;
        }
    }

    /**
     * Get regional information for tourism
     * @returns {Promise<Object>} Regional tourism information
     */
    async getRegionalTourismInfo() {
        try {
            const regions = {
                'Norte': {
                    characteristics: ['Amazon Rainforest', 'Rivers', 'Indigenous Culture', 'Ecotourism'],
                    climate: 'Tropical rainforest',
                    bestTime: 'June-November (Dry season)',
                    highlights: ['Amazon River', 'Manaus', 'Belém', 'Alter do Chão']
                },
                'Nordeste': {
                    characteristics: ['Beaches', 'Colonial History', 'Music & Dance', 'Cuisine'],
                    climate: 'Semi-arid and tropical',
                    bestTime: 'May-September (Dry season)',
                    highlights: ['Salvador', 'Recife', 'Fortaleza', 'Fernando de Noronha']
                },
                'Centro-Oeste': {
                    characteristics: ['Pantanal', 'Cerrado', 'Wildlife', 'Adventure'],
                    climate: 'Tropical savanna',
                    bestTime: 'May-September (Dry season)',
                    highlights: ['Pantanal', 'Brasília', 'Chapada dos Guimarães', 'Bonito']
                },
                'Sudeste': {
                    characteristics: ['Urban Centers', 'Mountains', 'Beaches', 'Culture'],
                    climate: 'Subtropical and tropical',
                    bestTime: 'April-October (Mild weather)',
                    highlights: ['Rio de Janeiro', 'São Paulo', 'Minas Gerais', 'Espírito Santo']
                },
                'Sul': {
                    characteristics: ['European Influence', 'Wine Country', 'Cooler Climate', 'Gaucho Culture'],
                    climate: 'Subtropical',
                    bestTime: 'December-March (Summer)',
                    highlights: ['Porto Alegre', 'Florianópolis', 'Curitiba', 'Serra Gaúcha']
                }
            };

            console.log('✅ Regional tourism information compiled');
            return regions;
            
        } catch (error) {
            console.error('❌ Error getting regional tourism info:', error);
            throw error;
        }
    }

    /**
     * Get fallback states data when API fails
     * @returns {Array} Array of static states
     */
    getFallbackStates() {
        return [
            { id: 35, sigla: 'SP', nome: 'São Paulo', regiao: { nome: 'Sudeste' } },
            { id: 33, sigla: 'RJ', nome: 'Rio de Janeiro', regiao: { nome: 'Sudeste' } },
            { id: 53, sigla: 'DF', nome: 'Distrito Federal', regiao: { nome: 'Centro-Oeste' } },
            { id: 29, sigla: 'BA', nome: 'Bahia', regiao: { nome: 'Nordeste' } },
            { id: 13, sigla: 'AM', nome: 'Amazonas', regiao: { nome: 'Norte' } },
            { id: 23, sigla: 'CE', nome: 'Ceará', regiao: { nome: 'Nordeste' } },
            { id: 31, sigla: 'MG', nome: 'Minas Gerais', regiao: { nome: 'Sudeste' } },
            { id: 41, sigla: 'PR', nome: 'Paraná', regiao: { nome: 'Sul' } },
            { id: 43, sigla: 'RS', nome: 'Rio Grande do Sul', regiao: { nome: 'Sul' } },
            { id: 42, sigla: 'SC', nome: 'Santa Catarina', regiao: { nome: 'Sul' } }
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
        console.log('🗑️ States cache cleared');
    }
}

// Export for use in other modules
window.StatesAPI = StatesAPI;
