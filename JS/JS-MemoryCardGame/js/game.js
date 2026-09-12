let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer;
let seconds = 0;
let userName = '';

import { saveTop5Scores, getTop5Scores } from './storage.js';

function startGame() {
    const cardValues = ['🐶', '🐱', '🐭', '🐹', '🐶', '🐱', '🐭', '🐹'];
    resetGameState();
    cards = [...cardValues, ...cardValues];
    shuffleCards();
}

function resetGameState(userName) {
    clearInterval(timer);
    timer = null;
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    userName = userName || '';
}

function getCards(name) {
    startGame();
    userName = name || '';
    return cards;
}

function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

function flipCard(event) {
    if (!timer) {
        timer = startTimer();
    }
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
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        if (matchedPairs === cards.length / 2) {
            endGame();
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
    timer = setInterval(() => {
        seconds++;
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
        timerElement.textContent = `Time: ${minutes.toString().padStart(2, '0')} : ${remainingSeconds.toString().padStart(2, '0')}`;
    }, 1000);

    return timer;
}

function endGame() {
    clearInterval(timer);
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('final-time').textContent = `Time: ${Math.floor(seconds / 60).toString().padStart(2, '0')} : ${(seconds % 60).toString().padStart(2, '0')}`;
    document.getElementById('final-moves').textContent = `Moves: ${moves}`;
    let score = {userName: userName, time: seconds, moves: moves};
    saveTop5Scores(score);
    leaderBoardRender();
}

function leaderBoardRender() {
    const topScores = getTop5Scores();
    const topScoresList = document.getElementById('top-scores-list');
    topScoresList.innerHTML = '';
    topScores.forEach((score, index) => {
        const row = document.createElement('tr');
        const time = `${Math.floor(score.time / 60).toString().padStart(2, '0')} : ${(score.time % 60).toString().padStart(2, '0')}`;
        row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${score.userName}</td>
            <td>${time}</td>
            <td>${score.moves}</td>
        `;
        topScoresList.appendChild(row);
    });
}

export { getCards, flipCard, startTimer, resetGameState };