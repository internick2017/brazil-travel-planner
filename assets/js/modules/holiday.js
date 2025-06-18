// Holiday Calendar Module
// Fetch Brazilian holidays and render a simple calendar table

class HolidayAPI {
    static async fetchHolidays(year = new Date().getFullYear()) {
        try {
            const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`);
            if (!response.ok) throw new Error('Failed to load holidays');
            return response.json();
        } catch (error) {
            console.error('Error fetching holidays:', error);
            // Return fallback holidays if API fails
            return this.getFallbackHolidays(year);
        }
    }

    static getFallbackHolidays(year) {
        // Common Brazilian holidays (fixed dates)
        return [
            { date: `${year}-01-01`, name: 'Ano Novo', type: 'national' },
            { date: `${year}-04-21`, name: 'Tiradentes', type: 'national' },
            { date: `${year}-05-01`, name: 'Dia do Trabalhador', type: 'national' },
            { date: `${year}-09-07`, name: 'Independência do Brasil', type: 'national' },
            { date: `${year}-10-12`, name: 'Nossa Senhora Aparecida', type: 'national' },
            { date: `${year}-11-02`, name: 'Finados', type: 'national' },
            { date: `${year}-11-15`, name: 'Proclamação da República', type: 'national' },
            { date: `${year}-12-25`, name: 'Natal', type: 'national' }
        ];
    }

    static filterHolidaysByRange(holidays, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return holidays.filter(h => {
        const d = new Date(h.date);
        return d >= start && d <= end;
    });
}

    static renderHolidayCalendar(containerId, holidays) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (holidays.length === 0) {
        container.innerHTML = '<p>No holidays during your trip dates.</p>';
        return;
    }
    let html = `
        <table class="table table-sm table-bordered">
            <thead><tr><th>Date</th><th>Holiday</th></tr></thead>
            <tbody>
                ${holidays.map(h => `
                    <tr>
                        <td>${new Date(h.date).toLocaleDateString()}</td>
                        <td>${h.name}</td>                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = html;
    }
}

// Export the class globally
window.HolidayAPI = HolidayAPI;
