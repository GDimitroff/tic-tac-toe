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
  let result = null;
  let isGameOver = false;

  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;

  const setPlayers = (firstPlayer, secondPlayer) => {
    player1 = firstPlayer;
    player2 = secondPlayer;
  };

  const getResult = () => {
    return result;
  };

  const getIsGameOver = () => {
    return isGameOver;
  };

  const playRound = (fieldIndex) => {
    board.setField(fieldIndex, getCurrentPlayerSign());

    if (round === 9 || checkWinner(fieldIndex)) {
      if (checkWinner(fieldIndex)) {
        result = getCurrentPlayerName();
      } else {
        result = 'draw';
      }

      displayController.openEndGameModal(result);
      isGameOver = true;
      return;
    }

    round++;
    displayController.setMessage(
      `Turn: ${getCurrentPlayerName()} (${getCurrentPlayerSign()})`
    );
  };

  const reset = () => {
    round = 1;
    isGameOver = false;
    result = null;
  };

  const checkWinner = (fieldIndex) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions
      .filter((combination) => combination.includes(fieldIndex))
      .some((possibleCombination) =>
        possibleCombination.every(
          (index) => board.getField(index) === getCurrentPlayerSign()
        )
      );
  };

  const getCurrentPlayerName = () => {
    return round % 2 === 1 ? player1.getName() : player2.getName();
  };

  const getCurrentPlayerSign = () => {
    return round % 2 === 1 ? player1.getSign() : player2.getSign();
  };

  return {
    getPlayer1,
    getPlayer2,
    setPlayers,
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
      `Turn: ${gameController.getPlayer1().getName()} (${gameController
        .getPlayer1()
        .getSign()})`
    );
  });

  const updateBoard = (fieldIndex) => {
    fields[fieldIndex].children[0].textContent = board.getField(fieldIndex);
    fields[fieldIndex].children[0].classList.add('active');
  };

  const resetBoard = () => {
    fields.forEach((field) => {
      field.children[0].classList.remove('active');
      field.children[0].textContent = '';
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

  return { setMessage, openEndGameModal };
})();
