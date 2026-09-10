// Dynamically output the copyright year
const currentYearElement = document.querySelector('#currentyear');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// Dynamically output the date the document was last modified
const lastModifiedElement = document.getElementById('lastModified');
if (lastModifiedElement) {
    lastModifiedElement.innerHTML = `Last Modification: ${document.lastModified}`;
}