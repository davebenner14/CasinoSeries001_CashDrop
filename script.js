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

    const billTypes = [
        { type: '5', value: 5, frequency: 0.5, speed: 2 },
        { type: '10', value: 10, frequency: 0.25, speed: 2 },
        { type: '20', value: 20, frequency: 0.15, speed: 2 },
        { type: '50', value: 50, frequency: 0.07, speed: 2 },
        { type: '100', value: 100, frequency: 0.03, speed: 2 }
    ];

    function startGame() {
        score = 0;
        updateScore();
        gameInterval = setInterval(createFallingObject, 1000);
    }

    function stopGame() {
        clearInterval(gameInterval);
        const fallingObjects = document.querySelectorAll('.falling');
        fallingObjects.forEach(obj => obj.remove());
    }

    function updateScore() {
        scoreBoard.textContent = `Score: $${score}`;
    }

    function createFallingObject() {
        if (Math.random() < 0.7) {
            createFallingC();
        } else {
            createFallingBill();
        }
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

    function createFallingBill() {
        const randomType = billTypes.find(bill => Math.random() < bill.frequency);

        if (!randomType) return;

        const bill = document.createElement('div');
        bill.classList.add('falling');
        bill.textContent = `$${randomType.type}`;
        bill.style.position = 'absolute';
        bill.style.top = '0px';
        bill.style.left = `${Math.random() * (gameWidth - 20)}px`;
        bill.style.fontSize = '3vw';
        bill.style.color = 'green';
        game.appendChild(bill);

        const fallInterval = setInterval(() => {
            const billRect = bill.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            if (billRect.top > game.clientHeight) {
                clearInterval(fallInterval);
                bill.remove();
            } else if (
                billRect.bottom >= playerRect.top &&
                billRect.right >= playerRect.left &&
                billRect.left <= playerRect.right
            ) {
                clearInterval(fallInterval);
                bill.remove();
                score += randomType.value;
                updateScore();
            } else {
                bill.style.top = `${bill.offsetTop + randomType.speed}px`;
                bill.style.left = `${bill.offsetLeft + Math.sin(Date.now() / 100) * 2}px`; // Floating effect
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
