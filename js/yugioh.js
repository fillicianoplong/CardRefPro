import { TCG_CONFIG } from "./config.js";

let allData = [];
let filteredData = [];
let currentPage = 1
const cardsPerPage = TCG_CONFIG.yugioh.itemsPerPage;
const url = TCG_CONFIG.yugioh.baseUrl;

export async function getData() {
    try {
        console.log("Fetching from: ", url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.data) {
            throw new Error("Error: Invalid data structure received");
        }
        
        return data.data;
    }
    catch (error) {
        console.error("Error: ", error);
    }
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

<<<<<<< HEAD
=======
    // Apply search type filter if applicable
    const searchType = document.getElementById('search-type').value;

    // Filter cards based on search term
>>>>>>> 93950c5 (Added new search type methods)
    filteredData = allData.filter(card => {
        if (searchType === "name") {
            const searchMatches = card.name && card.name.toLowerCase().includes(searchTerm);
            return searchMatches;
        } else if (searchType === "desc") {
            const searchMatches = card.desc && card.desc.toLowerCase().includes(searchTerm);
            return searchMatches;
        } else if (searchType === "type") { 
            const searchMatches = card.type && card.type.toLowerCase().includes(searchTerm);
            return searchMatches;
        } else if (searchType === "attribute") {
            const searchMatches = card.attribute && card.attribute.toLowerCase().includes(searchTerm);
            return searchMatches;
        } else if (searchType === "race") {
            const searchMatches = card.race && card.race.toLowerCase().includes(searchTerm);
            return searchMatches;
        }

        return searchMatches;
    });

    updateURL(1);
    updatePageDropdown();
    renderPage(1);
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

    console.log(filteredData.length);

    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const cardsToDisplay = filteredData.slice(start, end);

    displayCards(cardsToDisplay);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupSystemListeners() {
    window.addEventListener('popstate', () => {
        currentPage = getPageFromURL();
        renderPage(currentPage);
        updatePageDropdown();
    })

    const searchInput = document.getElementById('search-input');
    if(searchInput) {
        searchInput.addEventListener('input', () => {
            applyFilters();
        });
    }

    const nextBtn = document.getElementById('next-btn');
    nextBtn.addEventListener('click', nextPage);

    const prevBtn = document.getElementById('prev-btn');
    prevBtn.addEventListener('click', prevPage);

<<<<<<< HEAD
=======
    // Search type listener
    const searchType = document.getElementById('search-type');  
    addEventListener('change', updatePlaceholder);
    

    // Page dropdown listener
>>>>>>> 93950c5 (Added new search type methods)
    const pageDropdown = document.getElementById('page-dropdown');
    pageDropdown.addEventListener('change', goToPage);
}

function nextPage() {
    if(currentPage < getPageTotal()) {
        currentPage += 1;
        updateURL(currentPage);
        updatePageDropdown();
        renderPage(currentPage);
    }
}

function prevPage() {
    if(currentPage > 1) {
        currentPage -= 1;
        updateURL(currentPage);
        updatePageDropdown();
        renderPage(currentPage);
    }
}

function goToPage() {
    currentPage = parseInt(document.getElementById('page-dropdown').value);
    updateURL(currentPage);
    updatePageDropdown();
    renderPage(currentPage);
}

function updatePlaceholder() {
    // Updates the search input placeholder based on the selected search type
    const searchType = document.getElementById('search-type').value;
    const searchInput = document.getElementById('search-input');

    if(searchType === 'name') {
        searchInput.placeholder = 'Search by name...';
    } else if(searchType === 'desc') {
        searchInput.placeholder = 'Search by description...';
    } else if(searchType === 'type') {
        searchInput.placeholder = 'Search by type...';
    } else if(searchType === 'race') {
        searchInput.placeholder = 'Search by race...';
    } else if(searchType === 'attribute') {
        searchInput.placeholder = 'Search by attribute...';
    }
}

function updatePageDropdown() {
    document.getElementById('page-dropdown').value = currentPage;
}

function setupPageDropdown() {
    let pageDropdown = document.getElementById("page-dropdown");
    for(let i = 1; i <= getPageTotal(); i++) {
        pageDropdown.appendChild(createPageOption(i));
    }
}

function createPageOption(value) {
    let option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    return option;
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
    return Math.ceil(filteredData.length/cardsPerPage);
}

async function init() {
    allData = await getData();
    filteredData = [...allData];
    
    currentPage = getPageFromURL();

    updateURL(currentPage);
    setupPageDropdown();
    setupSystemListeners();
    updatePlaceholder();
    updatePageDropdown();
    renderPage(currentPage);
}

init();