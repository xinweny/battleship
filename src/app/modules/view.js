import {
  createElement,
} from './helpers';

class View {
  constructor() {
    const startButton = createElement('button', 'start-button');
    startButton.innerText = 'Start Game';

    const restartButton = createElement('button', 'restart-button');
    restartButton.innerText = 'Restart';

    const turnCounter = createElement('p');
    turnCounter.id = 'turn-counter';
    turnCounter.innerText = 'Turn 1';

    this.elements = {
      p1GameWindow: document.getElementById('p1-window'),
      p2GameWindow: document.getElementById('p2-window'),
      p1Board: document.getElementById('p1-board'),
      p2Board: document.getElementById('p2-board'),
      messageWindow: document.getElementById('message-window'),
      gameMessage: document.querySelector('.game-message'),

      startButton,
      restartButton,
      turnCounter,
    };
  }

  renderBoard(player) {
    const grid = document.getElementById(`${player.name}-board`);

    grid.innerHTML = '';
    this.elements[`${player.name}GameWindow`].style.display = 'block';

    const { board } = player.board;

    for (let i = 0; i < 100; i += 1) {
      const cell = createElement('div', 'cell');
      cell.setAttribute('data-index', i);

      if (board[i].ship) {
        cell.classList.add('has-ship');
      }

      grid.append(cell);
    }
  }

  colorBoard(board) {
    for (let i = 0; i < 100; i += 1) {
      const cell = this.elements.p1Board.children[i];
      cell.className = 'cell';

      if (board[i].ship != null) cell.classList.add('has-ship');
    }
  }

  setMessage(text, resetWindow = false) {
    if (resetWindow) this.renderInMessageWindow(this.elements.gameMessage);

    this.elements.gameMessage.innerText = text;
  }

  renderStartScreen() {
    this.setMessage('Place your carrier (Press space to rotate)', true);

    const gameButtons = createElement('div', 'game-buttons');

    const randomButton = createElement('button', 'random-button');
    randomButton.innerText = 'Random';
    const resetButton = createElement('button', 'reset-button');
    resetButton.innerText = 'Reset';

    gameButtons.append(randomButton);
    gameButtons.append(resetButton);

    this.elements.randomButton = randomButton;
    this.elements.resetButton = resetButton;

    this.elements.p1GameWindow.append(gameButtons);
    this.elements.p2GameWindow.style.display = 'none';
  }

  renderInMessageWindow(element) {
    this.elements.messageWindow.innerHTML = '';

    this.elements.messageWindow.append(element);
  }

  renderBoardInfo(player) {
    const boardInfo = createElement('div', 'board-info');
    boardInfo.id = `${player.name}-board-info`;

    const { ships } = player;

    Object.keys(ships).forEach((ship) => {
      const shipName = (ship === 'patrolBoat') ? 'patrol boat' : ship;

      const shipText = createElement('p', 'ship-name');
      shipText.innerText = shipName;

      boardInfo.append(shipText);
    });

    Object.keys(ships).forEach((ship) => {
      const progressMeter = createElement('meter', 'progress-meter');
      progressMeter.id = `${player.name}-${ship}-meter`;

      progressMeter.setAttribute('value', 0);
      progressMeter.setAttribute('min', 0);
      progressMeter.setAttribute('max', ships[ship].length);

      boardInfo.append(progressMeter);
    });

    this.elements[`${player.name}GameWindow`].append(boardInfo);
  }

  bindMouseOverCell(handler) {
    const cells = this.elements.p1Board.children;

    for (const cell of cells) {
      cell.addEventListener('mouseover', (evt) => {
        const i = parseInt(evt.target.dataset.index, 10);

        const outcome = handler(i);

        if (outcome.viewLocs) {
          const cellClass = (outcome.valid) ? 'valid' : 'invalid';

          for (const boardCell of outcome.boardState) {
            const index = outcome.boardState.indexOf(boardCell);
            const viewCell = this.elements.p1Board.querySelector(`.cell[data-index="${index}"]`);

            if (outcome.viewLocs.includes(index) && !boardCell.ship) {
              viewCell.classList.add(cellClass);
            } else if (boardCell.ship) {
              viewCell.classList.add('has-ship');
            } else {
              viewCell.className = 'cell';
            }
          }
        }
      });
    }
  }

