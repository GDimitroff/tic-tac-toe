const Player = (name, sign, color) => {
  let score = 0;

  const getName = () => name;
  const getSign = () => sign;
  const getColor = () => color;
  const getScore = () => score;
  const winRound = () => (score += 1);
  const resetScore = () => (score = 0);

  return { getName, getSign, getColor, getScore, winRound, resetScore };
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
    const winCombinations = checkWinner(fieldIndex);

    if (round === 9 || winCombinations.length > 0) {
      if (winCombinations.length > 0) {
        getCurrentPlayer().winRound();
        result = getCurrentPlayer().getName();
        displayController.setPlayersInfo(getPlayer1(), getPlayer2());
        displayController.highlightCombination(winCombinations);
      } else {
        result = 'Draw';
      }

      isGameOver = true;
      return;
    }

    round++;
  };

  const setNewRound = () => {
    round = 1;
    isGameOver = false;
    result = null;
    currentPlayer = player1;
  };

  const reset = () => {
    getPlayer1().resetScore();
    getPlayer2().resetScore();
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
      .filter((winCombination) =>
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
    setNewRound,
    reset,
  };
})();

const displayController = (() => {
  const game = document.querySelector('.game');
  const startScreen = game.querySelector('.start-screen');
  const startBtn = game.querySelector('.btn-start');
  const settingsScreen = game.querySelector('.settings-screen');
  const gameScreen = game.querySelector('.game-screen');
  const pvpBtn = game.querySelector('.btn-pvp');
  const gameMode = game.querySelector('.game-mode-buttons');
  const formContainer = game.querySelector('.form-container');
  const formPvP = game.querySelector('.form-pvp');
  const playersInfo = game.querySelectorAll('.player-info');
  const fields = game.querySelectorAll('.field');
  const optionButtons = game.querySelector('.options');
  const backBtn = game.querySelector('.btn-back');
  const nextRoundBtn = game.querySelector('.btn-next');
  const restartBtn = game.querySelector('.btn-restart');

  startScreen.addEventListener(
    'animationend',
    (e) => {
      startScreen.style.opacity = '1';
    },
    { once: true }
  );

  startBtn.addEventListener('click', (e) =>
    handleScreenTransition(e, startScreen, settingsScreen)
  );

  pvpBtn.addEventListener('click', (e) => {
    pvpBtn.classList.add('active');
    formContainer.style.animation = '0.4s ease-in-out fade-in';

    formContainer.addEventListener(
      'animationend',
      (e) => {
        formContainer.style.opacity = '1';
      },
      { once: true }
    );
  });

  formPvP.addEventListener('submit', (e) => {
    e.preventDefault();

    handleScreenTransition(e, settingsScreen, gameScreen);

    const formData = new FormData(e.target);
    const { player1: firstPlayerName, player2: secondPlayerName } =
      Object.fromEntries(formData);

    const firstPlayer = Player(firstPlayerName, 'X', 'var(--primary-dark)');
    const secondPlayer = Player(secondPlayerName, 'O', 'var(--primary-teal)');

    gameController.setPlayers(firstPlayer, secondPlayer);
    setPlayersInfo(firstPlayer, secondPlayer);
    setEndRoundButtons(false);

    e.target.reset();
  });

  function handleScreenTransition(e, fadeOutScreen, fadeInScreen) {
    fadeOutScreen.style.animation = '0.4s ease-in-out fade-out';

    fadeOutScreen.addEventListener(
      'animationend',
      (e) => {
        fadeOutScreen.style.opacity = '0';
        fadeOutScreen.style.display = 'none';
        fadeInScreen.style.display = 'block';
        fadeInScreen.style.animation = '0.4s ease-in-out fade-in';

        fadeInScreen.addEventListener(
          'animationend',
          (e) => {
            fadeInScreen.style.opacity = '1';
          },
          { once: true }
        );
      },
      { once: true }
    );
  }

  const setPlayersInfo = (firstPlayer, secondPlayer) => {
    playersInfo[0].children[1].textContent = firstPlayer.getName();
    playersInfo[1].children[1].textContent = secondPlayer.getName();
    playersInfo[0].querySelector('.wins').textContent = firstPlayer.getScore();
    playersInfo[1].querySelector('.wins').textContent = secondPlayer.getScore();

    const currentPlayer = gameController.getCurrentPlayer();

    if (currentPlayer.getSign() === 'X') {
      playersInfo[0].classList.add('active');
      playersInfo[1].classList.remove('active');
    } else {
      playersInfo[0].classList.remove('active');
      playersInfo[1].classList.add('active');
    }
  };

  const setEndRoundButtons = (isEndRound) => {
    if (isEndRound) {
      optionButtons.classList.add('active');
    } else {
      optionButtons.classList.remove('active');
    }
  };

  fields.forEach((field) => {
    field.addEventListener('click', (e) => {
      if (
        field.children[0].textContent !== '' ||
        gameController.getIsGameOver()
      ) {
        return;
      }

      const fieldIndex = parseInt(e.target.dataset.index);
      gameController.playRound(fieldIndex);
      updateBoard(fieldIndex);
    });
  });

  const updateBoard = (fieldIndex) => {
    const fieldTextElement = fields[fieldIndex].children[0];

    fieldTextElement.textContent = board.getField(fieldIndex);
    fieldTextElement.classList.add('active');

    fieldTextElement.style.color = gameController.getCurrentPlayer().getColor();

    if (gameController.getIsGameOver()) {
      const result = gameController.getResult();

      setEndRoundButtons(true);
      return;
    }

    gameController.setCurrentPlayer();
    setPlayersInfo(gameController.getPlayer1(), gameController.getPlayer2());
  };

  const resetBoard = () => {
    fields.forEach((field) => {
      field.children[0].classList.remove('active');
      field.children[0].textContent = '';
      field.style.background = 'var(--primary-light)';
    });
  };

  const highlightCombination = (combinations) => {
    combinations.forEach((combination) => {
      combination.forEach((fieldIndex) => {
        fields[fieldIndex].style.background = 'var(--secondary-light)';
      });
    });
  };

  nextRoundBtn.addEventListener('click', (e) => {
    board.reset();
    gameController.setNewRound();
    resetBoard();
    setPlayersInfo(gameController.getPlayer1(), gameController.getPlayer2());
    setEndRoundButtons(false);
  });

  backBtn.addEventListener('click', (e) => {
    board.reset();
    gameController.reset();
    resetBoard();

    handleScreenTransition(e, gameScreen, settingsScreen);
  });

  restartBtn.addEventListener('click', (e) => {
    board.reset();
    gameController.reset();
    resetBoard();
    setPlayersInfo(gameController.getPlayer1(), gameController.getPlayer2());
    setEndRoundButtons(false);
  });

  return {
    setPlayersInfo,
    highlightCombination,
  };
})();
