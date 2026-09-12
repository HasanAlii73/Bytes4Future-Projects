import { getCards, flipCard, resetGameState } from './game.js';
import { saveScore, saveUserName, getUserName } from './storage.js';
let userName = '';

function validateName(name) {
    if (name.length < 2) {
        return false;
    }
    return true;
}

function startPage() {
    const nameInput = document.getElementById('username');
    if (getUserName()) {
        nameInput.value = getUserName();
    }
    document.getElementById('start-button').addEventListener('click', function () {
        const name = nameInput.value;
        if (validateName(name)) {
            nameInput.style.borderColor = '';
            document.getElementById('game-screen').classList.remove('hidden');
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('username-display').textContent = name;
            userName = name;

            renderCards();
            resetGameState(userName);
            handleRestartGameButton();
            handleGameOverButtons();
            handleBackToMainMenuButton();
            saveUserName(name);
        } else {
            nameInput.style.borderColor = 'red';
        }
    });
}

function restartGame() {
    resetGameState();
    document.getElementById('timer').textContent = 'Time: 00 : 00';
    document.getElementById('moves').textContent = 'Moves: 0';
    renderCards();
}

function handleRestartGameButton() {
    document.getElementById('restart-button').addEventListener('click', function () {
        restartGame();
    });
}

function handleBackToMainMenuButton() {
    document.getElementById('back-to-main-menu-button').addEventListener('click', function () {
        backToMainMenu();
    });
}

function backToMainMenu() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    if (getUserName()) {
        nameInput.value = getUserName();
        userName = getUserName();
    }
    else {
        document.getElementById('username').value = '';
        userName = '';
    }
}

function renderCards() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    const cards = getCards(userName);

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

function handleGameOverButtons() {
    document.getElementById('play-again-button').addEventListener('click', function () {
        document.getElementById('game-over-screen').classList.add('hidden');
        restartGame();
    });

    document.getElementById('back-to-main-menu-button-2').addEventListener('click', function () {
        backToMainMenu();
    });

    document.getElementById('save-score-button').addEventListener('click', function () {
        const score = {
            userName: userName,
            time: document.getElementById('final-time').textContent,
            moves: document.getElementById('final-moves').textContent
        };
        saveScore(JSON.stringify(score));
        alert('Score saved!');
    });
}



startPage();