const startScreen = document.querySelector('.start-screen');
const start = document.querySelector('.btn-start');
const pveBtn = document.querySelector('.btn-pve');
const pvpBtn = document.querySelector('.btn-pvp');
const gameMode = document.querySelector('.game-mode-buttons');
const players = document.querySelector('.players');

start.addEventListener('click', (e) => handleTransition(e, start, gameMode));
pvpBtn.addEventListener('click', (e) => handleTransition(e, gameMode, players));

function handleTransition(e, fadeOutElement, fadeInElement) {
  fadeOutElement.style.opacity = '0';
  fadeOutElement.style.transition = 'all 0.4s ease-in-out';
  fadeInElement.style.display = 'flex';

  fadeOutElement.addEventListener('transitionend', handleTransitionEnd);

  function handleTransitionEnd(e) {
    fadeOutElement.removeEventListener('transitionend', handleTransitionEnd);
    fadeOutElement.style.display = 'none';
    fadeInElement.style.opacity = '1';
  }
}
