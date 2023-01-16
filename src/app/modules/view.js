import {
  checkForWinner,
  createElement,
  getCellColor,
} from './helpers';

class View {
  constructor() {
    this.elements = {
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
    const startMessage = createElement('h2', 'start-message');
    startMessage.innerText = 'Place your ships';
    this.elements.gameMessage.appendChild(startMessage);
  }

  bindOpponentCells(handler, player) {
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

  getCell(name, index) {
    return this.elements[`${name}Board`].children[index];
  }
}

export default View;
