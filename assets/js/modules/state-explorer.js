// Brazilian State Explorer Module
// Interactive state exploration with detailed information

class BrazilianStateExplorer {
    constructor(brazilAPI) {
        this.brazilAPI = brazilAPI;
        this.states = this.initializeStatesData();
        this.selectedState = null;
    }

    initializeStatesData() {
        return {
            'AC': { 
                name: 'Acre', 
                capital: 'Rio Branco', 
                region: 'Norte',
                area: '164,173 km²',
                population: '894,470',
                attractions: ['Serra do Divisor National Park', 'Rubber Museum', 'Mercado Velho'],
                culture: 'Indigenous heritage and rubber tapping traditions',
                climate: 'Equatorial',
                bestTime: 'May to September',
                economy: 'Rubber, agriculture, livestock',
                flag: '🌳',
                color: '#228B22'
            },
            'AL': { 
                name: 'Alagoas', 
                capital: 'Maceió', 
                region: 'Nordeste',
                area: '27,843 km²',
                population: '3,351,543',
                attractions: ['Maragogi Beach', 'São Miguel dos Milagres', 'Penedo Historic Center'],
                culture: 'Rich Afro-Brazilian heritage and handicrafts',
                climate: 'Tropical coastal',
                bestTime: 'September to March',
                economy: 'Tourism, sugarcane, petrochemicals',
                flag: '🏖️',
                color: '#87CEEB'
            },
            'AP': { 
                name: 'Amapá', 
                capital: 'Macapá', 
                region: 'Norte',
                area: '142,470 km²',
                population: '861,773',
                attractions: ['Tumucumaque National Park', 'Marco Zero', 'Fortaleza de São José'],
                culture: 'Indigenous and riverside communities',
                climate: 'Equatorial',
                bestTime: 'June to December',
                economy: 'Mining, fishing, timber',
                flag: '🌊',
                color: '#4169E1'
            },
            'AM': { 
                name: 'Amazonas', 
                capital: 'Manaus', 
                region: 'Norte',
                area: '1,559,168 km²',
                population: '4,207,714',
                attractions: ['Meeting of Waters', 'Amazon Theatre', 'Anavilhanas Archipelago'],
                culture: 'Indigenous traditions and river communities',
                climate: 'Equatorial rainforest',
                bestTime: 'June to November',
                economy: 'Free trade zone, ecotourism, fishing',
                flag: '🌴',
                color: '#006400'
            },
            'BA': { 
                name: 'Bahia', 
                capital: 'Salvador', 
                region: 'Nordeste',
                area: '564,760 km²',
                population: '14,930,634',
                attractions: ['Pelourinho', 'Chapada Diamantina', 'Porto de Galinhas'],
                culture: 'Afro-Brazilian culture, capoeira, music',
                climate: 'Tropical and semi-arid',
                bestTime: 'April to October',
                economy: 'Petrochemicals, tourism, agriculture',
                flag: '🎭',
                color: '#FF6347'
            },
            'CE': { 
                name: 'Ceará', 
                capital: 'Fortaleza', 
                region: 'Nordeste',
                area: '148,894 km²',
                population: '9,187,103',
                attractions: ['Jericoacoara', 'Canoa Quebrada', 'Serra de Baturité'],
                culture: 'Folk art, literature, and coastal traditions',
                climate: 'Semi-arid and tropical coastal',
                bestTime: 'July to December',
                economy: 'Tourism, textiles, agribusiness',
                flag: '🏄‍♂️',
                color: '#FF8C00'
            },
            'DF': { 
                name: 'Distrito Federal', 
                capital: 'Brasília', 
                region: 'Centro-Oeste',
                area: '5,760 km²',
                population: '3,055,149',
                attractions: ['National Congress', 'Cathedral of Brasília', 'JK Memorial'],
                culture: 'Modern architecture and political center',
                climate: 'Tropical savanna',
                bestTime: 'May to September',
                economy: 'Government, services, technology',
                flag: '🏛️',
                color: '#DAA520'
            },
            'ES': { 
                name: 'Espírito Santo', 
                capital: 'Vitória', 
                region: 'Sudeste',
                area: '46,074 km²',
                population: '4,064,052',
                attractions: ['Guarapari', 'Domingos Martins', 'Pedra Azul'],
                culture: 'Italian and German immigrant influence',
                climate: 'Tropical',
                bestTime: 'April to September',
                economy: 'Steel, mining, agriculture',
                flag: '⛰️',
                color: '#32CD32'
            },
            'GO': { 
                name: 'Goiás', 
                capital: 'Goiânia', 
                region: 'Centro-Oeste',
                area: '340,112 km²',
                population: '7,113,540',
                attractions: ['Chapada dos Veadeiros', 'Pirenópolis', 'Caldas Novas'],
                culture: 'Sertanejo music and religious festivals',
                climate: 'Tropical savanna',
                bestTime: 'May to September',
                economy: 'Agribusiness, mining, livestock',
                flag: '🌾',
                color: '#DAA520'
            },
            'MA': { 
                name: 'Maranhão', 
                capital: 'São Luís', 
                region: 'Nordeste',
                area: '329,642 km²',
                population: '7,114,598',
                attractions: ['Lençóis Maranhenses', 'Alcântara', 'Historic Center of São Luís'],
                culture: 'Bumba-meu-boi and colonial architecture',
                climate: 'Tropical',
                bestTime: 'May to September',
                economy: 'Agriculture, mining, industry',
                flag: '🏜️',
                color: '#F0E68C'
            },
            'MT': { 
                name: 'Mato Grosso', 
                capital: 'Cuiabá', 
                region: 'Centro-Oeste',
                area: '903,208 km²',
                population: '3,526,220',
                attractions: ['Pantanal', 'Chapada dos Guimarães', 'Nobres'],
                culture: 'Cowboy culture and indigenous heritage',
                climate: 'Tropical',
                bestTime: 'April to September',
                economy: 'Agribusiness, mining, livestock',
                flag: '🐆',
                color: '#8FBC8F'
            },
            'MS': { 
                name: 'Mato Grosso do Sul', 
                capital: 'Campo Grande', 
                region: 'Centro-Oeste',
                area: '357,145 km²',
                population: '2,809,394',
                attractions: ['Bonito', 'Pantanal Sul', 'Aquário Natural'],
                culture: 'Gaucho traditions and ecotourism',
                climate: 'Tropical',
                bestTime: 'April to September',
                economy: 'Agribusiness, mining, ecotourism',
                flag: '🐟',
                color: '#20B2AA'
            },
            'MG': { 
                name: 'Minas Gerais', 
                capital: 'Belo Horizonte', 
                region: 'Sudeste',
                area: '586,521 km²',
                population: '21,292,666',
                attractions: ['Ouro Preto', 'Tiradentes', 'Serra da Canastra'],
                culture: 'Colonial heritage and traditional cuisine',
                climate: 'Tropical highland',
                bestTime: 'April to September',
                economy: 'Mining, agriculture, industry',
                flag: '⛏️',
                color: '#CD853F'
            },
            'PA': { 
                name: 'Pará', 
                capital: 'Belém', 
                region: 'Norte',
                area: '1,245,870 km²',
                population: '8,690,745',
                attractions: ['Ilha de Marajó', 'Alter do Chão', 'Ver-o-Peso Market'],
                culture: 'Amazonian and riverside communities',
                climate: 'Equatorial',
                bestTime: 'June to November',
                economy: 'Mining, agriculture, timber',
                flag: '🦬',
                color: '#228B22'
            },
            'PB': { 
                name: 'Paraíba', 
                capital: 'João Pessoa', 
                region: 'Nordeste',
                area: '56,467 km²',
                population: '4,039,277',
                attractions: ['Cabo Branco', 'Campina Grande', 'Areia'],
                culture: 'Forró music and June festivals',
                climate: 'Tropical coastal and semi-arid',
                bestTime: 'September to March',
                economy: 'Agriculture, textiles, tourism',
                flag: '🎵',
                color: '#FF69B4'
            },
            'PR': { 
                name: 'Paraná', 
                capital: 'Curitiba', 
                region: 'Sul',
                area: '199,298 km²',
                population: '11,516,840',
                attractions: ['Iguazu Falls', 'Vila Velha', 'Ilha do Mel'],
                culture: 'European immigrant influence',
                climate: 'Subtropical',
                bestTime: 'March to June, September to November',
                economy: 'Agriculture, industry, tourism',
                flag: '💧',
                color: '#4682B4'
            },
            'PE': { 
                name: 'Pernambuco', 
                capital: 'Recife', 
                region: 'Nordeste',
                area: '98,067 km²',
                population: '9,616,621',
                attractions: ['Olinda', 'Porto de Galinhas', 'Fernando de Noronha'],
                culture: 'Frevo, maracatu, and colonial architecture',
                climate: 'Tropical coastal and semi-arid',
                bestTime: 'September to March',
                economy: 'Industry, agriculture, tourism',
                flag: '🎪',
                color: '#FF1493'
            },
            'PI': { 
                name: 'Piauí', 
                capital: 'Teresina', 
                region: 'Nordeste',
                area: '251,755 km²',
                population: '3,281,480',
                attractions: ['Serra da Capivara', 'Delta do Parnaíba', 'Sete Cidades'],
                culture: 'Archaeological sites and folklore',
                climate: 'Semi-arid and tropical',
                bestTime: 'May to September',
                economy: 'Agriculture, livestock, mining',
                flag: '🏺',
                color: '#D2691E'
            },
            'RJ': { 
                name: 'Rio de Janeiro', 
                capital: 'Rio de Janeiro', 
                region: 'Sudeste',
                area: '43,750 km²',
                population: '17,366,189',
                attractions: ['Christ the Redeemer', 'Copacabana', 'Sugarloaf Mountain'],
                culture: 'Carnival, samba, and beach culture',
                climate: 'Tropical',
                bestTime: 'March to May, September to November',
                economy: 'Oil, tourism, services',
                flag: '🏖️',
                color: '#FF6347'
            },
            'RN': { 
                name: 'Rio Grande do Norte', 
                capital: 'Natal', 
                region: 'Nordeste',
                area: '52,809 km²',
                population: '3,534,265',
                attractions: ['Ponta Negra', 'Genipabu', 'Pipa'],
                culture: 'Coastal traditions and dune buggy culture',
                climate: 'Tropical coastal',
                bestTime: 'September to March',
                economy: 'Tourism, salt production, fruit',
                flag: '🏜️',
                color: '#F4A460'
            },
            'RS': { 
                name: 'Rio Grande do Sul', 
                capital: 'Porto Alegre', 
                region: 'Sul',
                area: '281,707 km²',
                population: '11,422,973',
                attractions: ['Gramado', 'Canela', 'Bento Gonçalves'],
                culture: 'Gaucho traditions and German influence',
                climate: 'Subtropical',
                bestTime: 'March to June, September to November',
                economy: 'Agriculture, industry, wine',
                flag: '🍷',
                color: '#8B0000'
            },
            'RO': { 
                name: 'Rondônia', 
                capital: 'Porto Velho', 
                region: 'Norte',
                area: '237,765 km²',
                population: '1,796,460',
                attractions: ['Madeira River', 'National Forest of Jamari', 'Estrada de Ferro Madeira-Mamoré'],
                culture: 'Frontier culture and indigenous heritage',
                climate: 'Tropical',
                bestTime: 'May to September',
                economy: 'Agriculture, mining, livestock',
                flag: '🚂',
                color: '#CD853F'
            },
            'RR': { 
                name: 'Roraima', 
                capital: 'Boa Vista', 
                region: 'Norte',
                area: '224,274 km²',
                population: '652,713',
                attractions: ['Mount Roraima', 'Caracaraí', 'Lago Caracaranã'],
                culture: 'Indigenous communities and Venezuelan influence',
                climate: 'Tropical',
                bestTime: 'December to March',
                economy: 'Agriculture, mining, livestock',
                flag: '⛰️',
                color: '#696969'
            },
            'SC': { 
                name: 'Santa Catarina', 
                capital: 'Florianópolis', 
                region: 'Sul',
                area: '95,730 km²',
                population: '7,252,502',
                attractions: ['Florianópolis', 'Blumenau', 'Balneário Camboriú'],
                culture: 'German and Italian heritage',
                climate: 'Subtropical',
                bestTime: 'March to June, September to November',
                economy: 'Industry, tourism, agriculture',
                flag: '🏝️',
                color: '#4682B4'
            },
            'SP': { 
                name: 'São Paulo', 
                capital: 'São Paulo', 
                region: 'Sudeste',
                area: '248,219 km²',
                population: '46,289,333',
                attractions: ['São Paulo City', 'Santos', 'Campos do Jordão'],
                culture: 'Business center and cultural diversity',
                climate: 'Tropical highland',
                bestTime: 'March to May, September to November',
                economy: 'Industry, services, agriculture',
                flag: '🏙️',
                color: '#4B0082'
            },
            'SE': { 
                name: 'Sergipe', 
                capital: 'Aracaju', 
                region: 'Nordeste',
                area: '21,918 km²',
                population: '2,318,822',
                attractions: ['Aracaju', 'São Cristóvão', 'Canindé do São Francisco'],
                culture: 'Colonial architecture and folklore',
                climate: 'Tropical coastal',
                bestTime: 'September to March',
                economy: 'Oil, tourism, agriculture',
                flag: '🏛️',
                color: '#FFB6C1'
            },
            'TO': { 
                name: 'Tocantins', 
                capital: 'Palmas', 
                region: 'Norte',
                area: '277,425 km²',
                population: '1,590,248',
                attractions: ['Jalapão', 'Ilha do Bananal', 'Palmas'],
                culture: 'Frontier culture and ecotourism',
                climate: 'Tropical savanna',
                bestTime: 'May to September',
                economy: 'Agriculture, livestock, tourism',
                flag: '🌵',
                color: '#DAA520'
            }
        };
    }

