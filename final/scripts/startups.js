/**
 * startups.js - Catalog Controller Module for TechSparks Brasil
 * Handles dynamic content rendering (18 items), array filtering/sorting,
 * localStorage favorites toggling, view modes, and modal integration.
 * WDD 231 Term Project | João Silva
 */

import { fetchStartups } from './data-service.js';
import { isFavorite, toggleFavorite } from './storage.js';
import { initModal, openStartupModal } from './modal.js';

// Application State
let allStartups = [];
let currentCategory = 'all';
let currentSearchTerm = '';
let currentStage = 'all';
let currentSort = 'name-asc';
let showOnlyFavorites = false;
let currentViewMode = 'grid';

document.addEventListener('DOMContentLoaded', async () => {
    initModal();
    setupControls();
    await loadCatalog();
});

/**
 * Loads the startup data asynchronously and triggers initial render.
 */
async function loadCatalog() {
    const container = document.getElementById('startups-container');
    if (!container) return;

    container.innerHTML = '<p class="loading-state">Loading verified startups from database...</p>';

    allStartups = await fetchStartups();

    if (allStartups.length === 0) {
        container.innerHTML = '<p class="error-state">Failed to load startups. Please check your internet connection or try again later.</p>';
        return;
    }

    applyFiltersAndRender();
}

/**
 * Binds UI event listeners to controls (search, category pills, stage select, sort, view toggles).
 */
function setupControls() {
    // Search input with live text filtering
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            currentSearchTerm = event.target.value.trim().toLowerCase();
            applyFiltersAndRender();
        });
    }

    // Category filter pills
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category || 'all';
            applyFiltersAndRender();
        });
    });

    // Funding stage select dropdown
    const stageSelect = document.getElementById('stage-select');
    if (stageSelect) {
        stageSelect.addEventListener('change', (event) => {
            currentStage = event.target.value;
            applyFiltersAndRender();
        });
    }

    // Sort select dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (event) => {
            currentSort = event.target.value;
            applyFiltersAndRender();
        });
    }

    // Favorites only toggle button
    const favFilterBtn = document.getElementById('fav-filter-btn');
    if (favFilterBtn) {
        favFilterBtn.addEventListener('click', () => {
            showOnlyFavorites = !showOnlyFavorites;
            favFilterBtn.classList.toggle('active', showOnlyFavorites);
            favFilterBtn.innerHTML = showOnlyFavorites 
                ? '&#10084; Showing Favorites' 
                : '&#9825; Favorites Only';
            applyFiltersAndRender();
        });
    }

    // Grid vs List view buttons
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    const container = document.getElementById('startups-container');

    if (gridBtn && listBtn && container) {
        gridBtn.addEventListener('click', () => {
            currentViewMode = 'grid';
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
            container.classList.remove('list');
            container.classList.add('grid');
        });

        listBtn.addEventListener('click', () => {
            currentViewMode = 'list';
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
            container.classList.remove('grid');
            container.classList.add('list');
        });
    }

    // Listen to favorites updates from storage to update heart states if changed from modal
    window.addEventListener('favoritesUpdated', () => {
        updateCardFavoriteIcons();
        if (showOnlyFavorites) {
            applyFiltersAndRender();
        }
    });
}

/**
 * Filters and sorts the startups array using JavaScript array methods (.filter, .sort).
 */
function applyFiltersAndRender() {
    // Array Method 1: .filter() for categories, search query, stage, and favorites
    let filtered = allStartups.filter(startup => {
        // Category filter
        const matchesCategory = currentCategory === 'all' || startup.category.toLowerCase() === currentCategory.toLowerCase();

        // Stage filter
        const matchesStage = currentStage === 'all' || startup.stage.toLowerCase().includes(currentStage.toLowerCase());

        // Search text filter
        const matchesSearch = currentSearchTerm === '' ||
            startup.name.toLowerCase().includes(currentSearchTerm) ||
            startup.tagline.toLowerCase().includes(currentSearchTerm) ||
            startup.headquarters.toLowerCase().includes(currentSearchTerm) ||
            startup.category.toLowerCase().includes(currentSearchTerm);

        // Favorites filter (localStorage)
        const matchesFavorites = !showOnlyFavorites || isFavorite(startup.id);

        return matchesCategory && matchesStage && matchesSearch && matchesFavorites;
    });

    // Array Method 2: .sort() for sorting criteria
    filtered.sort((a, b) => {
        switch (currentSort) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'founded-desc':
                return b.founded - a.founded;
            case 'founded-asc':
                return a.founded - b.founded;
            default:
                return 0;
        }
    });

    renderCards(filtered);
    updateResultsCount(filtered.length, allStartups.length);
}

