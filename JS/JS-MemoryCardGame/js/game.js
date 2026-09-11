let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer;
let seconds = 0;

function startGame() {
    const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    cards = [...cardValues, ...cardValues];
    shuffleCards();
}

function getCards() {
    startGame();
    return cards;
}

function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

function flipCard(event) {
    const card = event.currentTarget;
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCards.push(card);
        if (flippedCards.length === 2) {
            moves++;
            document.getElementById('moves').textContent = `Moves: ${moves}`;
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === cards.length / 2) {
            clearInterval(timer);
            alert(`Congratulations! You've completed the game in ${seconds} seconds and ${moves} moves.`);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    seconds = 0;
    const timer = setInterval(() => {
        seconds++;
        timerElement.textContent = `Time: ${seconds} s`;
    }, 1000);

    return timer;
}

export { getCards, flipCard, startTimer };