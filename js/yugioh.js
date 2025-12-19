import { TCG_CONFIG } from "./config.js";

async function getCards() {
    const url = TCG_CONFIG.yugioh.baseUrl;
    console.log("Fetching from:", url);
    const response = await fetch(url);
    const data = await response.json();
    return data;
}