import {
  createElement,
} from './helpers';

class View {
  constructor() {
    const startButton = createElement('button', 'start-button');
    startButton.innerText = 'Start';

    const restartButton = createElement('button', 'restart-button');
    restartButton.innerText = 'Restart';

    this.elements = {
      p1GameWindow: document.getElementById('p1-window'),
      p2GameWindow: document.getElementById('p2-window'),
      p1Board: document.getElementById('p1-board'),
      p2Board: document.getElementById('p2-board'),
      gameMessage: document.getElementById('message-window'),

      startButton,
      restartButton,
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

  setGameMessage(text) {
    this.elements.gameMessage.innerHTML = '';

    const message = createElement('p', 'game-message');
    message.innerText = text;
    this.elements.gameMessage.appendChild(message);
  }

  renderStartScreen() {
    this.setGameMessage('Place your carrier (Press space to rotate)');

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

  renderInGameMessage(element, reset = false) {
    if (reset) this.elements.gameMessage.innerHTML = '';

    this.elements.gameMessage.appendChild(element);
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

    Object.keys(ships).forEach(() => {

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
          this.setGameMessage(`Place your ${nextShip} (Press space to rotate)`);
        } else {
          this.renderInGameMessage(this.elements.startButton, true);
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

          if (ship && oppBoard[i].isShot) {
            cell.style.backgroundColor = 'green';

            const shipName = (ship === 'patrolBoat') ? 'patrol boat' : ship;
            this.setGameMessage(`You hit the ${shipName}.`);

            if (outcome.winner) {
              const message = (player.name === 'p1') ? 'You won!' : 'You lost...';
              this.setGameMessage(message);

              this.renderInGameMessage(this.elements.restartButton);
              this.resetBoardEventListeners('p2');
            }
          } else {
            cell.style.backgroundColor = 'red';
            if (!outcome.winner) this.setGameMessage('You missed!');
          }
        } else if (player.name === 'p1' && !outcome.winner) {
          this.setGameMessage('You already shot at that cell.');
        }
      });
    }
  }

  bindClickRandomButton(handler) {
    this.elements.randomButton.addEventListener('click', () => {
      const board = handler();

      this.colorBoard(board);

      this.renderInGameMessage(this.elements.startButton, true);
    });
  }

  bindClickResetButton(handler) {
    this.elements.resetButton.addEventListener('click', () => {
      const board = handler();

      this.colorBoard(board);

      this.setGameMessage('Place your carrier (Press space to rotate)');
    });
  }

  bindClickStartButton(handler) {
    this.elements.startButton.addEventListener('click', () => {
      this.elements.p1GameWindow.removeChild(this.elements.p1GameWindow.lastChild);

      handler();

      this.setGameMessage('Click to fire shots.');
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
