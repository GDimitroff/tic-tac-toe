const startScreen = document.querySelector('.start-screen');
const startBtn = document.querySelector('.btn-start');
const pveBtn = document.querySelector('.btn-pve');
const pvpBtn = document.querySelector('.btn-pvp');
const gameMode = document.querySelector('.game-mode-buttons');

startBtn.addEventListener('click', handleStartGame);

function handleStartGame(e) {
  startBtn.style.opacity = '0';
  startBtn.style.transition = 'all 0.4s ease-in-out';
  gameMode.style.display = 'flex';

  startBtn.addEventListener('transitionend', handleTransitionEnd);

  function handleTransitionEnd(e) {
    startScreen.removeEventListener('transitionend', handleTransitionEnd);
    startBtn.style.display = 'none';
    gameMode.style.opacity = '1';
  }
}
