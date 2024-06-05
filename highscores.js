document.addEventListener('DOMContentLoaded', () => {
    const highScoreContainer = document.getElementById('highScoreContainer');
    const finalScore = document.getElementById('finalScore');
    const highScoreList = document.getElementById('highScoreList');
    const backToMenuButton = document.getElementById('backToMenuButton');
    const playerNameInput = document.getElementById('playerName');
    const submitScoreButton = document.getElementById('submitScoreButton');

    // Initial high scores
    let highScores = [
        { name: 'Super Dave', score: 1000029 },
        { name: 'Super Mario', score: 787000 },
        { name: 'Link', score: 525912 },
        { name: 'Solid Snake', score: 426867 },
        { name: 'Master Chief', score: 399426 },
        { name: 'Donkey Kong', score: 248448 },
        { name: 'Sonic', score: 125887 },
        { name: 'Kirby', score: 69115 },
        { name: 'Pikachu', score: 22724 },
        { name: 'Pac-Man', score: 8800 }
    ];

    // Load high scores from local storage if available
    const savedScores = JSON.parse(localStorage.getItem('highScores'));
    if (savedScores) {
        highScores = savedScores;
    }

    function displayHighScores() {
        highScoreList.innerHTML = highScores
            .map((score, index) => `<li>${index + 1}. ${score.name} - $${score.score.toLocaleString()}</li>`)
            .join('');
    }

    function saveHighScores() {
        localStorage.setItem('highScores', JSON.stringify(highScores));
    }

    function addNewScore(name, score) {
        highScores.push({ name, score });
        highScores.sort((a, b) => b.score - a.score);
        if (highScores.length > 10) {
            highScores.pop();
        }
        saveHighScores();
        displayHighScores();
    }

    window.addEventListener('gameOver', (event) => {
        const { score } = event.detail;
        finalScore.textContent = `Your score is: $${score}`;
        highScoreContainer.style.display = 'block';
        playerNameInput.value = '';
        playerNameInput.style.display = 'block';
        submitScoreButton.style.display = 'block';
        finalScore.style.display = 'block';
    });

    submitScoreButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            const score = parseInt(finalScore.textContent.replace('Your score is: $', '').replace(/,/g, ''));
            addNewScore(playerName, score);
            playerNameInput.style.display = 'none';
            submitScoreButton.style.display = 'none';
        }
    });

    backToMenuButton.addEventListener('click', () => {
        highScoreContainer.style.display = 'none';
    });

    displayHighScores();
});
