import { getCards, flipCard, startTimer } from './game.js';
let userName = '';

function validateName(name) {
    if (name.length < 2) {
        return false;
    }
    return true;
}

function startPage() {
    const nameInput = document.getElementById('username');
    document.getElementById('start-button').addEventListener('click', function () {
        const name = nameInput.value;
        if (validateName(name)) {
            nameInput.style.borderColor = '';
            document.getElementById('game-screen').classList.remove('hidden');
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('username-display').textContent = name;
            userName = name;

            renderCards();
            restartGame();
            backToMainMenu();
            startTimer();
        } else {
            nameInput.style.borderColor = 'red';
        }
    });
}

function restartGame() {
    document.getElementById('restart-button').addEventListener('click', function () {
        document.getElementById('timer').textContent = 'Time: 0 s';
        startTimer();
        document.getElementById('moves').textContent = 'Moves: 0';
        renderCards();
    });
}

function backToMainMenu() {
    document.getElementById('back-to-main-menu-button').addEventListener('click', function () {
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
        document.getElementById('username').value = '';
        userName = '';
    });
}

function renderCards() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    const cards = getCards();

    console.log(cards); // to delete

    cards.forEach((value, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = value;
        cardElement.dataset.index = index;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}



startPage();