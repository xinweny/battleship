import {
  checkForWinner,
  createElement,
  getCellColor,
} from './helpers';

class View {
  constructor() {
    this.elements = {
      p1GameWindow: document.getElementById('p1-window'),
      p2GameWindow: document.getElementById('p2-window'),
      p1Board: document.getElementById('p1-board'),
      p2Board: document.getElementById('p2-board'),
      gameMessage: document.getElementById('message-window'),
    };
  }

  renderBoard(player) {
    const grid = document.getElementById(`${player.name}-board`);

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

  renderStartScreen() {
    this.elements.gameMessage.innerText = 'Place your carrier (Press space to rotate)';

    const gameButtons = createElement('div', 'game-buttons');

    const randomButton = createElement('button', 'random-button');
    randomButton.innerText = 'Random';
    const resetButton = createElement('button', 'reset-button');
    resetButton.innerText = 'Reset';
    const startButton = createElement('button', 'start-button');
    startButton.innerText = 'Start';

    gameButtons.appendChild(randomButton);
    gameButtons.appendChild(resetButton);
    gameButtons.appendChild(startButton);

    this.elements.p1GameWindow.appendChild(gameButtons);
    this.elements.p2GameWindow.style.display = 'none';
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

        for (let i = 0; i < 100; i += 1) {
          const cell = this.elements.p1Board.children[i];
          cell.style.backgroundColor = (info.board[i].ship == null) ? 'white' : 'gray';
        }

        if (info.nextShip != null) {
          this.elements.gameMessage.innerText = `Place your ${info.nextShip} (Press space to rotate)`;
        } else {
          // Render start button
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

        if (outcome && outcome.validMove) {
          cell.style.backgroundColor = getCellColor(outcome, i);

          checkForWinner(outcome);
        } else if (player.name === 'p1') {
          console.log('Invalid move!');
        }
      });
    }
  }

  resetBoardEventListeners() {
    const p1Board = this.elements.p1Board.cloneNode(true);
    this.elements.p1Board.parentNode.replaceChild(p1Board, this.elements.p1Board);

    this.elements.p1Board = p1Board;
  }
}

export default View;
