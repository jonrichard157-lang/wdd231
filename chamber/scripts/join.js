// ==========================================================================
// WDD 231 - Chamber of Commerce: Join Page Script (Timestamp & Modals)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set the hidden timestamp input to current date and time on page load
    const timestampInput = document.querySelector('#timestamp');
    if (timestampInput) {
        timestampInput.value = new Date().toISOString();
    }

    // 2. Manage Membership Level Dialog Modals
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const modals = document.querySelectorAll('.membership-modal');

    // Open corresponding dialog modal on button click
    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            if (targetModal && typeof targetModal.showModal === 'function') {
                targetModal.showModal();
            }
        });
    });

    // Close buttons inside modals
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-modal-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.close();
            });
        }

        // Close modal when user clicks on the backdrop area
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.close();
            }
        });
    });
});
