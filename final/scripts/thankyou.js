/**
 * thankyou.js - Form Action Display Controller for TechSparks Brasil
 * Dynamically parses GET query parameters with URLSearchParams and renders the confirmation summary.
 * WDD 231 Term Project | João Silva
 */

document.addEventListener('DOMContentLoaded', () => {
    renderSubmissionSummary();
});

/**
 * Extracts and renders submitted pitch application data from URL query string.
 */
function renderSubmissionSummary() {
    const displayContainer = document.getElementById('results-display');
    const refCodeElement = document.getElementById('reference-code');
    if (!displayContainer) return;

    const params = new URLSearchParams(window.location.search);

    // If no parameters were passed (e.g. direct visit)
    if (!params.has('startup-name') && !params.has('founder-name')) {
        displayContainer.innerHTML = `
            <div class="summary-item full-width empty-session-card">
                <p>No active submission found in current session.</p>
                <a href="pitch.html" class="cta-action">Submit a Pitch Application &rarr;</a>
            </div>
        `;
        return;
    }

    // Generate random reference code
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const referenceId = `TS-2026-${randomHex}`;
    if (refCodeElement) {
        refCodeElement.textContent = referenceId;
    }

    // Extract values with sanitized defaults
    const founderName = params.get('founder-name') || 'N/A';
    const founderEmail = params.get('founder-email') || 'N/A';
    const founderPhone = params.get('founder-phone') || 'N/A';
    const startupName = params.get('startup-name') || 'N/A';
    const startupWebsite = params.get('startup-website') || 'Not provided';
    const headquarters = params.get('headquarters') || 'N/A';
    const category = params.get('category') || 'General Tech';
    const stage = params.get('stage') || 'Early Stage';
    const fundingRaised = params.get('funding-raised') || 'Undisclosed';
    const pitch = params.get('pitch') || 'No description provided';
    const timestampRaw = params.get('timestamp');

    let formattedDate = 'Recently';
    if (timestampRaw) {
        try {
            const dateObj = new Date(timestampRaw);
            formattedDate = dateObj.toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
            });
        } catch {
            formattedDate = timestampRaw;
        }
    }

    // Render using template literals
    displayContainer.innerHTML = `
        <div class="summary-item">
            <dt>Founder Name</dt>
            <dd>${founderName}</dd>
        </div>
        <div class="summary-item">
            <dt>Startup Name</dt>
            <dd>${startupName}</dd>
        </div>
        <div class="summary-item">
            <dt>Corporate Email</dt>
            <dd>${founderEmail}</dd>
        </div>
        <div class="summary-item">
            <dt>Contact Phone</dt>
            <dd>${founderPhone}</dd>
        </div>
        <div class="summary-item">
            <dt>Industry Vertical</dt>
            <dd>${category}</dd>
        </div>
        <div class="summary-item">
            <dt>Investment Stage</dt>
            <dd>${stage}</dd>
        </div>
        <div class="summary-item">
            <dt>Headquarters</dt>
            <dd>${headquarters}</dd>
        </div>
        <div class="summary-item">
            <dt>Capital Raised</dt>
            <dd>${fundingRaised}</dd>
        </div>
        <div class="summary-item full-width">
            <dt>Startup Website / Demo</dt>
            <dd>${startupWebsite !== 'Not provided' ? `<a href="${startupWebsite}" target="_blank" rel="noopener noreferrer">${startupWebsite}</a>` : startupWebsite}</dd>
        </div>
        <div class="summary-item full-width">
            <dt>Executive Pitch Summary</dt>
            <dd>${pitch}</dd>
        </div>
        <div class="summary-item full-width">
            <dt>Submission Timestamp</dt>
            <dd>${formattedDate}</dd>
        </div>
    `;
}

