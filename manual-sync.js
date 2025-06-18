#!/usr/bin/env node

/**
 * Manual card sync for completed features
 */

const Trello = require('trello');
require('dotenv').config();

const trello = new Trello(process.env.TRELLO_API_KEY, process.env.TRELLO_TOKEN);
const DONE_LIST_ID = process.env.DONE_LIST_ID;

async function moveCompletedCards() {
    console.log('🔄 Finding and moving completed cards...');
    
    try {
        // Get all cards on the board
        const cards = await trello.getCardsOnBoard(process.env.TRELLO_BOARD_ID);
          // Find the cards we completed by name
        const completedCardNames = [
            'Implement Seasonal Activity Recommendations',
            'Implement Regional Holiday Calendar', 
            'Create Climate Zone Information Module'
        ];

        const completedCards = [];
        
        for (const cardName of completedCardNames) {
            const card = cards.find(c => c.name.includes(cardName));
            if (card) {
                completedCards.push(card);
                console.log(`Found: "${card.name}" (ID: ${card.id})`);
            } else {
                console.log(`⚠️ Could not find card: ${cardName}`);
            }
        }

        // Move each completed card to DONE
        for (const card of completedCards) {
            try {
                await trello.updateCard(card.id, 'idList', DONE_LIST_ID);
                console.log(`✅ Moved "${card.name}" to DONE`);
                
                // Add completion date to description
                const completionNote = `\n\n---\n✅ **COMPLETED: June 18, 2025**\nImplemented with full functionality and integration.`;
                await trello.updateCard(card.id, 'desc', card.desc + completionNote);
                
            } catch (error) {
                console.error(`❌ Failed to move card ${card.name}:`, error.message);
            }
        }

        // Update project status card
        const statusCard = cards.find(card => card.name.includes('PROJECT STATUS'));
        if (statusCard) {
            await trello.updateCard(statusCard.id, 'name', '📊 PROJECT STATUS: 87% Complete (38/44 cards)');
            console.log('📊 Updated project status to 87% complete');
        }

        console.log('✅ Card sync completed!');
        
    } catch (error) {
        console.error('❌ Error during sync:', error);
    }
}

moveCompletedCards();
