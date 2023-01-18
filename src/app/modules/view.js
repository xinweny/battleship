import {
  createElement,
} from './helpers';

class View {
  constructor() {
    const startButton = createElement('button', 'start-button');
    startButton.innerText = 'Start';

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

      if (player.name === 'p1' && board[i].ship) {
        cell.style.backgroundColor = 'gray';
      }

      grid.appendChild(cell);
    }
  }

  colorBoard(board) {
    for (let i = 0; i < 100; i += 1) {
      const cell = this.elements.p1Board.children[i];
      cell.style.backgroundColor = (board[i].ship == null) ? 'white' : 'gray';
    }
  }

  setMessage(text, resetWindow = false) {
    if (resetWindow) {
      this.elements.messageWindow.innerHTML = '';
      this.elements.messageWindow.appendChild(this.elements.gameMessage);
    }

    this.elements.gameMessage.innerText = text;
  }

  renderStartScreen() {
    this.setMessage('Place your carrier (Press space to rotate)', true);

    const gameButtons = createElement('div', 'game-buttons');

    const randomButton = createElement('button', 'random-button');
    randomButton.innerText = 'Random';
    const resetButton = createElement('button', 'reset-button');
    resetButton.innerText = 'Reset';

    gameButtons.appendChild(randomButton);
    gameButtons.appendChild(resetButton);

    this.elements.randomButton = randomButton;
    this.elements.resetButton = resetButton;

    this.elements.p1GameWindow.appendChild(gameButtons);
    this.elements.p2GameWindow.style.display = 'none';
  }

  renderInMessageWindow(element, resetMessage = false) {
    if (resetMessage) this.elements.gameMessage.innerHTML = '';

    this.elements.messageWindow.appendChild(element);
  }

  renderBoardInfo(player) {
    const boardInfo = createElement('div', 'board-info');
    boardInfo.id = `${player.name}-board-info`;

    const { ships } = player;

    Object.keys(ships).forEach((ship) => {
      const shipName = (ship === 'patrolBoat') ? 'patrol boat' : ship;

      const shipText = createElement('p', 'ship-name');
      shipText.innerText = shipName;

      boardInfo.appendChild(shipText);
    });

    Object.keys(ships).forEach((ship) => {
      const progressMeter = createElement('meter', 'progress-meter');
      progressMeter.id = `${player.name}-${ship}-meter`;

      progressMeter.setAttribute('value', 0);
      progressMeter.setAttribute('min', 0);
      progressMeter.setAttribute('max', ships[ship].length);

      boardInfo.appendChild(progressMeter);
    });

    this.elements[`${player.name}GameWindow`].appendChild(boardInfo);
  }

  bindMouseOverCell(handler) {
    const cells = this.elements.p1Board.children;

    for (const cell of cells) {
      cell.addEventListener('mouseover', (evt) => {
        const i = parseInt(evt.target.dataset.index, 10);

        const outcome = handler(i);

        if (outcome.viewLocs) {
          const cellColor = (outcome.valid) ? 'green' : 'red';

          for (const boardCell of outcome.boardState) {
            const index = outcome.boardState.indexOf(boardCell);
            const viewCell = this.elements.p1Board.querySelector(`.cell[data-index="${index}"]`);

            if (outcome.viewLocs.includes(index)) {
              viewCell.style.backgroundColor = cellColor;
            } else if (boardCell.ship) {
              viewCell.style.backgroundColor = 'gray';
            } else {
              viewCell.style.backgroundColor = 'white';
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

      if (clickedCell.style.backgroundColor === 'green') {
        const info = handler(index);

        this.colorBoard(info.board);

        const nextShip = (info.nextShip === 'patrolBoat') ? 'patrol boat' : info.nextShip;

        if (nextShip != null) {
          this.setMessage(`Place your ${nextShip} (Press space to rotate)`);
        } else {
          this.renderInMessageWindow(this.elements.startButton, true);
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

          if (ship && oppBoard[i].isShot) {
            cell.style.backgroundColor = 'green';

            const shipName = (ship === 'patrolBoat') ? 'patrol boat' : ship;
            this.setMessage(`You hit the ${shipName}.`);

            const progressMeter = document.getElementById(`${outcome.opponent.name}-${ship}-meter`);
            const newValue = parseInt(progressMeter.getAttribute('value'), 10) + 1;
            progressMeter.setAttribute('value', newValue);

            if (outcome.winner) {
              const message = (player.name === 'p1') ? 'You won!' : 'You lost...';
              this.setMessage(message);
              this.resetBoardEventListeners('p2');
            }
          } else {
            cell.style.backgroundColor = 'red';
            if (!outcome.winner) this.setMessage('');
          }
        } else if (player.name === 'p1' && !outcome.winner) {
          this.setMessage('You already shot at that cell.');
        }
      });
    }
  }

  bindClickRandomButton(handler) {
    this.elements.randomButton.addEventListener('click', () => {
      const board = handler();

      this.colorBoard(board);
      this.elements.messageWindow.innerHTML = '';
      this.elements.messageWindow.appendChild(this.elements.startButton);
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

      handler();

      this.setMessage('Click to fire shots.', true);

      this.elements.messageWindow.appendChild(this.elements.turnCounter);
      this.elements.messageWindow.appendChild(this.elements.restartButton);
    });
  }

  bindClickRestartButton(handler) {
    this.elements.restartButton.addEventListener('click', () => {
      for (const window of [this.elements.p1GameWindow, this.elements.p2GameWindow]) {
        window.removeChild(window.lastChild);
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
