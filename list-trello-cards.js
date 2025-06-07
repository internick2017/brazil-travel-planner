#!/usr/bin/env node

require('dotenv').config();
const Trello = require('trello');

const trello = new Trello(process.env.TRELLO_API_KEY, process.env.TRELLO_TOKEN);

async function listAllCards() {
    try {
        console.log('🇧🇷 Brazil Travel Planner - Trello Board Analysis');
        console.log('================================================');
        
        // Get board info
        const board = await trello.makeRequest('get', `/1/boards/${process.env.TRELLO_BOARD_ID}`);
        console.log(`📋 Board: ${board.name}`);
        console.log(`🔗 URL: ${board.url}`);
        console.log('');
        
        // Get all lists
        const lists = await trello.makeRequest('get', `/1/boards/${process.env.TRELLO_BOARD_ID}/lists`);
        
        for (const list of lists) {
            console.log(`📝 LIST: ${list.name} (${list.id})`);
            console.log('─'.repeat(50));
            
            // Get cards in this list
            const cards = await trello.makeRequest('get', `/1/lists/${list.id}/cards`);
            
            if (cards.length === 0) {
                console.log('   (No cards in this list)');
            } else {
                for (const card of cards) {
                    console.log(`   ✓ ${card.name}`);
                    console.log(`     ID: ${card.id}`);
                    console.log(`     URL: ${card.url}`);
                    if (card.desc) {
                        console.log(`     Description: ${card.desc.substring(0, 100)}${card.desc.length > 100 ? '...' : ''}`);
                    }
                    console.log('');
                }
            }
            console.log('');
        }
        
        console.log('🎯 ANALYSIS COMPLETE');
        console.log('===================');
        
        // Count progress
        const todoCards = await trello.makeRequest('get', `/1/lists/${process.env.TODO_LIST_ID}/cards`);
        const inProgressCards = await trello.makeRequest('get', `/1/lists/${process.env.IN_PROGRESS_LIST_ID}/cards`);
        const doneCards = await trello.makeRequest('get', `/1/lists/${process.env.DONE_LIST_ID}/cards`);
        
        const total = todoCards.length + inProgressCards.length + doneCards.length;
        const completed = doneCards.length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        console.log(`📊 Project Progress: ${completed}/${total} cards completed (${progress}%)`);
        console.log(`📋 TO DO: ${todoCards.length} cards`);
        console.log(`⏳ IN PROGRESS: ${inProgressCards.length} cards`);
        console.log(`✅ DONE: ${doneCards.length} cards`);
        
    } catch (error) {
        console.error('❌ Error fetching Trello data:', error.message);
    }
}

listAllCards();
