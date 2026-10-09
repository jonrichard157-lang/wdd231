// ==========================================================================
// WDD 231 - Chamber of Commerce: Discover Page Module Script (discover.js)
// ==========================================================================

import { items } from '../data/items.mjs';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Discover Cards
    const cardsContainer = document.querySelector('#discover-grid');
    if (cardsContainer && Array.isArray(items)) {
        cardsContainer.innerHTML = '';

        items.forEach((item, index) => {
            const card = document.createElement('article');
            card.classList.add('discover-card', `card${index + 1}`);
            card.setAttribute('id', `card${index + 1}`);

            card.innerHTML = `
                <h2>${item.name}</h2>
                <figure>
                    <img src="${item.image}" alt="${item.alt || item.name}" width="300" height="200" loading="lazy">
                </figure>
                <address>${item.address}</address>
                <p>${item.description}</p>
                <button type="button" class="learn-more-btn">Learn More</button>
            `;

            cardsContainer.appendChild(card);
        });
    }

    // 2. localStorage Visit Tracking Message
    handleVisitMessage();
});

function handleVisitMessage() {
    const messageContainer = document.querySelector('#visitor-message');
    if (!messageContainer) return;

    const STORAGE_KEY = 'chamber_discover_last_visit';
    const lastVisit = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    const MS_IN_DAY = 1000 * 60 * 60 * 24;
    let messageText = '';

    if (!lastVisit) {
        // First visit
        messageText = "Welcome! Let us know if you have any questions.";
    } else {
        const timeDiff = now - parseInt(lastVisit, 10);
        const daysDiff = Math.floor(timeDiff / MS_IN_DAY);

        if (timeDiff < MS_IN_DAY) {
            // Less than a day
            messageText = "Back so soon! Awesome!";
        } else if (daysDiff === 1) {
            messageText = "You last visited 1 day ago.";
        } else {
            messageText = `You last visited ${daysDiff} days ago.`;
        }
    }

    // Render the message with an optional dismiss/close button
    messageContainer.innerHTML = `
        <div class="visit-banner">
            <span class="visit-icon" aria-hidden="true">&#128075;</span>
            <p class="visit-text">${messageText}</p>
            <button class="close-banner-btn" aria-label="Dismiss message">&times;</button>
        </div>
    `;

    const closeBtn = messageContainer.querySelector('.close-banner-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            messageContainer.style.display = 'none';
        });
    }

    // Update localStorage with current timestamp in milliseconds
    localStorage.setItem(STORAGE_KEY, now.toString());
}
