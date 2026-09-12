function saveScore(score) {
    localStorage.setItem('memoryGameScore', score);
}

function saveUserName(name) {
    localStorage.setItem('memoryGameUserName', name);
}

function getUserName() {
    return localStorage.getItem('memoryGameUserName') || '';
}

function saveTop5Scores(score) {
    let top5Scores = JSON.parse(localStorage.getItem('memoryGameTop5Scores')) || [];
    top5Scores.sort((a, b) => a.time - b.time);
    if (top5Scores.length < 5) {
        top5Scores.push(score);
    } else if (score.time < top5Scores[top5Scores.length - 1].time) {
        top5Scores[top5Scores.length - 1] = score;
    }
    top5Scores.sort((a, b) => a.time - b.time);
    localStorage.setItem('memoryGameTop5Scores', JSON.stringify(top5Scores));
}

function getTop5Scores() {
    return JSON.parse(localStorage.getItem('memoryGameTop5Scores')) || [];
}

function clearAllScores() {
    localStorage.removeItem('memoryGameTop5Scores');
    localStorage.removeItem('memoryGameUserName');
    localStorage.removeItem('memoryGameScore');
}

export { saveScore, saveUserName, getUserName, saveTop5Scores, getTop5Scores, clearAllScores };