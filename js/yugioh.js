import { TCG_CONFIG } from "./config.js";

let allData = [];
let filteredData = [];
let currentPage = 1
const cardsPerPage = TCG_CONFIG.yugioh.itemsPerPage;
const url = TCG_CONFIG.yugioh.baseUrl;

export async function getData() {
    // Fetches Yu-Gi-Oh card data from the API
    try {
        // Fetch data from the API
        console.log("Fetching from: ", url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Validate the data structure
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
    // Applies search filters to the card data based on user input
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    // Filter cards based on search term
    filteredData = allData.filter(card => {
        const searchMatches = card.name.toLowerCase().includes(searchTerm);

        return searchMatches;
    });
    
    // Reset to first page and update UI
    currentPage = 1;
    updateURL(currentPage);
    setupPageDropdown();
    updatePageDropdown();
    renderPage(1);
}

function displayCards(cards) {
    // Renders the card grid with small card images
    const grid = document.getElementById("card-grid");
    grid.innerHTML = "";

    // Create and append card elements
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <img src="${card.card_images[0].image_url_small}" alt="${card.name}">
        `;
        // Add click handler to open modal
        cardElement.addEventListener('click', () => {
            displayCardModal(card.card_images[0].image_url, card.name);
        });
        grid.appendChild(cardElement);
    });
}

function displayCardModal(imageUrl, cardName) {
    // Displays a modal with the full-size card image
    if (document.querySelector('.card-modal-overlay')) return;

    // Prevent body scrolling and save initial overflow state
    const initOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Create and append overlay
    const overlay = document.createElement('div');
    overlay.className = 'card-modal-overlay';
    document.body.appendChild(overlay);

    // Create and append modal with image
    const modal = document.createElement('div');
    modal.className = 'card-modal';
    modal.innerHTML = `<img src="${imageUrl}" alt="${cardName}">`;
    document.body.appendChild(modal);

    // Add click handler to close modal
    overlay.addEventListener('click', closeCardModal);

    function closeCardModal() {
        overlay.remove();
        modal.remove();
        document.body.style.overflow = initOverflow || '';
    }
}

function renderPage(page) {
    // Renders the specified page of filtered cards
    const grid = document.getElementById("card-grid");
    grid.innerHTML = "";

    console.log(filteredData.length);

    // Calculate pagination indices
    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const cardsToDisplay = filteredData.slice(start, end);

    // Display the cards and scroll to top
    displayCards(cardsToDisplay);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupSystemListeners() {
    // Sets up event listeners for search, navigation, and URL changes
    // Handle browser back/forward navigation
    window.addEventListener('popstate', () => {
        currentPage = getPageFromURL();
        renderPage(currentPage);
        updatePageDropdown();
    })

    // Search input listener
    const searchInput = document.getElementById('search-input');
    if(searchInput) {
        searchInput.addEventListener('input', () => {
            applyFilters();
        });
    }

    // Navigation button listeners
    const nextBtn = document.getElementById('next-btn');
    nextBtn.addEventListener('click', nextPage);

    const prevBtn = document.getElementById('prev-btn');
    prevBtn.addEventListener('click', prevPage);

    // Page dropdown listener
    const pageDropdown = document.getElementById('page-dropdown');
    pageDropdown.addEventListener('change', goToPage);
}

function nextPage() {
    // Navigates to the next page if available
    if(currentPage < getPageTotal()) {
        currentPage += 1;
        updateURL(currentPage);
        updatePageDropdown();
        renderPage(currentPage);
    }
}

function prevPage() {
    // Navigates to the previous page if available
    if(currentPage > 1) {
        currentPage -= 1;
        updateURL(currentPage);
        updatePageDropdown();
        renderPage(currentPage);
    }
}

function goToPage() {
    // Navigates to the selected page from the dropdown
    currentPage = parseInt(document.getElementById('page-dropdown').value);
    updateURL(currentPage);
    updatePageDropdown();
    renderPage(currentPage);
}

function updatePageDropdown() {
    // Updates the page dropdown to reflect the current page
    document.getElementById('page-dropdown').value = currentPage;
}

function setupPageDropdown() {
    // Populates the page dropdown with all available page numbers
    let pageDropdown = document.getElementById("page-dropdown");
    for(let i = 1; i <= getPageTotal(); i++) {
        pageDropdown.appendChild(createPageOption(i));
    }
}

function createPageOption(value) {
    // Creates an option element for the page dropdown
    let option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    return option;
}

function updateURL(page) {
    // Updates the URL with the current page number
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);
}

function getPageFromURL() {
    // Extracts the current page number from the URL parameters
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('page')) || 1;
}

function getPageTotal() {
    // Calculates the total number of pages based on filtered data
    return Math.ceil(filteredData.length/cardsPerPage);
}

async function init() {
    // Initializes the application by loading data and setting up UI
    // Load card data from API
    allData = await getData();
    filteredData = [...allData];
    
    // Get initial page from URL or default to 1
    currentPage = getPageFromURL();

    // Set up initial UI state
    updateURL(currentPage);
    setupPageDropdown();
    setupSystemListeners();
    updatePageDropdown();
    renderPage(currentPage);
}

init();