document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const game = document.getElementById('game');
    const gameWidth = game.clientWidth;
    const playerWidth = player.clientWidth;
    const playerSpeed = 20;

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
});
