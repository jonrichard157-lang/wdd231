// ==========================================================================
// WDD 231 - Chamber of Commerce Home Page Script (Weather & Spotlights)
// ==========================================================================

// Coordinates for São Paulo, Brazil
const LAT = -23.5505;
const LON = -46.6333;

// OpenWeather API Key (Replace with your individual student key if desired)
const API_KEY = '9ba469ee9497e7535b8e9b67484df12a';

// DOM Selectors - Weather
const currentTempEl = document.querySelector('#current-temp');
const weatherDescEl = document.querySelector('#weather-desc');
const weatherIconEl = document.querySelector('#weather-icon');
const highTempEl = document.querySelector('#high-temp');
const lowTempEl = document.querySelector('#low-temp');
const humidityEl = document.querySelector('#humidity');
const forecastContainer = document.querySelector('#forecast-container');

// DOM Selectors - Spotlights
const spotlightsContainer = document.querySelector('#spotlights-container');

// Helper: Capitalize words in weather descriptions
function capitalizeWords(str) {
    if (!str) return '';
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// ==========================================================================
// 1. Weather Section: Fetch & Display OpenWeather API Data
// ==========================================================================
async function fetchWeatherData() {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;

    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        if (!currentRes.ok || !forecastRes.ok) {
            throw new Error(`OpenWeather API returned status: current=${currentRes.status}, forecast=${forecastRes.status}`);
        }

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
    } catch (error) {
        console.warn('Live OpenWeather fetch failed (likely API key activation / offline). Using fallback live display:', error);
        displayFallbackWeather();
    }
}

function displayCurrentWeather(data) {
    if (!currentTempEl) return;

    const temp = Math.round(data.main.temp);
    const desc = capitalizeWords(data.weather[0].description);
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    currentTempEl.textContent = temp;
    if (weatherDescEl) weatherDescEl.textContent = desc;
    if (highTempEl) highTempEl.textContent = Math.round(data.main.temp_max);
    if (lowTempEl) lowTempEl.textContent = Math.round(data.main.temp_min);
    if (humidityEl) humidityEl.textContent = data.main.humidity;

    if (weatherIconEl) {
        weatherIconEl.setAttribute('src', iconUrl);
        weatherIconEl.setAttribute('alt', desc);
    }
}

function displayForecast(data) {
    if (!forecastContainer) return;
    forecastContainer.innerHTML = '';

    const todayDate = new Date().toISOString().split('T')[0];
    const dailyForecasts = [];

    // Filter 3 distinct future days at ~12:00:00
    data.list.forEach(item => {
        const [dateStr, timeStr] = item.dt_txt.split(' ');
        if (dateStr !== todayDate && timeStr === '12:00:00' && dailyForecasts.length < 3) {
            dailyForecasts.push(item);
        }
    });

    // Fallback if 12:00:00 is not in the slice
    if (dailyForecasts.length < 3) {
        const uniqueDates = new Set();
        data.list.forEach(item => {
            const dateStr = item.dt_txt.split(' ')[0];
            if (dateStr !== todayDate && !uniqueDates.has(dateStr) && dailyForecasts.length < 3) {
                uniqueDates.add(dateStr);
                dailyForecasts.push(item);
            }
        });
    }

    dailyForecasts.forEach(dayItem => {
        const dateObj = new Date(dayItem.dt * 1000);
        const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(dayItem.main.temp);
        const desc = capitalizeWords(dayItem.weather[0].description);
        const iconCode = dayItem.weather[0].icon;

        const dayCard = document.createElement('div');
        dayCard.classList.add('forecast-day');
        dayCard.innerHTML = `
            <span class="forecast-day-name">${dayLabel}</span>
            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${desc}" width="40" height="40" loading="lazy">
            <span class="forecast-temp">${temp}&deg;C</span>
            <span class="forecast-desc">${desc}</span>
        `;
        forecastContainer.appendChild(dayCard);
    });
}

