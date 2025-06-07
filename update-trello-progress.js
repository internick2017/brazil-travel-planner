#!/usr/bin/env node

require('dotenv').config();
const Trello = require('trello');

const trello = new Trello(process.env.TRELLO_API_KEY, process.env.TRELLO_TOKEN);

// Cards that should be moved to DONE based on our actual progress
const COMPLETED_CARDS = [
    // Phase 1: Project Setup (COMPLETED)
    "68423524c89b2613e8e55967", // Test Visual Crossing Current Weather Endpoint
    "68423546571dc3f14a2fb588", // Project Repository Initialization  
    "6842354bd2f8189b3396c734", // Initial Git Commit and Branch Setup
    
    // Phase 2: HTML Structure (COMPLETED)
    "68442a319d6c1464e547ffd1", // Create index.html Structure
    "68442a4b513b21140df80980", // Develop destinations.html Layout
    "68442a5a124041fb16e412c8", // Build planner.html Interface
    "68442a5bb676ed2c5820f6c0", // Design about.html Content
    
    // Phase 3: CSS Styling (COMPLETED)
    "68442a6aa3061e7776dc0422", // Implement Responsive Navigation Bar
    "68442a8d8e3ccc3bc7c82f8e", // Define Global Styles (styles.css)
    "68442a970bc91c7fc3efe6a3", // Implement Responsive Design (responsive.css)
    "68442aa8c7dd80215517a1b5", // Style Reusable Components (buttons, cards)
    "68442abf5771517b2bd5fb6d", // Apply Graphic Identity Color Scheme
    "68442ac3bc4fe828b19811ac", // Implement Card Rounded Corners and Shadows
    
    // Phase 4: JavaScript Core (COMPLETED)
    "68442b97d3d308a61c63be6e", // Weather API Integration (weather.js - Visual Crossing)
    "68442b97727a24dc5558d12e", // Holiday Calendar Integration (holidays.js) - Now brazil.js
    "68442b97124041fb16e63722", // REST Countries API Integration (countries.js)
    "68442b98064fc5830082c064", // Main App Logic (main.js)
    
    // Phase 5: Testing (COMPLETED)
    "68442bb60f206da9dd8cfaf4", // API Data Integrity Testing
    
    // Documentation
    "68442bc2d89811e7d08bdf72", // README Documentation
];

// Cards that should be moved to IN PROGRESS (partially done)
const IN_PROGRESS_CARDS = [
    "68442b9847f517c72d29a63c", // Interactive Map Initialization (map.js) - Not started yet
    "68442ba955554bf6a1d217a4", // Implement Weather-Based Destination Finder - Partially done
];

// Cards that are not started (should stay in TO DO)
const TODO_CARDS = [
    // APIs we decided not to use
    "684235328a5b57918f4f3123", // Register for Brazil Holidays API (ZylaLabs) - Using BrazilAPI instead
    "6842353ccc18fe3fd61a83c7", // Test Brazil Holidays National Endpoint - Using BrazilAPI instead
    
    // Advanced features not implemented yet
    "68442b98c458ad29d418c02f", // Utility Functions (utils.js)
    "68442baaae33a0ac7e33ef53", // Develop Holiday-Aware Travel Calendar
    "68442baae1f8df8dcb29649e", // Build Regional Weather Comparison
    "68442baa11ac7a1f6eb41019", // Create Best Travel Dates Calculator
    "68442bab7e2d520510f46408", // Implement Weather Alert System (basic)
    "68442babc619026d553006fb", // Design Brazilian State Explorer UI
    "68442babc18ef7152fa22d76", // Implement Seasonal Activity Recommendations
    "68442bacf022d31eefac52c6", // Develop Multi-City Trip Planner Logic
    "68442bac70f271d42fab509c", // Create Climate Zone Information Module
    "68442bace5fd2456a3bb2867", // Implement Regional Holiday Calendar
    
    // Testing
    "68442bb577ad7bc6bd9b904d", // Cross-Browser Compatibility Testing (HTML/CSS)
    "68442bb53090d79efbfb568b", // Mobile Responsiveness Testing
    "68442bb667c583c34f033394", // Functional Testing (All 10 Features)
    "68442bb67cddacb96dbd4d42", // User Flow Testing
    
    // Polish & Optimization
    "68442bc00536e06177e9e939", // Implement UI Animations and Transitions
    "68442bc00f0cd6e96254d030", // Optimize Image Assets
    "68442bc0b64fc670575dbf2b", // Code Refactoring and Cleanup
    "68442bc1ab50cfd45082517e", // Performance Profiling and Optimization
    "68442bc1a5201a0f75bba89b", // Final Deployment Preparation
];

async function updateCardPositions() {
    try {
        console.log('🇧🇷 Brazil Travel Planner - Card Position Update');
        console.log('================================================');
        
        let moveCount = 0;
        
        // Move completed cards to DONE
        console.log('✅ Moving completed cards to DONE...');
        for (const cardId of COMPLETED_CARDS) {
            try {
                await trello.makeRequest('put', `/1/cards/${cardId}/idList`, { value: process.env.DONE_LIST_ID });
                console.log(`   ✓ Moved card ${cardId} to DONE`);
                moveCount++;
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.log(`   ❌ Failed to move card ${cardId}: ${error.message}`);
            }
        }
        
        // Move in-progress cards to IN PROGRESS
        console.log('⏳ Moving in-progress cards to IN PROGRESS...');
        for (const cardId of IN_PROGRESS_CARDS) {
            try {
                await trello.makeRequest('put', `/1/cards/${cardId}/idList`, { value: process.env.IN_PROGRESS_LIST_ID });
                console.log(`   ✓ Moved card ${cardId} to IN PROGRESS`);
                moveCount++;
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.log(`   ❌ Failed to move card ${cardId}: ${error.message}`);
            }
        }
        
        console.log('');
        console.log('📊 UPDATE SUMMARY');
        console.log('=================');
        console.log(`✅ Successfully moved ${moveCount} cards`);
        console.log(`📋 Expected new totals:`);
        console.log(`   - TO DO: ${TODO_CARDS.length} cards`);
        console.log(`   - IN PROGRESS: ${IN_PROGRESS_CARDS.length} cards`);
        console.log(`   - DONE: ${COMPLETED_CARDS.length + 1} cards (including existing API Integration)`);
        
        const total = TODO_CARDS.length + IN_PROGRESS_CARDS.length + COMPLETED_CARDS.length + 1;
        const completed = COMPLETED_CARDS.length + 1;
        const progress = Math.round((completed / total) * 100);
        
        console.log(`📈 New project progress: ${completed}/${total} cards (${progress}%)`);
        
        console.log('');
        console.log('🎯 MAJOR ACCOMPLISHMENTS RECOGNIZED:');
        console.log('- ✅ Complete project setup with Git');
        console.log('- ✅ Full HTML structure (4 pages)');
        console.log('- ✅ Complete CSS styling system');
        console.log('- ✅ All 3 APIs integrated and working');
        console.log('- ✅ Core JavaScript functionality');
        console.log('- ✅ API testing completed');
        console.log('- ✅ Documentation updated');
        console.log('- ✅ Trello automation implemented');
        
    } catch (error) {
        console.error('❌ Error updating card positions:', error.message);
    }
}

updateCardPositions();
