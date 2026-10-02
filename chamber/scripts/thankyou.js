// ==========================================================================
// WDD 231 - Chamber of Commerce: Thank You Page Script (URL Search Params)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const resultsDisplay = document.querySelector('#results-display');
    if (!resultsDisplay) return;

    // Parse URL query string
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);

    // Helper: Map membership tier code to friendly title
    function getMembershipTitle(code) {
        switch (code) {
            case 'np':
                return 'NP Membership (Non-Profit - Free)';
            case 'bronze':
                return 'Bronze Membership ($150 / year)';
            case 'silver':
                return 'Silver Membership ($300 / year)';
            case 'gold':
                return 'Gold Membership ($500 / year)';
            default:
                return code || 'Not Specified';
        }
    }

    // Helper: Format ISO timestamp into readable date & time
    function formatTimestamp(isoString) {
        if (!isoString) return 'Not available';
        const dateObj = new Date(isoString);
        if (isNaN(dateObj.getTime())) return isoString;
        return dateObj.toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'medium'
        });
    }

    // Extract form fields
    const fname = urlParams.get('fname') || '';
    const lname = urlParams.get('lname') || '';
    const orgtitle = urlParams.get('orgtitle') || '';
    const email = urlParams.get('email') || '';
    const phone = urlParams.get('phone') || '';
    const organization = urlParams.get('organization') || '';
    const membership = urlParams.get('membership') || '';
    const description = urlParams.get('description') || '';
    const timestamp = urlParams.get('timestamp') || '';

    // Check if form was submitted with data
    if (!fname && !organization && !email) {
        resultsDisplay.innerHTML = `
            <div class="no-data-msg">
                <p>No submission data was found. Please submit the <a href="join.html">Membership Application Form</a>.</p>
            </div>
        `;
        return;
    }

    resultsDisplay.innerHTML = `
        <div class="summary-item">
            <dt>Applicant Name:</dt>
            <dd><strong>${fname} ${lname}</strong></dd>
        </div>

        ${orgtitle ? `
        <div class="summary-item">
            <dt>Organizational Title:</dt>
            <dd>${orgtitle}</dd>
        </div>` : ''}

        <div class="summary-item">
            <dt>Email Address:</dt>
            <dd><a href="mailto:${email}">${email}</a></dd>
        </div>

        <div class="summary-item">
            <dt>Mobile Phone:</dt>
            <dd><a href="tel:${phone}">${phone}</a></dd>
        </div>

        <div class="summary-item">
            <dt>Organization / Business:</dt>
            <dd><strong>${organization}</strong></dd>
        </div>

        <div class="summary-item">
            <dt>Selected Membership Tier:</dt>
            <dd><span class="badge badge-gold">${getMembershipTitle(membership)}</span></dd>
        </div>

        ${description ? `
        <div class="summary-item full-width">
            <dt>Business Description:</dt>
            <dd>${description}</dd>
        </div>` : ''}

        <div class="summary-item full-width timestamp-item">
            <dt>Application Submission Timestamp:</dt>
            <dd><time datetime="${timestamp}">${formatTimestamp(timestamp)}</time></dd>
        </div>
    `;
});
