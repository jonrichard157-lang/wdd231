// Chamber of Commerce Business Directory Script
const membersContainer = document.querySelector('#members-container');
const gridButton = document.querySelector('#grid-view');
const listButton = document.querySelector('#list-view');

// Asynchronously fetch members data from JSON
async function getMembersData() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error while fetching members data: ${response.status}`);
        }
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error('Failed to load member directory:', error);
        if (membersContainer) {
            membersContainer.innerHTML = '<p class="error-msg">Unable to load business directory. Please try again later.</p>';
        }
    }
}

// Function to map membership level number to label and badge class
function getMembershipDetails(level) {
    switch (level) {
        case 3:
            return { label: 'Gold Partner', badgeClass: 'badge-gold' };
        case 2:
            return { label: 'Silver Partner', badgeClass: 'badge-silver' };
        case 1:
        default:
            return { label: 'Member', badgeClass: 'badge-member' };
    }
}

// Function to render members list into DOM
function displayMembers(members) {
    if (!membersContainer) return;
    membersContainer.innerHTML = '';

    members.forEach(member => {
        const card = document.createElement('section');
        card.classList.add('member-card');

        const membership = getMembershipDetails(member.membership);

        card.innerHTML = `
            <img src="${member.image}" alt="${member.name} logo emblem" class="member-image" width="400" height="240" loading="lazy">
            <div class="member-details">
                <div class="member-header">
                    <h2 class="member-name">${member.name}</h2>
                    <span class="badge ${membership.badgeClass}">${membership.label}</span>
                </div>
                <p class="member-category">${member.category}</p>
                <p class="member-desc">${member.description}</p>
                <div class="member-contact">
                    <p class="member-address">&#128205; ${member.address}</p>
                    <p class="member-phone">&#128222; ${member.phone}</p>
                    <a href="${member.website}" target="_blank" rel="noopener noreferrer" class="member-website">Visit Website &rarr;</a>
                </div>
            </div>
        `;

        membersContainer.appendChild(card);
    });
}

// Grid & List View Toggle Listeners
if (gridButton && listButton && membersContainer) {
    gridButton.addEventListener('click', () => {
        membersContainer.classList.add('grid');
        membersContainer.classList.remove('list');
        gridButton.classList.add('active');
        listButton.classList.remove('active');
        gridButton.setAttribute('aria-pressed', 'true');
        listButton.setAttribute('aria-pressed', 'false');
    });

    listButton.addEventListener('click', () => {
        membersContainer.classList.add('list');
        membersContainer.classList.remove('grid');
        listButton.classList.add('active');
        gridButton.classList.remove('active');
        listButton.setAttribute('aria-pressed', 'true');
        gridButton.setAttribute('aria-pressed', 'false');
    });
}

// Initialize fetch
getMembersData();

