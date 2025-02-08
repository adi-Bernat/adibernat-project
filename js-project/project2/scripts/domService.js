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



document.getElementById('search-input').addEventListener('input', (event) => {
    console.log(event.target.value);
    reset();
    cardsContainer.innerHTML = '';

    if (!event.target.value || event.target.value === '') {
        createCards();
    } else {
        search(event.target.value);
        createCards();
    }
});

const generateCard = (country) => {
    const card = document.createElement('div');
    card.className = "card m-2 col-sm-12 col-md-3";

    const cardImg = document.createElement('img');
    cardImg.src = country.flags.png;
    cardImg.className = "card-img-top img mt-2 border rounded shadow";

    const cardBody = document.createElement('div');
    cardBody.className = "card-body";

    const cardTitle = document.createElement('h5');
    cardTitle.className = "card-title";
    cardTitle.innerText = country.name.common;

    const population = document.createElement('p');
    population.className = "card-text";
    population.innerText = `Population: ${country.population.toLocaleString()}`;

    const region = document.createElement('p');
    region.className = "card-text";
    region.innerText = `Region: ${country.region}`;

    const cardFooter = document.createElement('div');
    cardFooter.className = "card-footer d-flex justify-content-center mb-2";

    const heartIcon = document.createElement('i');
    heartIcon.className = "fa fa-heart";

    const checkStorage = localStorage.getItem('Countries');
    const favorites = checkStorage ? JSON.parse(checkStorage) : [];
    const isLiked = favorites.includes(country.name.common);

    heartIcon.classList.add(isLiked ? 'text-danger' : 'text-dark');

    heartIcon.addEventListener('click', () => {
        const currentFavorites = localStorage.getItem('Countries');
        let likedCountries = currentFavorites ? JSON.parse(currentFavorites) : [];

        if (heartIcon.classList.contains('text-dark')) {
            heartIcon.classList.replace('text-dark', 'text-danger');
            likedCountries.push(country.name.common);
        } else {
            heartIcon.classList.replace('text-danger', 'text-dark');
            likedCountries = likedCountries.filter(name => name !== country.name.common);
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