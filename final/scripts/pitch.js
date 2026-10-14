/**
 * pitch.js - Application Form Controller for TechSparks Brasil
 * Sets hidden timestamp, handles interactive validation, and live character counters.
 * WDD 231 Term Project | João Silva
 */

document.addEventListener('DOMContentLoaded', () => {
    initTimestamp();
    initPitchCounter();
});

/**
 * Automatically sets the hidden timestamp input to current local date/time.
 */
function initTimestamp() {
    const timestampInput = document.getElementById('timestamp');
    if (timestampInput) {
        const now = new Date();
        timestampInput.value = now.toISOString();
    }
}

/**
 * Attaches a live character counter to the elevator pitch textarea.
 */
function initPitchCounter() {
    const pitchTextarea = document.getElementById('pitch');
    const counterDisplay = document.getElementById('pitch-counter');

    if (pitchTextarea && counterDisplay) {
        const updateCount = () => {
            const length = pitchTextarea.value.length;
            counterDisplay.textContent = `${length} / 500 characters`;
            if (length > 450) {
                counterDisplay.style.color = '#f59e0b';
            } else {
                counterDisplay.style.color = '#64748b';
            }
        };

        pitchTextarea.addEventListener('input', updateCount);
        updateCount();
    }
}
