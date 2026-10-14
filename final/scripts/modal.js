/**
 * modal.js - Accessible Dialog Modal Management for TechSparks Brasil
 * Handles the <dialog> element, light-dismiss, and dynamic detail rendering.
 * Complies with W3C accessibility and Modern Web Guidance.
 * WDD 231 Term Project | João Silva
 */

import { isFavorite, toggleFavorite } from './storage.js';

let dialogElement = null;

/**
 * Initializes the modal dialog listeners including light-dismiss fallback.
 */
export function initModal() {
    dialogElement = document.getElementById('startup-modal');
    if (!dialogElement) return;

    // Light-dismiss click-outside fallback for browsers without closedby support
    if (!('closedBy' in HTMLDialogElement.prototype)) {
        dialogElement.addEventListener('click', (event) => {
            if (event.target !== dialogElement) return;

            const rect = dialogElement.getBoundingClientRect();
            const isInDialog = (
                rect.top <= event.clientY &&
                event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX &&
                event.clientX <= rect.left + rect.width
            );

            if (!isInDialog) {
                dialogElement.close();
            }
        });
    }

    // Modal close button inside header
    const closeBtn = dialogElement.querySelector('.modal-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            dialogElement.close();
        });
    }
}

/**
 * Opens the modal dialog and populates it with detailed startup metrics.
 * @param {Object} startup
 */
export function openStartupModal(startup) {
    if (!dialogElement) {
        initModal();
    }
    if (!dialogElement || !startup) return;

    const currentlyFav = isFavorite(startup.id);

    // Populate modal title and header
    const modalTitle = dialogElement.querySelector('#modal-title');
    if (modalTitle) modalTitle.textContent = startup.name;

    // Populate modal body content via template literals
    const modalContent = dialogElement.querySelector('#modal-dynamic-content');
    if (modalContent) {
        const foundersList = Array.isArray(startup.founders) ? startup.founders.join(', ') : 'Confidential';

        modalContent.innerHTML = `
            <div class="modal-badges">
                <span class="modal-tag category">${startup.category}</span>
                <span class="modal-tag stage">${startup.stage}</span>
                <span class="modal-tag hq">&#128205; ${startup.headquarters}</span>
            </div>

            <p class="modal-description"><strong>Overview:</strong> ${startup.description}</p>

            <div class="card-metric-highlight">
                &#9889; <strong>Key Ecosystem Metric:</strong> ${startup.keyMetric}
            </div>

            <div class="modal-specs-table">
                <div class="spec-item">
                    <span class="modal-spec-label">Founded</span>
                    <span class="modal-spec-data">${startup.founded}</span>
                </div>
                <div class="spec-item">
                    <span class="modal-spec-label">Total Capital Raised</span>
                    <span class="modal-spec-data">${startup.totalFunding}</span>
                </div>
                <div class="spec-item">
                    <span class="modal-spec-label">Team Scale</span>
                    <span class="modal-spec-data">${startup.teamSize}</span>
                </div>
                <div class="spec-item">
                    <span class="modal-spec-label">Business Model</span>
                    <span class="modal-spec-data">${startup.businessModel || 'B2B / SaaS'}</span>
                </div>
                <div class="spec-item full-width" style="grid-column: 1 / -1;">
                    <span class="modal-spec-label">Founders & Leadership</span>
                    <span class="modal-spec-data">${foundersList}</span>
                </div>
            </div>

            <div class="modal-footer">
                <a href="${startup.website}" target="_blank" rel="noopener noreferrer" class="btn-primary">
                    Visit Official Site &rarr;
                </a>
                <button type="button" id="modal-fav-toggle-btn" class="btn-secondary ${currentlyFav ? 'is-fav' : ''}">
                    ${currentlyFav ? '&#10084; Favorited' : '&#9825; Add to Favorites'}
                </button>
            </div>
        `;

        // Attach listener to favorite button inside the modal
        const modalFavBtn = modalContent.querySelector('#modal-fav-toggle-btn');
        if (modalFavBtn) {
            modalFavBtn.addEventListener('click', () => {
                const isNowFav = toggleFavorite(startup.id);
                modalFavBtn.classList.toggle('is-fav', isNowFav);
                modalFavBtn.innerHTML = isNowFav ? '&#10084; Favorited' : '&#9825; Add to Favorites';
            });
        }
    }

    dialogElement.showModal();
}
