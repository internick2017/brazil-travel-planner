/**
 * Brazil Holidays API Testing Script
 * Created: June 16, 2025
 * Purpose: Test and validate Brazilian holidays API endpoint functionality
 */

class BrazilHolidaysTester {
    constructor() {
        this.brazilAPI = new BrazilAPI();
        this.testResults = [];
    }

    /**
     * Run all holiday API tests
     */
    async runAllTests() {
        console.log('🇧🇷 Starting Brazil Holidays API Tests...');
        console.log('=' .repeat(50));

        const tests = [
            this.testCurrentYearHolidays.bind(this),
            this.testPreviousYearHolidays.bind(this),
            this.testNextYearHolidays.bind(this),
            this.testHolidayDataStructure.bind(this),
            this.testHolidayDatesValidation.bind(this),
            this.testHolidayNamesValidation.bind(this),
            this.testAPIErrorHandling.bind(this),
            this.testCacheability.bind(this),
            this.testUpcomingHolidays.bind(this),
            this.testHolidayFiltering.bind(this)
        ];

        for (let i = 0; i < tests.length; i++) {
            const testName = tests[i].name;
            console.log(`\n📋 Test ${i + 1}/${tests.length}: ${testName}`);
            
            try {
                const result = await tests[i]();
                this.logTestResult(testName, true, result);
            } catch (error) {
                this.logTestResult(testName, false, error.message);
            }
        }

        this.displayTestSummary();
    }

    /**
     * Test 1: Current year holidays
     */
    async testCurrentYearHolidays() {
        const currentYear = new Date().getFullYear();
        const holidays = await this.brazilAPI.getHolidays(currentYear);
        
        if (!Array.isArray(holidays)) {
            throw new Error('Holidays should be returned as an array');
        }
        
        if (holidays.length === 0) {
            throw new Error('No holidays returned for current year');
        }

        return `✅ Retrieved ${holidays.length} holidays for ${currentYear}`;
    }

    /**
     * Test 2: Previous year holidays
     */
    async testPreviousYearHolidays() {
        const previousYear = new Date().getFullYear() - 1;
        const holidays = await this.brazilAPI.getHolidays(previousYear);
        
        if (!Array.isArray(holidays) || holidays.length === 0) {
            throw new Error('Failed to retrieve holidays for previous year');
        }

        return `✅ Retrieved ${holidays.length} holidays for ${previousYear}`;
    }

    /**
     * Test 3: Next year holidays
     */
    async testNextYearHolidays() {
        const nextYear = new Date().getFullYear() + 1;
        const holidays = await this.brazilAPI.getHolidays(nextYear);
        
        if (!Array.isArray(holidays) || holidays.length === 0) {
            throw new Error('Failed to retrieve holidays for next year');
        }

        return `✅ Retrieved ${holidays.length} holidays for ${nextYear}`;
    }

    /**
     * Test 4: Holiday data structure validation
     */
    async testHolidayDataStructure() {
        const holidays = await this.brazilAPI.getHolidays();
        const firstHoliday = holidays[0];

        const requiredFields = ['date', 'name', 'type'];
        const missingFields = requiredFields.filter(field => !(field in firstHoliday));

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        return `✅ Holiday data structure valid. Sample: ${firstHoliday.name} on ${firstHoliday.date}`;
    }

    /**
     * Test 5: Holiday dates validation
     */
    async testHolidayDatesValidation() {
        const holidays = await this.brazilAPI.getHolidays();
        const invalidDates = holidays.filter(holiday => {
            const date = new Date(holiday.date);
            return isNaN(date.getTime());
        });

        if (invalidDates.length > 0) {
            throw new Error(`Found ${invalidDates.length} holidays with invalid dates`);
        }

        return `✅ All ${holidays.length} holiday dates are valid`;
    }

    /**
     * Test 6: Holiday names validation
     */
    async testHolidayNamesValidation() {
        const holidays = await this.brazilAPI.getHolidays();
        const invalidNames = holidays.filter(holiday => 
            !holiday.name || holiday.name.trim().length === 0
        );

        if (invalidNames.length > 0) {
            throw new Error(`Found ${invalidNames.length} holidays with invalid names`);
        }

        return `✅ All ${holidays.length} holiday names are valid`;
    }

    /**
     * Test 7: API error handling
     */
    async testAPIErrorHandling() {
        try {
            // Test with invalid year (far future)
            await this.brazilAPI.getHolidays(3000);
            return `⚠️ API accepted invalid year (expected error handling might be lenient)`;
        } catch (error) {
            return `✅ API properly handles errors: ${error.message}`;
        }
    }

    /**
     * Test 8: Cache functionality
     */
    async testCacheability() {
        const year = new Date().getFullYear();
        
        // First call
        const start1 = Date.now();
        const holidays1 = await this.brazilAPI.getHolidays(year);
        const time1 = Date.now() - start1;

        // Second call (should be cached)
        const start2 = Date.now();
        const holidays2 = await this.brazilAPI.getHolidays(year);
        const time2 = Date.now() - start2;

        if (time2 >= time1) {
            throw new Error('Second call was not faster (cache not working)');
        }

        return `✅ Cache working: First call ${time1}ms, Second call ${time2}ms`;
    }

