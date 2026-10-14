/**
 * main.js - Core UI and Navigation Module for TechSparks Brasil
 * Handles responsive hamburger menu, wayfinding, dynamic dates, and favorites badge.
 * WDD 231 Term Project | João Silva
 */

import { getFavoritesCount } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFooterDates();
    initFavoritesCounter();
});

/**
 * Initializes the mobile responsive hamburger menu.
 */
function initNavigation() {
    const menuButton = document.getElementById('menu-button');
    const nav = document.querySelector('nav');

    if (menuButton && nav) {
        menuButton.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('open');
            menuButton.setAttribute('aria-expanded', String(isOpen));
            menuButton.innerHTML = isOpen ? '&times;' : '&#9776;';
        });

        // Close navigation when a link is clicked on mobile
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    nav.classList.remove('open');
                    menuButton.setAttribute('aria-expanded', 'false');
                    menuButton.innerHTML = '&#9776;';
                }
            });
        });
    }

    // Wayfinding: highlight current active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Injects dynamic copyright year and document last modified date.
 */
function initFooterDates() {
    const yearSpan = document.getElementById('currentyear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const lastModifiedP = document.getElementById('lastModified');
    if (lastModifiedP) {
        lastModifiedP.textContent = `Last Modified: ${document.lastModified}`;
    }
}

/**
 * Initializes and updates the favorites counter pill in the header.
 */
function initFavoritesCounter() {
    const badge = document.getElementById('fav-badge');
    
    const updateBadge = (count) => {
        if (badge) {
            badge.textContent = count;
        }
    };

    // Set initial count
    updateBadge(getFavoritesCount());

    // Listen for custom event triggered whenever favorites are modified
    window.addEventListener('favoritesUpdated', (event) => {
        if (event.detail && typeof event.detail.count === 'number') {
            updateBadge(event.detail.count);
        }
    });
}
