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

function displayCards(cards) {
    const grid = document.getElementById("card-grid");
    grid.innerHTML = "";

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <img src="${card.card_images[0].image_url_small}" alt="${card.name}">
        `;
        grid.appendChild(cardElement);
    });
}

function renderPage(page) {
    const grid = document.getElementById("card-grid");
    grid.innerHTML = "";

    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;

    const cardsToDisplay = cards.slice(start, end);

    displayCards(cardsToDisplay);
    updateURL(page);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupSystemListeners() {
    const nextBtn = document.getElementById('next-btn');
    nextBtn.addEventListener('click', nextPage);

    const prevBtn = document.getElementById('prev-btn');
    prevBtn.addEventListener('click', prevPage);
}

function nextPage() {
    if(currentPage < getPageTotal()) {
        currentPage += 1;
        renderPage(currentPage);
    }
}

function prevPage() {
    if(currentPage > 1) {
        currentPage -= 1;
        renderPage(currentPage);
    }
}

function updateURL(page) {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);
}

function getPageFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('page')) || 1;
}

function getPageTotal() {
    return Math.ceil(cards.length/cardsPerPage);
}

async function init() {
    cards = await getCards();
    updateURL(currentPage);
    renderPage(currentPage);
    setupSystemListeners();
}

init();