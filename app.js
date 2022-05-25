const game = document.querySelector('.game');
const startScreen = document.querySelector('.start-screen');
const gameScreen = document.querySelector('.game-screen');
const startBtn = document.querySelector('.btn-start');
const pveBtn = document.querySelector('.btn-pve');
const pvpBtn = document.querySelector('.btn-pvp');
const gameMode = document.querySelector('.game-mode-buttons');
const players = document.querySelector('.players');
const submitBtn = document.querySelector('.btn-submit');

startBtn.addEventListener('click', (e) =>
  handleTransition(e, startBtn, gameMode)
);
pvpBtn.addEventListener('click', (e) => handleTransition(e, gameMode, players));
submitBtn.addEventListener('click', handleStartGame);

function handleStartGame(e) {
  e.preventDefault();

  handleTransition(e, startScreen, gameScreen);
}

function handleTransition(e, fadeOutElement, fadeInElement) {
  fadeOutElement.style.opacity = '0';
  fadeOutElement.addEventListener('transitionend', handleTransitionEnd);

  function handleTransitionEnd(e) {
    fadeOutElement.removeEventListener('transitionend', handleTransitionEnd);
    fadeInElement.style.display = 'flex';
    fadeOutElement.style.display = 'none';
    fadeInElement.style.opacity = '1';
  }
}
