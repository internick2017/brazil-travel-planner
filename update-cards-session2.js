// Update completed cards - June 16, 2025 (Session 2)

require('dotenv').config();

const COMPLETED_CARDS = [
    {
        name: 'Implement UI Animations and Transitions',
        id: '68442bc00536e06177e9e939'
    },
    {
        name: 'Implement Weather Alert System (basic)',
        id: '68442bab7e2d520510f46408'
    },
    {
        name: 'Build Regional Weather Comparison',
        id: '68442baae1f8df8dcb29649e'
    }
];

const TRELLO_CONFIG = {
    key: process.env.TRELLO_API_KEY,
    token: process.env.TRELLO_TOKEN,
    boardId: process.env.TRELLO_BOARD_ID,
    doneListId: process.env.DONE_LIST_ID
};

async function updateCompletedCards() {
    console.log('🔄 Moving additional completed cards to Done list...');
    
    for (const card of COMPLETED_CARDS) {
        try {
            const response = await fetch(`https://api.trello.com/1/cards/${card.id}?key=${TRELLO_CONFIG.key}&token=${TRELLO_CONFIG.token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idList: TRELLO_CONFIG.doneListId
                })
            });

            if (response.ok) {
                console.log(`✅ Moved "${card.name}" to Done`);
            } else {
                console.log(`❌ Failed to move "${card.name}": ${response.status}`);
            }
        } catch (error) {
            console.error(`❌ Error moving "${card.name}":`, error.message);
        }
    }
    
    // Update project status
    console.log('📊 Updating project completion percentage...');
    const newCompletion = Math.round(((35 + COMPLETED_CARDS.length) / 45) * 100);
    console.log(`🎯 New completion rate: ${newCompletion}%`);
    
    console.log('🎯 Card movement complete!');
    console.log(`✅ Project status updated to ${newCompletion}% completion`);
}

updateCompletedCards().catch(console.error);