/**
 * Updates the results counter text.
 */
function updateResultsCount(currentCount, totalCount) {
    const counter = document.getElementById('results-count');
    if (counter) {
        counter.textContent = `Showing ${currentCount} of ${totalCount} startups`;
    }
}

/**
 * Renders startup cards dynamically using Template Literals.
 * Displays at least 4 distinct data properties/values per item.
 * @param {Array} startups
 */
function renderCards(startups) {
    const container = document.getElementById('startups-container');
    if (!container) return;

    if (startups.length === 0) {
        container.innerHTML = `
            <div class="no-results-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
                <h3>No startups matched your current criteria</h3>
                <p>Try resetting your search query or selecting a different category filter.</p>
                <button type="button" id="reset-filters-btn" class="btn-primary" style="margin-top: 0.75rem;">Reset All Filters</button>
            </div>
        `;
        const resetBtn = document.getElementById('reset-filters-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetFilters);
        }
        return;
    }

    // Dynamic generation using .map() and template literals
    container.innerHTML = startups.map(startup => {
        const favActive = isFavorite(startup.id);

        return `
            <article class="startup-card" data-id="${startup.id}">
                <div class="card-image-wrap">
                    <img src="${startup.image}" alt="${startup.name} company emblem banner" width="400" height="250" loading="lazy">
                    <span class="card-badge">${startup.category}</span>
                    <button type="button" class="favorite-toggle-btn ${favActive ? 'is-fav' : ''}" data-id="${startup.id}" aria-label="Toggle ${startup.name} favorite status">
                        ${favActive ? '&#10084;' : '&#9825;'}
                    </button>
                </div>
                <div class="card-content">
                    <div class="card-header-row">
                        <h2 class="startup-title">${startup.name}</h2>
                        <span class="startup-stage-pill">${startup.stage}</span>
                    </div>
                    <p class="startup-tagline">${startup.tagline}</p>
                    
                    <!-- 4 distinct data properties/values -->
                    <div class="card-specs">
                        <div class="spec-item">
                            <span class="spec-title">Headquarters</span>
                            <span class="spec-value">${startup.headquarters}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-title">Founded</span>
                            <span class="spec-value">${startup.founded}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-title">Capital Raised</span>
                            <span class="spec-value">${startup.totalFunding}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-title">Team Scale</span>
                            <span class="spec-value">${startup.teamSize}</span>
                        </div>
                    </div>

                    <div class="card-metric-highlight">
                        &#9889; ${startup.keyMetric}
                    </div>

                    <div class="card-actions">
                        <button type="button" class="btn-details" data-id="${startup.id}">
                            View Full Pitch &rarr;
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    // Attach click listeners to cards
    attachCardListeners();
}

/**
 * Attaches event listeners for favorite buttons and modal detail buttons.
 */
function attachCardListeners() {
    // Favorite toggle buttons
    const favButtons = document.querySelectorAll('.favorite-toggle-btn');
    favButtons.forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            const startupId = btn.dataset.id;
            const isNowFav = toggleFavorite(startupId);
            btn.classList.toggle('is-fav', isNowFav);
            btn.innerHTML = isNowFav ? '&#10084;' : '&#9825;';
            if (showOnlyFavorites) {
                applyFiltersAndRender();
            }
        });
    });

    // Detail modal buttons
    const detailButtons = document.querySelectorAll('.btn-details');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const startupId = btn.dataset.id;
            const startup = allStartups.find(item => item.id === startupId);
            if (startup) {
                openStartupModal(startup);
            }
        });
    });
}

/**
 * Updates heart icons on all rendered cards to reflect current localStorage state.
 */
function updateCardFavoriteIcons() {
    const favButtons = document.querySelectorAll('.favorite-toggle-btn');
    favButtons.forEach(btn => {
        const startupId = btn.dataset.id;
        const fav = isFavorite(startupId);
        btn.classList.toggle('is-fav', fav);
        btn.innerHTML = fav ? '&#10084;' : '&#9825;';
    });
}

/**
 * Resets all search and filter controls to default.
 */
function resetFilters() {
    currentCategory = 'all';
    currentSearchTerm = '';
    currentStage = 'all';
    currentSort = 'name-asc';
    showOnlyFavorites = false;

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === 'all');
    });

    const stageSelect = document.getElementById('stage-select');
    if (stageSelect) stageSelect.value = 'all';

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = 'name-asc';

    const favFilterBtn = document.getElementById('fav-filter-btn');
    if (favFilterBtn) {
        favFilterBtn.classList.remove('active');
        favFilterBtn.innerHTML = '&#9825; Favorites Only';
    }

    applyFiltersAndRender();
}
