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