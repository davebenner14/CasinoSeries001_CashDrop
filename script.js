document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const game = document.getElementById('game');
    const scoreBoard = document.getElementById('score');
    const timerBoard = document.getElementById('timer');
    const startMenu = document.getElementById('startMenu');
    const gameContainer = document.getElementById('gameContainer');
    const startGameButton = document.getElementById('startGameButton');
    const characters = document.querySelectorAll('.character');
    let score = 0;
    let gameInterval;
    let gameTimer;
    let selectedCharacter = 'girl';
    let playerSpeed;
    let playerSize;
    let timeLeft = 60;

    const billTypes = [
        { type: '5', value: 5, frequency: 0.5, speed: 2, image: 'Assets/5Bill.jpg' },
        { type: '10', value: 10, frequency: 0.25, speed: 2, image: 'Assets/10Bill.jpg' },
        { type: '20', value: 20, frequency: 0.15, speed: 2, image: 'Assets/20Bill.jpg' },
        { type: '50', value: 50, frequency: 0.07, speed: 2, image: 'Assets/50Bill.jpg' },
        { type: '100', value: 100, frequency: 0.03, speed: 2, image: 'Assets/100Bill.jpg' }
    ];

    const characterStats = {
        'fatman': { speed: 12, size: '17vw', image: 'Assets/Fatman.png', description: 'Fatman: Larger but slower' },
        'girl': { speed: 18, size: '10vw', image: 'Assets/Girl.png', description: 'Girl: Smaller but normal speed' },
        'ninja': { speed: 22, size: '6.5vw', image: 'Assets/Ninja.png', description: 'Ninja: Normal size but faster' }
    };

    function startGame() {
        score = 0;
        timeLeft = 60;
        updateScore();
        updateTimer();
        gameContainer.style.display = 'block';
        startMenu.style.display = 'none';
        player.src = characterStats[selectedCharacter].image;
        player.style.width = characterStats[selectedCharacter].size;
        player.style.height = characterStats[selectedCharacter].size;
        player.style.display = 'block';
        player.style.left = '50%'; // Reset player position
        player.style.bottom = '0'; // Ensure player is at the bottom
        player.style.transform = 'translateX(-50%)'; // Center the player
        gameInterval = setInterval(createFallingObject, 1000);
        gameTimer = setInterval(updateGameTimer, 1000);
    }

    function stopGame() {
        clearInterval(gameInterval);
        clearInterval(gameTimer);
        const fallingObjects = document.querySelectorAll('.falling');
        fallingObjects.forEach(obj => obj.remove());
        alert(`Game Over! Your score is: $${score}`);
        startMenu.style.display = 'block';
        gameContainer.style.display = 'none';
    }

    function updateScore() {
        scoreBoard.textContent = `Score: $${score}`;
    }

    function updateTimer() {
        timerBoard.textContent = `Time: ${timeLeft}s`;
    }

    function updateGameTimer() {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            stopGame();
        }
    }

    function createFallingObject() {
        const randomNum = Math.random();
        if (randomNum < 0.6) {
            createFallingCoin();
        } else if (randomNum < 0.95) {
            createFallingBill();
        } else {
            createFallingBitcoin();
        }
    }

    function createFallingCoin() {
        const coin = document.createElement('img');
        coin.src = 'Assets/Coin.png';
        coin.classList.add('falling');
        coin.style.position = 'absolute';
        coin.style.top = '-50px'; // Start falling from higher up
        coin.style.left = `${Math.random() * (game.clientWidth - 30)}px`;
        coin.style.width = '3vw';
        game.appendChild(coin);

        const fallInterval = setInterval(() => {
            const coinRect = coin.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            if (coinRect.top > game.clientHeight + 100) { // Allow it to fall further down
                clearInterval(fallInterval);
                coin.remove();
            } else if (
                coinRect.bottom >= playerRect.top &&
                coinRect.right >= playerRect.left &&
                coinRect.left <= playerRect.right
            ) {
                clearInterval(fallInterval);
                coin.remove();
                score++;
                updateScore();
            } else {
                coin.style.top = `${coin.offsetTop + 5}px`;
            }
        }, 50);
    }

    function createFallingBill() {
        const randomType = billTypes.find(bill => Math.random() < bill.frequency);

        if (!randomType) return;

        const bill = document.createElement('img');
        bill.src = randomType.image;
        bill.classList.add('falling');
        bill.style.position = 'absolute';
        bill.style.top = '-50px'; // Start falling from higher up
        bill.style.left = `${Math.random() * (game.clientWidth - 30)}px`;
        bill.style.width = '5vw';
        game.appendChild(bill);

        const fallInterval = setInterval(() => {
            const billRect = bill.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            if (billRect.top > game.clientHeight + 100) { // Allow it to fall further down
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

    function createFallingBitcoin() {
        const bitcoin = document.createElement('img');
        bitcoin.src = 'Assets/Bitcoin.webp';
        bitcoin.classList.add('falling');
        bitcoin.style.position = 'absolute';
        bitcoin.style.top = '-50px'; // Start falling from higher up
        bitcoin.style.left = `${Math.random() * (game.clientWidth - 30)}px`;
        bitcoin.style.width = '3vw';
        game.appendChild(bitcoin);

        const fallInterval = setInterval(() => {
            const bitcoinRect = bitcoin.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            if (bitcoinRect.top > game.clientHeight + 100) { // Allow it to fall further down
                clearInterval(fallInterval);
                bitcoin.remove();
            } else if (
                bitcoinRect.bottom >= playerRect.top &&
                bitcoinRect.right >= playerRect.left &&
                bitcoinRect.left <= playerRect.right
            ) {
                clearInterval(fallInterval);
                bitcoin.remove();
                score += 1000;
                updateScore();
            } else {
                bitcoin.style.top = `${bitcoin.offsetTop + 15}px`;
            }
        }, 50);
    }

    characters.forEach(character => {
        character.addEventListener('click', (event) => {
            const selected = character.getAttribute('data-character');
            selectedCharacter = selected;
            playerSpeed = characterStats[selected].speed;
            playerSize = characterStats[selected].size;
            player.src = characterStats[selected].image;
            player.style.width = playerSize;
            player.style.height = playerSize;
            player.style.display = 'block';
            document.querySelectorAll('.character img').forEach(img => img.classList.remove('selected'));
            character.querySelector('img').classList.add('selected');
        });
    });

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        const playerRect = player.getBoundingClientRect();
        const gameRect = game.getBoundingClientRect(); // Get game container's bounding rect

        // Adjust boundaries to allow full movement within the game container
        if (key === 'ArrowLeft' && playerRect.left > gameRect.left) {
            player.style.left = `${Math.max(0, player.offsetLeft - playerSpeed)}px`;
        }
        if (key === 'ArrowRight' && playerRect.right < gameRect.right) {
            player.style.left = `${Math.min(game.clientWidth - player.clientWidth, player.offsetLeft + playerSpeed)}px`;
        }
    });

    startGameButton.addEventListener('click', () => {
        startGame();
    });
});