    renderStateExplorer(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="state-explorer">
                <div class="row">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header bg-primary text-white">
                                <h6 class="mb-0"><i class="fas fa-map me-2"></i>Select a State</h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="state-regions">
                                    ${this.renderStatesByRegion()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div id="stateDetails" class="state-details">
                            <div class="card">
                                <div class="card-body text-center text-muted">
                                    <i class="fas fa-map-marked-alt fa-3x mb-3"></i>
                                    <h5>Explore Brazilian States</h5>
                                    <p>Select a state from the list to learn more about its culture, attractions, and travel information.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStatesByRegion() {
        const regions = {
            'Norte': ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
            'Nordeste': ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
            'Centro-Oeste': ['DF', 'GO', 'MT', 'MS'],
            'Sudeste': ['ES', 'MG', 'RJ', 'SP'],
            'Sul': ['PR', 'RS', 'SC']
        };

        return Object.entries(regions).map(([region, stateCodes]) => `
            <div class="region-section">
                <div class="region-header p-3 bg-light border-bottom">
                    <h6 class="mb-0 text-primary">${region}</h6>
                </div>
                <div class="state-list">
                    ${stateCodes.map(code => {
                        const state = this.states[code];
                        return `
                            <div class="state-item p-3 border-bottom cursor-pointer" 
                                 onclick="stateExplorer.selectState('${code}')"
                                 style="transition: all 0.2s ease;">
                                <div class="d-flex align-items-center">
                                    <span class="state-flag me-3" style="font-size: 1.5rem;">${state.flag}</span>
                                    <div>
                                        <div class="fw-bold">${state.name}</div>
                                        <small class="text-muted">${state.capital}</small>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('');
    }

    selectState(stateCode) {
        this.selectedState = stateCode;
        const state = this.states[stateCode];
        this.renderStateDetails(state, stateCode);
        
        // Update active state in sidebar
        document.querySelectorAll('.state-item').forEach(item => {
            item.classList.remove('active');
            item.style.backgroundColor = '';
        });
        
        event.target.closest('.state-item').classList.add('active');
        event.target.closest('.state-item').style.backgroundColor = 'rgba(13, 110, 253, 0.1)';
    }

    renderStateDetails(state, stateCode) {
        const container = document.getElementById('stateDetails');
        if (!container) return;

        container.innerHTML = `
            <div class="state-detail-card">
                <div class="card">
                    <div class="card-header text-white" style="background: linear-gradient(135deg, ${state.color}, ${this.darkenColor(state.color)});">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <span class="state-flag-large me-3" style="font-size: 3rem;">${state.flag}</span>
                                <div>
                                    <h4 class="mb-0">${state.name}</h4>
                                    <p class="mb-0">Capital: ${state.capital}</p>
                                </div>
                            </div>
                            <div class="text-end">
                                <div class="badge bg-light text-dark">${state.region}</div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6><i class="fas fa-info-circle text-primary me-2"></i>Basic Information</h6>
                                <ul class="list-unstyled">
                                    <li><strong>Area:</strong> ${state.area}</li>
                                    <li><strong>Population:</strong> ${state.population}</li>
                                    <li><strong>Climate:</strong> ${state.climate}</li>
                                    <li><strong>Best Time to Visit:</strong> ${state.bestTime}</li>
                                </ul>
                                
                                <h6><i class="fas fa-briefcase text-success me-2"></i>Economy</h6>
                                <p>${state.economy}</p>
                            </div>
                            <div class="col-md-6">
                                <h6><i class="fas fa-camera text-warning me-2"></i>Main Attractions</h6>
                                <ul class="list-unstyled">
                                    ${state.attractions.map(attraction => `
                                        <li class="mb-1">
                                            <i class="fas fa-map-marker-alt text-danger me-2"></i>
                                            ${attraction}
                                        </li>
                                    `).join('')}
                                </ul>
                                
                                <h6><i class="fas fa-users text-info me-2"></i>Culture</h6>
                                <p>${state.culture}</p>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <div class="row">
                                <div class="col-md-6">
                                    <button class="btn btn-primary btn-sm w-100" onclick="stateExplorer.showWeatherInfo('${stateCode}')">
                                        <i class="fas fa-cloud-sun me-2"></i>Weather Information
                                    </button>
                                </div>
                                <div class="col-md-6">
                                    <button class="btn btn-success btn-sm w-100" onclick="stateExplorer.addToTripPlanner('${stateCode}')">
                                        <i class="fas fa-plus me-2"></i>Add to Trip Planner
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    darkenColor(color) {
        // Simple color darkening function
        const colors = {
            '#228B22': '#006400',
            '#87CEEB': '#4682B4',
            '#4169E1': '#191970',
            '#006400': '#003300',
            '#FF6347': '#DC143C',
            '#FF8C00': '#FF4500',
            '#DAA520': '#B8860B',
            '#32CD32': '#228B22',
            '#F0E68C': '#BDB76B',
            '#8FBC8F': '#556B2F',
            '#20B2AA': '#008B8B',
            '#CD853F': '#A0522D',
            '#FF69B4': '#C71585',
            '#4682B4': '#2F4F4F',
            '#FF1493': '#B22222',
            '#D2691E': '#8B4513',
            '#F4A460': '#CD853F',
            '#8B0000': '#4B0000',
            '#696969': '#2F2F2F',
            '#4B0082': '#2E0854',
            '#FFB6C1': '#FF69B4'
        };
        return colors[color] || color;
    }

    showWeatherInfo(stateCode) {
        const state = this.states[stateCode];
        if (window.animationController) {
            window.animationController.showNotification(
                `Weather in ${state.name}: ${state.climate} climate. Best time to visit: ${state.bestTime}`,
                'info',
                5000
            );
        } else {
            alert(`Weather in ${state.name}: ${state.climate} climate. Best time to visit: ${state.bestTime}`);
        }
    }

    addToTripPlanner(stateCode) {
        const state = this.states[stateCode];
        
        // Save to localStorage for trip planner
        const savedStates = JSON.parse(localStorage.getItem('tripPlannerStates') || '[]');
        if (!savedStates.includes(stateCode)) {
            savedStates.push(stateCode);
            localStorage.setItem('tripPlannerStates', JSON.stringify(savedStates));
            
            if (window.animationController) {
                window.animationController.showNotification(
                    `${state.name} added to your trip planner!`,
                    'success'
                );
            } else {
                alert(`${state.name} added to your trip planner!`);
            }
        } else {
            if (window.animationController) {
                window.animationController.showNotification(
                    `${state.name} is already in your trip planner`,
                    'warning'
                );
            } else {
                alert(`${state.name} is already in your trip planner`);
            }
        }
    }

    getStatesByRegion(region) {
        return Object.entries(this.states)
            .filter(([code, state]) => state.region === region)
            .map(([code, state]) => ({ code, ...state }));
    }

    searchStates(query) {
        const lowerQuery = query.toLowerCase();
        return Object.entries(this.states)
            .filter(([code, state]) => 
                state.name.toLowerCase().includes(lowerQuery) ||
                state.capital.toLowerCase().includes(lowerQuery) ||
                state.attractions.some(attraction => 
                    attraction.toLowerCase().includes(lowerQuery)
                )
            )
            .map(([code, state]) => ({ code, ...state }));
    }
}

// Export for global use
window.BrazilianStateExplorer = BrazilianStateExplorer;