  bindPressSpaceKey(handler) {
    document.addEventListener('keyup', (evt) => {
      if (evt.code === 'Space') {
        const cell = [...document.querySelectorAll(':hover')].slice(-1)[0];

        if (cell.classList.contains('cell')) {
          handler();

          const mouseoverEvent = new Event('mouseover');
          cell.dispatchEvent(mouseoverEvent);
        }
      }
    });
  }

  bindClickPlacementCell(handler) {
    this.elements.p1Board.addEventListener('click', (evt) => {
      const index = parseInt(evt.target.dataset.index, 10);
      const clickedCell = this.elements.p1Board.children[index];

      if (clickedCell.classList.contains('valid')) {
        const info = handler(index);

        this.colorBoard(info.board);

        const nextShip = (info.nextShip === 'patrolBoat') ? 'patrol boat' : info.nextShip;

        if (nextShip != null) {
          this.setMessage(`Place your ${nextShip} (Press space to rotate)`);
        } else {
          this.renderInMessageWindow(this.elements.startButton);
        }
      }
    });
  }

  bindClickOpponentCell(handler, player) {
    const cells = (player.name === 'p1') ? this.elements.p2Board.children : this.elements.p1Board.children;

    for (const cell of cells) {
      cell.addEventListener('click', (evt) => {
        const i = parseInt(evt.target.dataset.index, 10);

        const outcome = handler(i);

        if (outcome.validMove) {
          const oppBoard = outcome.opponent.board.board;
          const { ship } = oppBoard[i];

          if (player.name === 'p1') this.elements.turnCounter.innerText = `Turn ${outcome.turnCount}`;

          cell.classList.add('hit');

          if (ship && oppBoard[i].isShot) {
            const shipName = (ship === 'patrolBoat') ? 'patrol boat' : ship;
            this.setMessage(`You hit the ${shipName}`);

            const progressMeter = document.getElementById(`${outcome.opponent.name}-${ship}-meter`);
            const newValue = parseInt(progressMeter.getAttribute('value'), 10) + 1;
            progressMeter.setAttribute('value', newValue);

            if (outcome.winner) {
              const message = (player.name === 'p1') ? 'You won!' : 'You lost...';
              this.setMessage(message);
              this.resetBoardEventListeners('p2');
            }
          } else if (!outcome.winner) {
            this.setMessage('');
          }
        } else if (player.name === 'p1' && !outcome.winner) {
          this.setMessage('You already shot at that cell');
        }
      });
    }
  }

  bindClickRandomButton(handler) {
    this.elements.randomButton.addEventListener('click', () => {
      const board = handler();

      this.colorBoard(board);
      this.elements.messageWindow.innerHTML = '';
      this.elements.messageWindow.append(this.elements.startButton);
    });
  }

  bindClickResetButton(handler) {
    this.elements.resetButton.addEventListener('click', () => {
      const board = handler();

      this.colorBoard(board);

      this.setMessage('Place your carrier (Press space to rotate)', true);
    });
  }

  bindClickStartButton(handler) {
    this.elements.startButton.addEventListener('click', () => {
      this.elements.p1GameWindow.removeChild(this.elements.p1GameWindow.lastChild);

      for (const window of ['p1GameWindow', 'p2GameWindow']) {
        const label = createElement('p', 'window-label');
        label.innerText = (window === 'p1GameWindow') ? 'Computer' : 'Player';
        this.elements[window].prepend(label);
      }

      handler();

      this.setMessage('Click to fire a shot', true);

      this.elements.messageWindow.append(this.elements.turnCounter);
      this.elements.messageWindow.append(this.elements.restartButton);
    });
  }

  bindClickRestartButton(handler) {
    this.elements.restartButton.addEventListener('click', () => {
      for (const window of ['p1GameWindow', 'p2GameWindow']) {
        const playerWindow = this.elements[window];

        playerWindow.removeChild(playerWindow.firstChild);
        playerWindow.removeChild(playerWindow.lastChild);
      }

      handler();
    });
  }

  resetBoardEventListeners(playerName) {
    const oldBoard = this.elements[`${playerName}Board`];

    const cloneBoard = oldBoard.cloneNode(true);
    oldBoard.parentNode.replaceChild(cloneBoard, oldBoard);

    this.elements[`${playerName}Board`] = cloneBoard;
  }

  getCell(playerName, index) {
    const board = this.elements[`${playerName}Board`];

    return board.children[index];
  }
}

export default View;
