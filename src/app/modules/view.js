import {
  createElement,
  getCellColor,
} from './helpers';

class View {
  constructor() {
    const startButton = createElement('button', 'start-button');
    startButton.innerText = 'Start';

    this.elements = {
      p1GameWindow: document.getElementById('p1-window'),
      p2GameWindow: document.getElementById('p2-window'),
      p1Board: document.getElementById('p1-board'),
      p2Board: document.getElementById('p2-board'),
      gameMessage: document.getElementById('message-window'),

      startButton,
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

  renderStartButton() {
    this.elements.gameMessage.innerText = '';

    this.elements.gameMessage.appendChild(this.elements.startButton);
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
          this.renderStartButton();
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
          cell.style.backgroundColor = getCellColor(outcome, i);

          if (outcome.winner) {
            const message = (player.name === 'p1') ? 'You won!' : 'You lost...';
            this.setGameMessage(message);
            this.resetBoardEventListeners('p2');
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

      this.renderStartButton();
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
      handler();

      this.elements.gameMessage.innerHTML = '';
      this.elements.p1GameWindow.removeChild(this.elements.p1GameWindow.lastChild);
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
