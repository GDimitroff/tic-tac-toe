const Player = (name, sign, color) => {
  const getName = () => name;
  const getSign = () => sign;
  const getColor = () => color;

  return { getName, getSign, getColor };
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
  let currentPlayer = null;
  let round = 1;
  let result = null;
  let isGameOver = false;

  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;

  const setPlayers = (firstPlayer, secondPlayer) => {
    player1 = firstPlayer;
    player2 = secondPlayer;
    currentPlayer = firstPlayer;
  };

  const getCurrentPlayer = () => {
    return currentPlayer;
  };

  const setCurrentPlayer = () => {
    currentPlayer === player1
      ? (currentPlayer = player2)
      : (currentPlayer = player1);
  };

  const getResult = () => {
    return result;
  };

  const getIsGameOver = () => {
    return isGameOver;
  };

  const playRound = (fieldIndex) => {
    board.setField(fieldIndex, getCurrentPlayer().getSign());
    const winCombination = checkWinner(fieldIndex);

    if (round === 9 || winCombination) {
      if (winCombination) {
        result = getCurrentPlayer().getName();
        displayController.highlightCombination(winCombination);
      } else {
        result = 'Draw';
      }

      isGameOver = true;
      displayController.openEndGameModal(result);
      return;
    }

    round++;
  };

  const reset = () => {
    round = 1;
    isGameOver = false;
    result = null;
    currentPlayer = player1;
  };

  const checkWinner = (fieldIndex) => {
    const winCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winCombinations
      .filter((combination) => combination.includes(fieldIndex))
      .find((winCombination) =>
        winCombination.every(
          (index) => board.getField(index) === getCurrentPlayer().getSign()
        )
      );
  };

  return {
    getPlayer1,
    getPlayer2,
    setPlayers,
    getCurrentPlayer,
    setCurrentPlayer,
    playRound,
    getResult,
    getIsGameOver,
    reset,
  };
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
    message.style.color = gameController.getCurrentPlayer().getColor();
  };

  fields.forEach((field) => {
    field.addEventListener('click', (e) => {
      if (field.children[0].textContent !== '') {
        return;
      }

      if (gameController.getIsGameOver()) {
        displayController.openEndGameModal(gameController.getResult());
        return;
      }

      const fieldIndex = parseInt(e.target.dataset.index);
      gameController.playRound(fieldIndex);
      updateBoard(fieldIndex);
    });
  });

  restartBtn.addEventListener('click', (e) => {
    board.reset();
    gameController.reset();
    resetBoard();
    setMessage(
      `${gameController.getPlayer1().getName()}'s turn: (${gameController
        .getPlayer1()
        .getSign()})`
    );
  });

  const updateBoard = (fieldIndex) => {
    const fieldTextElement = fields[fieldIndex].children[0];

    fieldTextElement.textContent = board.getField(fieldIndex);
    fieldTextElement.classList.add('active');

    fieldTextElement.style.color = gameController.getCurrentPlayer().getColor();

    if (gameController.getIsGameOver()) {
      return;
    }

    gameController.setCurrentPlayer();
    const currentPlayer = gameController.getCurrentPlayer();

    setMessage(
      `${currentPlayer.getName()}'s turn: (${currentPlayer.getSign()})`
    );
  };

  const resetBoard = () => {
    fields.forEach((field) => {
      field.children[0].classList.remove('active');
      field.children[0].textContent = '';
      field.style.background = 'var(--primary-light)';
    });
  };

  const highlightCombination = (combination) => {
    combination.forEach((fieldIndex) => {
      fields[fieldIndex].style.background = 'var(--secondary-light)';
    });
  };

  const openEndGameModal = (result) => {
    console.log(result);
  };

  startBtn.addEventListener('click', (e) =>
    handleTransition(e, startBtn, gameMode)
  );
  pvpBtn.addEventListener('click', (e) =>
    handleTransition(e, gameMode, players)
  );
  form.addEventListener('submit', handleStartGame);
  backBtn.addEventListener('click', (e) => {
    board.reset();
    gameController.reset();
    resetBoard();

    handleTransition(e, gameScreen, startScreen);
  });

  function handleStartGame(e) {
    e.preventDefault();

    handleTransition(e, startScreen, gameScreen);

    const formData = new FormData(e.target);
    const { player1: firstPlayerName, player2: secondPlayerName } =
      Object.fromEntries(formData);

    const firstPlayer = Player(firstPlayerName, 'X', 'var(--primary-dark)');
    const secondPlayer = Player(secondPlayerName, 'O', 'var(--primary-teal)');
    gameController.setPlayers(firstPlayer, secondPlayer);
    setMessage(
      `${gameController.getPlayer1().getName()}'s turn: (${gameController
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

  return {
    setMessage,
    highlightCombination,
    openEndGameModal,
  };
})();
