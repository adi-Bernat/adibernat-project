import { countries } from "./countriesService.js";

const favoriteCardsContainer = document.getElementById('favorite-cards');

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
    heartIcon.className = "fa fa-heart text-danger";

    heartIcon.addEventListener('click', () => {
        let favorites = JSON.parse(localStorage.getItem('Countries')) || [];
        favorites = favorites.filter(name => name !== country.name.common);
        localStorage.setItem('Countries', JSON.stringify(favorites));
        card.remove();

        if (favorites.length === 0) {
            showEmptyMessage();
        }
    });

    cardFooter.appendChild(heartIcon);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(population);
    cardBody.appendChild(region);

    card.appendChild(cardImg);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    return card;
};

const showEmptyMessage = () => {
    favoriteCardsContainer.innerHTML = `
        <div class="col-12 text-center mt-5">
            <h3>אין מדינות מועדפות עדיין</h3>
            <p>חזור לרשימה המלאה כדי להוסיף מדינות למועדפים</p>
        </div>
    `;
};

const displayFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('Countries')) || [];

    if (favorites.length === 0) {
        showEmptyMessage();
        return;
    }

    favoriteCardsContainer.innerHTML = '';

    // מסנן את המדינות המועדפות מתוך כל המדינות
    const favoriteCountries = countries.filter(country =>
        favorites.includes(country.name.common)
    );

    favoriteCountries.forEach(country => {
        favoriteCardsContainer.appendChild(generateCard(country));
    });
};

// טעינת המועדפים בטעינת הדף
displayFavorites();