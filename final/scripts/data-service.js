/**
 * data-service.js - Asynchronous Data Fetching for TechSparks Brasil
 * Retrieves startup data from JSON using Fetch API and try...catch.
 * WDD 231 Term Project | João Silva
 */

const DATA_URL = 'data/startups.json';

/**
 * Asynchronously fetches and parses the startup catalog data.
 * @returns {Promise<Array>} Resolves to an array of startup objects.
 */
export async function fetchStartups() {
    try {
        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! Failed to fetch data: status ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format: Expected an array of startups.');
        }

        return data;
    } catch (error) {
        console.error('DataService Error: Could not load startups.', error);
        // Rethrow or return empty array for graceful degradation
        return [];
    }
}

