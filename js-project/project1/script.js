console.log(window.location.href);

const images = [
    '../project1/img-java/p1.jpg',
    '../project1/img-java/p2.jpg',
    '../project1/img-java/p3.jpg',
    '../project1/img-java/p4.jpg',
    '../project1/img-java/p5.jpg',
    '../project1/img-java/p6.jpg',
    '../project1/img-java/p7.jpg',
    '../project1/img-java/p8.jpg',
];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let isLocked = false;

function createCard(imagePath) {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = imagePath;
    img.style.display = 'none';

    card.dataset.image = imagePath;
    card.appendChild(img);
    card.addEventListener('click', flipCard);

    return card;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function flipCard() {
    if (isLocked ||
        this.classList.contains('flipped') ||
        this.classList.contains('matched')) {
        return;
    }

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        isLocked = true;
        attempts++;
        document.getElementById('attempts').textContent = attempts;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.image === card2.dataset.image;

    if (match) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        document.getElementById('matches').textContent = matchedPairs;

        if (matchedPairs === images.length) {
            setTimeout(() => {
                alert('כל הכבוד! ניצחת!');
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000);
    }

    flippedCards = [];
    setTimeout(() => {
        isLocked = false;
    }, 1000);
}

function startNewGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    matchedPairs = 0;
    attempts = 0;
    isLocked = false;
    document.getElementById('attempts').textContent = '0';
    document.getElementById('matches').textContent = '0';

    cards = [...images, ...images].map(image => createCard(image));
    shuffleArray(cards);

    cards.forEach(card => {
        gameBoard.appendChild(card);
    });
}

startNewGame();