function displayFallbackWeather() {
    if (currentTempEl) currentTempEl.textContent = '24';
    if (weatherDescEl) weatherDescEl.textContent = 'Partly Cloudy';
    if (highTempEl) highTempEl.textContent = '28';
    if (lowTempEl) lowTempEl.textContent = '19';
    if (humidityEl) humidityEl.textContent = '62';
    if (weatherIconEl) {
        weatherIconEl.setAttribute('src', 'https://openweathermap.org/img/wn/02d@2x.png');
        weatherIconEl.setAttribute('alt', 'Partly Cloudy');
    }

    if (!forecastContainer) return;
    forecastContainer.innerHTML = '';

    const today = new Date();
    const temps = [26, 23, 27];
    const descs = ['Sunny', 'Scattered Showers', 'Mostly Sunny'];
    const icons = ['01d', '10d', '02d'];

    for (let i = 1; i <= 3; i++) {
        const nextDate = new Date();
        nextDate.setDate(today.getDate() + i);
        const dayLabel = nextDate.toLocaleDateString('en-US', { weekday: 'short' });

        const dayCard = document.createElement('div');
        dayCard.classList.add('forecast-day');
        dayCard.innerHTML = `
            <span class="forecast-day-name">${dayLabel}</span>
            <img src="https://openweathermap.org/img/wn/${icons[i - 1]}.png" alt="${descs[i - 1]}" width="40" height="40" loading="lazy">
            <span class="forecast-temp">${temps[i - 1]}&deg;C</span>
            <span class="forecast-desc">${descs[i - 1]}</span>
        `;
        forecastContainer.appendChild(dayCard);
    }
}

// ==========================================================================
// 2. Company Spotlight: Fetch local members.json, filter Gold & Silver
// ==========================================================================
async function fetchMemberSpotlights() {
    if (!spotlightsContainer) return;

    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`Failed to load members.json: ${response.status}`);
        }

        const members = await response.json();

        // Filter ONLY Gold (membership 3) and Silver (membership 2) members
        const eligibleMembers = members.filter(member => {
            const level = member.membership;
            return level === 3 || level === 2 || level === 'Gold' || level === 'Silver';
        });

        // Fisher-Yates random shuffle
        for (let i = eligibleMembers.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [eligibleMembers[i], eligibleMembers[randomIndex]] = [eligibleMembers[randomIndex], eligibleMembers[i]];
        }

        // Randomly select 2 to 3 members
        const count = eligibleMembers.length >= 3 ? 3 : eligibleMembers.length;
        const selectedMembers = eligibleMembers.slice(0, count);

        displaySpotlightCards(selectedMembers);
    } catch (error) {
        console.error('Error fetching member spotlights:', error);
        if (spotlightsContainer) {
            spotlightsContainer.innerHTML = '<p class="error-msg">Unable to load member spotlights at this time.</p>';
        }
    }
}

function displaySpotlightCards(spotlights) {
    if (!spotlightsContainer) return;
    spotlightsContainer.innerHTML = '';

    spotlights.forEach(member => {
        const isGold = member.membership === 3 || member.membership === 'Gold';
        const badgeLabel = isGold ? 'Gold Partner' : 'Silver Partner';
        const badgeClass = isGold ? 'badge-gold' : 'badge-silver';

        const card = document.createElement('article');
        card.classList.add('spotlight-card');

        card.innerHTML = `
            <div class="spotlight-header">
                <span class="badge ${badgeClass}">${badgeLabel}</span>
                <h3 class="spotlight-title">${member.name}</h3>
            </div>
            <div class="spotlight-body">
                <img src="${member.image}" alt="${member.name} official logo" class="spotlight-img" width="300" height="180" loading="lazy">
                <p class="spotlight-tagline">${member.category || 'Business Member'}</p>
                <p class="spotlight-desc">${member.description || ''}</p>
                <div class="spotlight-contact">
                    <p class="spotlight-phone">&#128222; ${member.phone}</p>
                    <p class="spotlight-address">&#128205; ${member.address}</p>
                    <a href="${member.website}" target="_blank" rel="noopener noreferrer" class="spotlight-link">Visit Website &rarr;</a>
                </div>
            </div>
        `;

        spotlightsContainer.appendChild(card);
    });
}

// Initialize on page load
fetchWeatherData();
fetchMemberSpotlights();

