import { countries, reset, search } from "./countriesService.js";
const cardsContainer = document.getElementById('cards');

// הוספת אלמנט למונה המועדפים
const favCounter = document.createElement('div');
favCounter.className = "favorites-counter badge bg-danger position-fixed top-0 end-0 m-3";
document.body.appendChild(favCounter);

// פונקציה לעדכון מונה המועדפים
const updateFavoritesCounter = () => {
    const favorites = JSON.parse(localStorage.getItem('Countries')) || [];
    favCounter.innerText = `♥ ${favorites.length}`;
    favCounter.style.display = favorites.length > 0 ? 'block' : 'none';
};

// פונקציה לחיפוש מדינה בכל השפות
const searchCountry = (searchTerm, country) => {
    searchTerm = searchTerm.toLowerCase();

    // חיפוש בשם הרגיל
    if (country.name.common.toLowerCase().includes(searchTerm)) return true;

    // חיפוש בשם הרשמי
    if (country.name.official.toLowerCase().includes(searchTerm)) return true;

    // חיפוש בשמות מקומיים
    if (country.name.nativeName) {
        const nativeNames = Object.values(country.name.nativeName);
        for (const name of nativeNames) {
            if (name.common.toLowerCase().includes(searchTerm) ||
                name.official.toLowerCase().includes(searchTerm)) {
                return true;
            }
        }
    }

    // חיפוש בשמות חלופיים
    if (country.altSpellings) {
        for (const spelling of country.altSpellings) {
            if (spelling.toLowerCase().includes(searchTerm)) {
                return true;
            }
        }
    }

    // חיפוש בתרגומים
    if (country.translations) {
        for (const translation of Object.values(country.translations)) {
            if (translation.common.toLowerCase().includes(searchTerm) ||
                translation.official.toLowerCase().includes(searchTerm)) {
                return true;
            }
        }
    }

    return false;
};

document.getElementById('search-input').addEventListener('input', (event) => {
    const searchTerm = event.target.value;
    cardsContainer.innerHTML = '';

    if (!searchTerm) {
        reset();
        createCards();
    } else {
        const filteredCountries = countries.filter(country =>
            searchCountry(searchTerm, country)
        );
        for (const country of filteredCountries) {
            generateCard(country);
        }
    }
});

const generateCard = (country) => {
    const card = document.createElement('div');
    card.className = "card m-2 col-sm-12 col-md-3";

    const cardImg = document.createElement('img');
    cardImg.src = country.flags.png;
    cardImg.className = "card-img-top img mt-2 border rounded shadow";
    cardImg.alt = country.flags.alt || `דגל ${country.name.common}`;

    const cardBody = document.createElement('div');
    cardBody.className = "card-body";

    const cardTitle = document.createElement('h5');
    cardTitle.className = "card-title";
    // הצגת השם בכמה שפות
    const nativeNames = country.name.nativeName ?
        Object.values(country.name.nativeName)[0].common : '';
    cardTitle.innerHTML = `${country.name.common}<br>
        <small class="text-muted">${nativeNames}</small>`;

    const population = document.createElement('p');
    population.className = "card-text";
    population.innerText = `אוכלוסייה: ${country.population.toLocaleString()}`;

    const region = document.createElement('p');
    region.className = "card-text";
    region.innerText = `אזור: ${country.region}`;

    const cardFooter = document.createElement('div');
    cardFooter.className = "card-footer d-flex justify-content-center mb-2";

    const heartIcon = document.createElement('i');
    heartIcon.className = "fa fa-heart";

    const favorites = JSON.parse(localStorage.getItem('Countries')) || [];
    const isLiked = favorites.includes(country.name.common);

    heartIcon.classList.add(isLiked ? 'text-danger' : 'text-dark');

    heartIcon.addEventListener('click', () => {
        const likedCountries = favorites;

        if (heartIcon.classList.contains('text-dark')) {
            heartIcon.classList.replace('text-dark', 'text-danger');
            likedCountries.push(country.name.common);
        } else {
            heartIcon.classList.replace('text-danger', 'text-dark');
            const index = likedCountries.indexOf(country.name.common);
            if (index > -1) likedCountries.splice(index, 1);
        }

        localStorage.setItem('Countries', JSON.stringify(likedCountries));
        updateFavoritesCounter();
    });

    cardFooter.appendChild(heartIcon);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(population);
    cardBody.appendChild(region);

    card.appendChild(cardImg);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    cardsContainer.appendChild(card);
};

const createCards = () => {
    for (const country of countries) {
        generateCard(country);
    }
    updateFavoritesCounter();
};

export { createCards };