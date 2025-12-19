import { TCG_CONFIG } from "./config.js";

export async function getCards() {
    try {
        const url = TCG_CONFIG.yugioh.baseUrl;
        console.log("Fetching from: ", url);
        const response = await fetch(url);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error("Error fetching cards: ", error);
    }
}

function displayCards(cards) {
    const grid = document.getElementById("card-grid");

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <img src="${card.card_images[0].image_url}" alt="${card.name}">
        `;
        grid.appendChild(cardElement);
    });
}

async function init() {
    const cards = await getCards(); 
    
    if (cards) {
        displayCards(cards); 
    }
}

init();