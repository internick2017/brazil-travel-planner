// Holiday Calendar Module
// Fetch Brazilian holidays and render a simple calendar table

export async function fetchHolidays() {
    const response = await fetch('https://brasilapi.com.br/api/feriados/v1');
    if (!response.ok) throw new Error('Failed to load holidays');
    return response.json();
}

export function filterHolidaysByRange(holidays, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return holidays.filter(h => {
        const d = new Date(h.date);
        return d >= start && d <= end;
    });
}

export function renderHolidayCalendar(containerId, holidays) {
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
                        <td>${h.name}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

// Expose as global API
window.HolidayAPI = {
    fetchHolidays,
    filterHolidaysByRange,
    renderHolidayCalendar
};
