document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const game = document.getElementById('game');
    const scoreBoard = document.getElementById('score');
    const timerBoard = document.getElementById('timer');
    const startMenu = document.getElementById('startMenu');
    const gameContainer = document.getElementById('gameContainer');
    const startGameButton = document.getElementById('startGameButton');
    const characters = document.querySelectorAll('.character');
    const speedMeter = document.getElementById('speedMeter');
    let score = 0;
    let gameInterval;
    let gameTimer;
    let selectedCharacter = 'girl';
    let playerSpeed;
    let playerSize;
    let timeLeft = 60;
    let coinsCollected = 0;
    let billsCollected = 0;
    let bitcoinsCollected = 0;
    let bonusesCollected = 0;
    let bonusActive = false;
    let bonusQueue = [];
    let scoreMultiplier = 1;

    const billTypes = [
        { type: '5', value: 5, frequency: 0.3, speed: 2, image: 'Assets/5Bill.jpg' },
        { type: '10', value: 10, frequency: 0.25, speed: 2, image: 'Assets/10Bill.jpg' },
        { type: '20', value: 20, frequency: 0.2, speed: 2, image: 'Assets/20Bill.jpg' },
        { type: '50', value: 50, frequency: 0.15, speed: 2, image: 'Assets/50Bill.jpg' },
        { type: '100', value: 100, frequency: 0.1, speed: 2, image: 'Assets/100Bill.jpg' }
    ];

    const characterStats = {
        'fatman': { speed: 5, size: '17vw', image: 'Assets/Fatman.png', description: 'Fatman: Larger but slower', initialSpeed: 1 },
        'girl': { speed: 8, size: '10vw', image: 'Assets/Girl.png', description: 'Girl: Smaller but normal speed', initialSpeed: 2 },
        'ninja': { speed: 12, size: '6.5vw', image: 'Assets/Ninja.png', description: 'Ninja: Normal size but faster', initialSpeed: 3 }
    };

    const bonusTypes = [
        { type: 'speed', image: 'Assets/SpeedUp.png', effect: increaseSpeed },
        { type: 'time', image: 'Assets/TimeUp.png', effect: () => timeLeft += 30 },
        { type: '2x', image: 'Assets/2x.png', effect: () => score *= 2 },
        { type: '3x', image: 'Assets/3x.png', effect: () => score *= 3 }
    ];

    function increaseSpeed() {
        playerSpeed += 3;
        updateSpeedMeter();
    }

    function startGame() {
        score = 0;
        timeLeft = 60;
        coinsCollected = 0;
        billsCollected = 0;
        bitcoinsCollected = 0;
        bonusesCollected = 0;
        bonusActive = false;
        scoreMultiplier = 1;
        bonusQueue = [];
        playerSpeed = characterStats[selectedCharacter].speed;
        updateScore();
        updateTimer();
        updateSpeedMeter();
        gameContainer.style.display = 'block';
        startMenu.style.display = 'none';
        player.src = characterStats[selectedCharacter].image;
        player.style.width = characterStats[selectedCharacter].size;
        player.style.height = characterStats[selectedCharacter].size;
        player.style.display = 'block';
        player.style.left = '50%';
        player.style.bottom = '0';
        player.style.transform = 'translateX(-50%)';
        gameInterval = setInterval(createFallingObject, 500);
        gameTimer = setInterval(updateGameTimer, 1000);
    }

    function stopGame() {
        clearInterval(gameInterval);
        clearInterval(gameTimer);
        const fallingObjects = document.querySelectorAll('.falling');
        fallingObjects.forEach(obj => obj.remove());
        alert(`Game Over! Your score is: $${score}`);
        resetCharacterSelect();
        startMenu.style.display = 'block';
        gameContainer.style.display = 'none';
    }

    function resetCharacterSelect() {
        characters.forEach(character => {
            const img = character.querySelector('img');
            img.classList.remove('selected');
            img.style.width = '';
            img.style.height = '';
            img.style.display = '';
        });
        selectedCharacter = 'girl';
        playerSpeed = characterStats[selectedCharacter].speed;
        playerSize = characterStats[selectedCharacter].size;
        player.style.width = playerSize;
        player.style.height = playerSize;
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

    function updateSpeedMeter() {
        const initialSpeed = characterStats[selectedCharacter].initialSpeed;
        const speedBars = Math.floor(playerSpeed / initialSpeed);
        speedMeter.innerHTML = '';
        for (let i = 0; i < speedBars; i++) {
            const bar = document.createElement('div');
            bar.classList.add('speed-bar');
            bar.style.backgroundColor = getColorForSpeed(i);
            speedMeter.appendChild(bar);
        }
    }

    function getColorForSpeed(index) {
        const colors = ['green', 'green', 'yellow', 'yellow', 'red', 'red'];
        return colors[Math.min(index, colors.length - 1)];
    }

    function createFallingObject() {
        const randomNum = Math.random();
        if (randomNum < 0.6) {
            createFallingCoin();
        } else if (randomNum < 0.9) {
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
        coin.style.top = '-50px';
        coin.style.left = `${Math.random() * (game.clientWidth - 30)}px`;
        coin.style.width = '3vw';
        game.appendChild(coin);

        const fallInterval = setInterval(() => {
            const coinRect = coin.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            if (coinRect.top > game.clientHeight + 100) {
                clearInterval(fallInterval);
                coin.remove();
            } else if (
                coinRect.bottom >= playerRect.top &&
                coinRect.right >= playerRect.left &&
                coinRect.left <= playerRect.right
            ) {
                clearInterval(fallInterval);
                coin.remove();
                score += 1 * scoreMultiplier;
                coinsCollected++;
                updateScore();
                checkForBonus();
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
        bill.style.top = '-50px';
        bill.style.left = `${Math.random() * (game.clientWidth - 30)}px`;
        bill.style.width = '5vw';
        game.appendChild(bill);

        const fallInterval = setInterval(() => {
            const billRect = bill.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            if (billRect.top > game.clientHeight + 100) {
                clearInterval(fallInterval);
                bill.remove();
            } else if (
                billRect.bottom >= playerRect.top &&
                billRect.right >= playerRect.left &&
                billRect.left <= playerRect.right
            ) {
                clearInterval(fallInterval);
                bill.remove();
                score += randomType.value * scoreMultiplier;
                billsCollected++;
                updateScore();
                checkForBonus();
            } else {
                bill.style.top = `${bill.offsetTop + randomType.speed}px`;
                bill.style.left = `${bill.offsetLeft + Math.sin(Date.now() / 100) * 2}px`;
            }
        }, 50);
    }

    function createFallingBitcoin() {
        const bitcoin = document.createElement('img');
        bitcoin.src = 'Assets/Bitcoin.webp';
        bitcoin.classList.add('falling');
        bitcoin.style.position = 'absolute';
        bitcoin.style.top = '-50px';
        bitcoin.style.left = `${Math.random() * (game.clientWidth - 30)}px`;
        bitcoin.style.width = '3vw';
        game.appendChild(bitcoin);

        const fallInterval = setInterval(() => {
            const bitcoinRect = bitcoin.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            if (bitcoinRect.top > game.clientHeight + 100) {
                clearInterval(fallInterval);
                bitcoin.remove();
            } else if (
                bitcoinRect.bottom >= playerRect.top &&
                bitcoinRect.right >= playerRect.left &&
                bitcoinRect.left <= playerRect.right
            ) {
                clearInterval(fallInterval);
                bitcoin.remove();
                score += 1000 * scoreMultiplier;
                bitcoinsCollected++;
                updateScore();
                checkForBonus();
            } else {
                bitcoin.style.top = `${bitcoin.offsetTop + 15}px`;
            }
        }, 50);
    }

    function checkForBonus() {
        if (coinsCollected >= 5 || billsCollected >= 5 || bitcoinsCollected >= 2) {
            bonusQueue.push({ coins: coinsCollected, bills: billsCollected, bitcoins: bitcoinsCollected });
            coinsCollected = 0;
            billsCollected = 0;
            bitcoinsCollected = 0;
            processBonusQueue();
        }
    }

    function processBonusQueue() {
        if (bonusQueue.length > 0) {
            const bonusData = bonusQueue.shift();
            triggerBonus(bonusData);
            processBonusQueue();
        }
    }

    function triggerBonus(bonusData) {
        const bird = document.createElement('img');
        bird.src = 'Assets/Bird.png';
        bird.classList.add('bird');
        bird.style.position = 'absolute';
        bird.style.top = '0';
        bird.style.left = '-10vw';
        game.appendChild(bird);
        
        const direction = Math.random() > 0.5 ? 1 : -1;
        const targetX = Math.random() * (game.clientWidth - bird.clientWidth);

        const birdInterval = setInterval(() => {
            const currentX = parseFloat(bird.style.left);
            const newX = currentX + direction * 5;
            bird.style.left = `${newX}px`;
            if ((direction === 1 && newX > game.clientWidth) || (direction === -1 && newX < -bird.clientWidth)) {
                clearInterval(birdInterval);
                bird.remove();
            }
        }, 50);

        const dropInterval = setInterval(() => {
            if (Math.random() < 0.02) {
                clearInterval(dropInterval);
                dropBonus(targetX);
            }
        }, 50);
    }

    function dropBonus(targetX) {
        const bonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
        const bonus = document.createElement('img');
        bonus.src = bonusType.image;
        bonus.classList.add('falling');
        bonus.style.position = 'absolute';
        bonus.style.top = '50px';
        bonus.style.left = `${targetX}px`;
        bonus.style.width = '5vw';
        game.appendChild(bonus);

        const fallInterval = setInterval(() => {
            const bonusRect = bonus.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            if (bonusRect.top > game.clientHeight + 100) {
                clearInterval(fallInterval);
                bonus.remove();
                processBonusQueue();
            } else if (
                bonusRect.bottom >= playerRect.top &&
                bonusRect.right >= playerRect.left &&
                bonusRect.left <= playerRect.right
            ) {
                clearInterval(fallInterval);
                bonus.remove();
                bonusType.effect();
                updateScore();
                processBonusQueue();
            } else {
                bonus.style.top = `${bonus.offsetTop + 5}px`;
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
            updateSpeedMeter();
            document.querySelectorAll('.character img').forEach(img => img.classList.remove('selected'));
            character.querySelector('img').classList.add('selected');
        });
    });

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        const playerRect = player.getBoundingClientRect();
        const gameRect = game.getBoundingClientRect();
        const buffer = game.clientWidth * 0.05;

        if (key === 'ArrowLeft' && playerRect.left > gameRect.left - buffer) {
            player.style.left = `${Math.max(-buffer, player.offsetLeft - playerSpeed)}px`;
        }
        if (key === 'ArrowRight' && playerRect.right < gameRect.right + buffer) {
            player.style.left = `${Math.min(game.clientWidth - player.clientWidth + buffer, player.offsetLeft + playerSpeed)}px`;
        }
    });

    startGameButton.addEventListener('click', () => {
        startGame();
    });
});
