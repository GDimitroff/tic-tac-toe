const Player = (name, sign) => {
  const getName = () => name;
  const getSign = () => sign;

  return { getName, getSign };
};

const board = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  const getField = (index) => {
    if (index > board.length) return;

    return board[index];
  };

  const setField = (index, sign) => {
    if (index > board.length) return;

    board[index] = sign;
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
    }
  };

  return { getField, setField, reset };
})();

const gameController = (() => {
  let player1 = null;
  let player2 = null;
  let round = 1;

  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;

  const setPlayers = (firstPlayer, secondPlayer) => {
    player1 = firstPlayer;
    player2 = secondPlayer;
  };

  const playRound = (fieldIndex) => {
    board.setField(fieldIndex, getCurrentPlayerSign());

    round++;
    displayController.setMessage(
      `Turn: ${getCurrentPlayerName()} (${getCurrentPlayerSign()})`
    );
  };

  const getCurrentPlayerName = () => {
    return round % 2 === 1 ? player1.getName() : player2.getName();
  };

  const getCurrentPlayerSign = () => {
    return round % 2 === 1 ? player1.getSign() : player2.getSign();
  };

  return { getPlayer1, getPlayer2, setPlayers, playRound };
})();

const displayController = (() => {
  const game = document.querySelector('.game');
  const startScreen = game.querySelector('.start-screen');
  const gameScreen = game.querySelector('.game-screen');
  const startBtn = game.querySelector('.btn-start');
  const pvpBtn = game.querySelector('.btn-pvp');
  const gameMode = game.querySelector('.game-mode-buttons');
  const players = game.querySelector('.players');
  const form = game.querySelector('.players > form');
  const backBtn = game.querySelector('.btn-back');
  const fields = game.querySelectorAll('.field');
  const message = game.querySelector('.message');
  const restartBtn = game.querySelector('.btn-restart');

  const setMessage = (newMessage) => {
    message.textContent = newMessage;
  };

  fields.forEach((field) => {
    field.addEventListener('click', (e) => {
      if (e.target.textContent !== '') return;

      gameController.playRound(parseInt(e.target.dataset.index));
      updateBoard();
    });
  });

  const updateBoard = () => {
    for (let i = 0; i < fields.length; i++) {
      fields[i].textContent = board.getField(i);
    }
  };

  startBtn.addEventListener('click', (e) =>
    handleTransition(e, startBtn, gameMode)
  );
  pvpBtn.addEventListener('click', (e) =>
    handleTransition(e, gameMode, players)
  );
  form.addEventListener('submit', handleStartGame);
  backBtn.addEventListener('click', (e) =>
    handleTransition(e, gameScreen, startScreen)
  );

  function handleStartGame(e) {
    e.preventDefault();

    handleTransition(e, startScreen, gameScreen);

    const formData = new FormData(e.target);
    const { player1: firstPlayerName, player2: secondPlayerName } =
      Object.fromEntries(formData);

    const firstPlayer = Player(firstPlayerName, 'X');
    const secondPlayer = Player(secondPlayerName, 'O');
    gameController.setPlayers(firstPlayer, secondPlayer);
    setMessage(
      `Turn: ${gameController.getPlayer1().getName()} (${gameController
        .getPlayer1()
        .getSign()})`
    );
    e.target.reset();
  }

  function handleTransition(e, fadeOutElement, fadeInElement) {
    if (fadeOutElement.classList.contains('game-mode-buttons')) {
      fadeInElement.style.transform = 'scale(1)';
      return;
    }

    fadeOutElement.style.transform = 'scale(0)';
    fadeOutElement.addEventListener('transitionend', handleTransitionEnd);

    function handleTransitionEnd(e) {
      fadeOutElement.removeEventListener('transitionend', handleTransitionEnd);
      fadeInElement.style.display = 'flex';
      fadeOutElement.style.display = 'none';
      fadeInElement.style.transform = 'scale(1)';
    }
  }

  return { setMessage };
})();
