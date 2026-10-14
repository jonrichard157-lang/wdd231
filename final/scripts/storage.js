/**
 * storage.js - LocalStorage Management for TechSparks Brasil
 * Manages client-side persistence of favorite startups.
 * WDD 231 Term Project | João Silva
 */

const STORAGE_KEY = 'techsparks_favorites';

/**
 * Retrieves the list of favorite startup IDs from localStorage.
 * @returns {string[]} Array of startup IDs.
 */
export function getFavorites() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading favorites from localStorage:', error);
        return [];
    }
}

/**
 * Checks whether a startup is currently favorited.
 * @param {string} startupId
 * @returns {boolean}
 */
export function isFavorite(startupId) {
    const favorites = getFavorites();
    return favorites.includes(startupId);
}

/**
 * Toggles a startup's favorite status and persists the change.
 * Dispatches a 'favoritesUpdated' custom event for reactive UI updates.
 * @param {string} startupId
 * @returns {boolean} True if favorited, false if removed.
 */
export function toggleFavorite(startupId) {
    let favorites = getFavorites();
    let isNowFavorite = false;

    if (favorites.includes(startupId)) {
        favorites = favorites.filter(id => id !== startupId);
        isNowFavorite = false;
    } else {
        favorites.push(startupId);
        isNowFavorite = true;
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        // Dispatch custom event to notify other modules
        window.dispatchEvent(new CustomEvent('favoritesUpdated', {
            detail: { favorites, count: favorites.length }
        }));
    } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
    }

    return isNowFavorite;
}

/**
 * Returns the total count of favorite startups.
 * @returns {number}
 */
export function getFavoritesCount() {
    return getFavorites().length;
}
