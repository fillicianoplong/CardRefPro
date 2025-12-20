import { TCG_CONFIG } from "./config.js";

let cards = [];
let currentPage = 1
const cardsPerPage = TCG_CONFIG.yugioh.itemsPerPage;

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

function renderPage(page) {
    const grid = document.getElementById("card-grid");
    grid.innerHTML = "";

    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;

    const cardsToDisplay = cards.slice(start, end);

    cardsToDisplay.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <img src="${card.card_images[0].image_url}" alt="${card.name}">
        `;
        grid.appendChild(cardElement);
    });
}

async function init() {
    cards = await getCards(); 
    renderPage(currentPage);
}

init();