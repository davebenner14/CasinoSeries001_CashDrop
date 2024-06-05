document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const game = document.getElementById('game');
    const scoreBoard = document.getElementById('score');
    const timerBoard = document.getElementById('timer');
    const startMenu = document.getElementById('startMenu');
    const gameContainer = document.getElementById('gameContainer');
    const startGameButton = document.getElementById('startGameButton');
    const musicToggleButton = document.getElementById('musicToggleButton');
    const characters = document.querySelectorAll('.character');
    const speedMeter = document.getElementById('speedMeter');
    const characterSelectMessage = document.getElementById('characterSelectMessage');
    let score = 0;
    let gameInterval;
    let gameTimer;
    let selectedCharacter = 'girl';
    let playerSpeed;
    let timeLeft = 60;
    let coinsCollected = 0;
    let billsCollected = 0;
    let bitcoinsCollected = 0;
    let bonusesCollected = 0;
    let bonusActive = false;
    let bonusQueue = [];
    let scoreMultiplier = 1;
    let moveDirection = null;
    let moveInterval;

    const billTypes = [
        { type: '5', value: 5, frequency: 0.3, speed: 2, image: 'Assets/5Bill.jpg' },
        { type: '10', value: 10, frequency: 0.25, speed: 2, image: 'Assets/10Bill.jpg' },
        { type: '20', value: 20, frequency: 0.2, speed: 2, image: 'Assets/20Bill.jpg' },
        { type: '50', value: 50, frequency: 0.15, speed: 2, image: 'Assets/50Bill.jpg' },
        { type: '100', value: 100, frequency: 0.1, speed: 2, image: 'Assets/100Bill.jpg' }
    ];

    const characterStats = {
        'fatman': { speed: 1, size: '17vw', image: 'Assets/Fatman.png', description: 'Fatman: Larger but slower', initialSpeed: 1 },
        'girl': { speed: 3, size: '10vw', image: 'Assets/Girl.png', description: 'Girl: Smaller but normal speed', initialSpeed: 3 },
        'ninja': { speed: 4, size: '6.5vw', image: 'Assets/Ninja.png', description: 'Ninja: Normal size but faster', initialSpeed: 4 }
    };

    const bonusTypes = [
        { type: 'speed', image: 'Assets/SpeedUp.png', effect: increaseSpeed },
        { type: 'time', image: 'Assets/TimeUp.png', effect: () => timeLeft += 30 },
        { type: '2000', image: 'Assets/2x.png', effect: () => score += 2000 },
        { type: '3000', image: 'Assets/3x.png', effect: () => score += 3000 }
    ];

    const songs = [
        new Audio('Assets/Algar_-_Come_to_beatbox!.mp3'),
        new Audio('Assets/Dubmood_You_Can_Do_It_(but_not_like_we_do_it)_feat_Zabutom_(2003).mp3'),
        new Audio('Assets/Keygen_8_-_Dubmood.mp3')
    ];
    let currentSongIndex = 0;
    let isMusicPlaying = true;

    function playRandomSong() {
        songs[currentSongIndex].pause();
        currentSongIndex = Math.floor(Math.random() * songs.length);
        songs[currentSongIndex].play();
        songs[currentSongIndex].loop = true;
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            songs[currentSongIndex].pause();
        } else {
            playRandomSong();
        }
        isMusicPlaying = !isMusicPlaying;
    }

    musicToggleButton.addEventListener('click', toggleMusic);

    function increaseSpeed() {
        if (playerSpeed < 10) {
            playerSpeed += 1;
        }
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
        playRandomSong();
    }

    function stopGame() {
        clearInterval(gameInterval);
        clearInterval(gameTimer);
        clearInterval(moveInterval);
        const fallingObjects = document.querySelectorAll('.falling');
        fallingObjects.forEach(obj => obj.remove());
        const gameOverEvent = new CustomEvent('gameOver', { detail: { score } });
        window.dispatchEvent(gameOverEvent);
        gameContainer.style.display = 'none';
        startMenu.style.display = 'none';
        songs[currentSongIndex].pause();
    }

    function resetCharacterSelect() {
        characters.forEach(character => {
            const img = character.querySelector('img');
            img.classList.remove('selected');
        });
        selectedCharacter = 'girl';
        playerSpeed = characterStats[selectedCharacter].speed;
        updateSpeedMeter();
    }

    function resetGame() {
        player.style.display = 'none';
        player.style.width = '';
        player.style.height = '';
        player.style.left = '';
        player.style.bottom = '';
        player.style.transform = '';
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
        const maxSpeed = 10;
        speedMeter.innerHTML = '';
        for (let i = 1; i <= maxSpeed; i++) {
            const bar = document.createElement('div');
            bar.classList.add('speed-bar');
            bar.style.backgroundColor = i <= playerSpeed ? getSpeedColor(i) : '#333';
            speedMeter.appendChild(bar);
        }
    }

    function getSpeedColor(speed) {
        if (speed <= 3) return 'green';
        if (speed <= 6) return 'yellow';
        return 'red';
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
        bird.style.width = '5vw';
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
            player.style.width = characterStats[selected].size;
            player.style.height = characterStats[selected].size;
            player.src = characterStats[selected].image;
            updateSpeedMeter();
            document.querySelectorAll('.character img').forEach(img => img.classList.remove('selected'));
            character.querySelector('img').classList.add('selected');
            characterSelectMessage.classList.add('hidden');
        });
    });

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        const playerRect = player.getBoundingClientRect();
        const gameRect = game.getBoundingClientRect();
        const buffer = game.clientWidth * 0.1;

        if (key === 'ArrowLeft' && playerRect.left > gameRect.left - buffer) {
            player.style.left = `${Math.max(-buffer, player.offsetLeft - playerSpeed)}px`;
        }
        if (key === 'ArrowRight' && playerRect.right < gameRect.right + buffer) {
            player.style.left = `${Math.min(game.clientWidth - player.clientWidth + buffer, player.offsetLeft + playerSpeed)}px`;
        }
    });

    game.addEventListener('mousedown', (event) => {
        const playerRect = player.getBoundingClientRect();
        const clickX = event.clientX;
        const playerCenterX = playerRect.left + playerRect.width / 2;

        if (clickX < playerCenterX) {
            moveDirection = 'left';
        } else {
            moveDirection = 'right';
        }

        movePlayer();

        moveInterval = setInterval(() => {
            movePlayer();
        }, 50);
    });

    game.addEventListener('mouseup', () => {
        clearInterval(moveInterval);
        moveDirection = null;
    });

    game.addEventListener('mouseleave', () => {
        clearInterval(moveInterval);
        moveDirection = null;
    });

    game.addEventListener('touchstart', (event) => {
        const touchX = event.touches[0].clientX;
        const playerRect = player.getBoundingClientRect();
        const playerCenterX = playerRect.left + playerRect.width / 2;

        if (touchX < playerCenterX) {
            moveDirection = 'left';
        } else {
            moveDirection = 'right';
        }

        movePlayer();

        moveInterval = setInterval(() => {
            movePlayer();
        }, 50);
    });

    game.addEventListener('touchend', () => {
        clearInterval(moveInterval);
        moveDirection = null;
    });

    game.addEventListener('touchcancel', () => {
        clearInterval(moveInterval);
        moveDirection = null;
    });

    function movePlayer() {
        if (moveDirection === 'left') {
            movePlayerLeft();
        } else if (moveDirection === 'right') {
            movePlayerRight();
        }
    }

    function movePlayerLeft() {
        const playerRect = player.getBoundingClientRect();
        const gameRect = game.getBoundingClientRect();
        const buffer = game.clientWidth * 0.1;

        if (playerRect.left > gameRect.left - buffer) {
            player.style.left = `${Math.max(-buffer, player.offsetLeft - playerSpeed)}px`;
        }
    }

    function movePlayerRight() {
        const playerRect = player.getBoundingClientRect();
        const gameRect = game.getBoundingClientRect();
        const buffer = game.clientWidth * 0.1;

        if (playerRect.right < gameRect.right + buffer) {
            player.style.left = `${Math.min(game.clientWidth - player.clientWidth + buffer, player.offsetLeft + playerSpeed)}px`;
        }
    }

    startGameButton.addEventListener('click', () => {
        startGame();
    });

    backToMenuButton.addEventListener('click', () => {
        highScoreContainer.style.display = 'none';
        startMenu.style.display = 'flex';
    });
});
