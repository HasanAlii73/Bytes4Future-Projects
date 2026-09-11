function validateName (name) {
    if (name.length < 2) {
        return false;
    }
    return true;
}

function startGame () {
    const nameInput = document.getElementById('username');
    document.getElementById('start-button').addEventListener('click', function () {
        const name = nameInput.value;
        if (validateName(name)) {
            nameInput.style.borderColor = '';
            document.getElementById('game-screen').style.display = 'block';
            document.getElementById('start-screen').style.display = 'none';
            document.getElementById('username-display').textContent = name;
        } else {
            nameInput.style.borderColor = 'red';
        }
    });
}

startGame();