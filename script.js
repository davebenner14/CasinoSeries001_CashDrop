document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const game = document.getElementById('game');
    const scoreBoard = document.getElementById('score');
    const startButton = document.getElementById('startButton');
    const gameWidth = game.clientWidth;
    const playerWidth = player.clientWidth;
    const playerSpeed = gameWidth * 0.025; // 2.5% of the game width
    let score = 0;
    let gameInterval;

    function startGame() {
        score = 0;
        updateScore();
        gameInterval = setInterval(createFallingC, 1000);
    }

    function stopGame() {
        clearInterval(gameInterval);
        const fallingCs = document.querySelectorAll('.falling');
        fallingCs.forEach(c => c.remove());
    }

    function updateScore() {
        scoreBoard.textContent = `Score: $${score}`;
    }

    function createFallingC() {
        const c = document.createElement('div');
        c.classList.add('falling');
        c.textContent = 'C';
        c.style.position = 'absolute';
        c.style.top = '0px';
        c.style.left = `${Math.random() * (gameWidth - 20)}px`;
        c.style.fontSize = '3vw';
        c.style.color = 'gold';
        game.appendChild(c);

        const fallInterval = setInterval(() => {
            const cRect = c.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            if (cRect.top > game.clientHeight) {
                clearInterval(fallInterval);
                c.remove();
            } else if (
                cRect.bottom >= playerRect.top &&
                cRect.right >= playerRect.left &&
                cRect.left <= playerRect.right
            ) {
                clearInterval(fallInterval);
                c.remove();
                score++;
                updateScore();
            } else {
                c.style.top = `${c.offsetTop + 5}px`;
            }
        }, 50);
    }

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        const playerRect = player.getBoundingClientRect();

        if (key === 'ArrowLeft' && playerRect.left > game.getBoundingClientRect().left) {
            player.style.left = `${player.offsetLeft - playerSpeed}px`;
        }
        if (key === 'ArrowRight' && playerRect.right < game.getBoundingClientRect().right) {
            player.style.left = `${player.offsetLeft + playerSpeed}px`;
        }
    });

    startButton.addEventListener('click', () => {
        stopGame();
        startGame();
    });
});
