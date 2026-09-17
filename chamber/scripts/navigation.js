// Responsive Navigation Toggle
const menuButton = document.querySelector('#menu-button');
const navMenu = document.querySelector('nav');

if (menuButton && navMenu) {
    menuButton.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        menuButton.classList.toggle('open');
        menuButton.setAttribute('aria-expanded', String(isOpen));
        menuButton.innerHTML = isOpen ? '&times;' : '&#9776;';
    });
}