    /**
     * Test 9: Upcoming holidays functionality
     */
    async testUpcomingHolidays() {
        const holidays = await this.brazilAPI.getHolidays();
        const today = new Date();
        
        const upcomingHolidays = holidays.filter(holiday => {
            const holidayDate = new Date(holiday.date);
            return holidayDate >= today;
        });

        if (upcomingHolidays.length === 0) {
            // Check if we're at the end of the year
            const nextYearHolidays = await this.brazilAPI.getHolidays(today.getFullYear() + 1);
            if (nextYearHolidays.length > 0) {
                return `✅ No more holidays this year, but ${nextYearHolidays.length} found for next year`;
            } else {
                throw new Error('No upcoming holidays found');
            }
        }

        return `✅ Found ${upcomingHolidays.length} upcoming holidays`;
    }

    /**
     * Test 10: Holiday filtering by type
     */
    async testHolidayFiltering() {
        const holidays = await this.brazilAPI.getHolidays();
        
        // Group holidays by type
        const holidayTypes = {};
        holidays.forEach(holiday => {
            if (!holidayTypes[holiday.type]) {
                holidayTypes[holiday.type] = 0;
            }
            holidayTypes[holiday.type]++;
        });

        const typeCount = Object.keys(holidayTypes).length;
        const typesSummary = Object.entries(holidayTypes)
            .map(([type, count]) => `${type}: ${count}`)
            .join(', ');

        return `✅ Found ${typeCount} holiday types: ${typesSummary}`;
    }

    /**
     * Log test result
     */
    logTestResult(testName, passed, message) {
        const result = {
            test: testName,
            passed,
            message,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.push(result);
        
        const status = passed ? '✅ PASS' : '❌ FAIL';
        console.log(`${status}: ${message}`);
    }

    /**
     * Display test summary
     */
    displayTestSummary() {
        console.log('\n' + '=' .repeat(50));
        console.log('🇧🇷 BRAZIL HOLIDAYS API TEST SUMMARY');
        console.log('=' .repeat(50));

        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;

        console.log(`📊 Total Tests: ${totalTests}`);
        console.log(`✅ Passed: ${passedTests}`);
        console.log(`❌ Failed: ${failedTests}`);
        console.log(`📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

        if (failedTests > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.testResults
                .filter(r => !r.passed)
                .forEach(result => {
                    console.log(`- ${result.test}: ${result.message}`);
                });
        }

        console.log('\n🎯 TEST COMPLETED');
        
        // Store results for later analysis
        if (typeof window !== 'undefined') {
            window.brazilHolidaysTestResults = this.testResults;
        }
        
        return {
            total: totalTests,
            passed: passedTests,
            failed: failedTests,
            successRate: Math.round((passedTests / totalTests) * 100),
            results: this.testResults
        };
    }

    /**
     * Get specific holiday information
     */
    async demonstrateHolidayData() {
        console.log('\n🎪 HOLIDAY DATA DEMONSTRATION');
        console.log('=' .repeat(40));
        
        const holidays = await this.brazilAPI.getHolidays();
        const today = new Date();
        
        // Show next 3 holidays
        const upcomingHolidays = holidays
            .filter(holiday => new Date(holiday.date) >= today)
            .slice(0, 3);

        if (upcomingHolidays.length > 0) {
            console.log('📅 Next Upcoming Holidays:');
            upcomingHolidays.forEach((holiday, index) => {
                const date = new Date(holiday.date);
                const daysUntil = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
                console.log(`${index + 1}. ${holiday.name}`);
                console.log(`   📅 Date: ${holiday.date}`);
                console.log(`   📝 Type: ${holiday.type}`);
                console.log(`   ⏰ Days until: ${daysUntil}`);
                console.log('');
            });
        }

        // Show major holidays for current year
        const majorHolidays = holidays.filter(holiday => 
            ['Natal', 'Ano novo', 'Independência', 'Proclamação da República', 'Tiradentes'].some(name => 
                holiday.name.toLowerCase().includes(name.toLowerCase())
            )
        );

        if (majorHolidays.length > 0) {
            console.log('🇧🇷 Major Brazilian Holidays This Year:');
            majorHolidays.forEach(holiday => {
                console.log(`• ${holiday.name} - ${holiday.date}`);
            });
        }
    }
}

// Auto-run tests if script is loaded in browser
if (typeof window !== 'undefined') {
    window.BrazilHolidaysTester = BrazilHolidaysTester;
    
    // Add test button to page if in browser
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('holidayTestButton')) {
            document.getElementById('holidayTestButton').addEventListener('click', async () => {
                const tester = new BrazilHolidaysTester();
                await tester.runAllTests();
                await tester.demonstrateHolidayData();
            });
        }
    });
}

// Export for Node.js if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrazilHolidaysTester;
}
