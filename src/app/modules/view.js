import { createElement } from './helpers';

class View {
  constructor() {
    this.elements = {
      p1Board: document.getElementById('p1-board'),
      p2Board: document.getElementById('p2-board'),
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

  bindCells(handler) {
    for (const cell of this.elements.p2Board.children) {
      cell.addEventListener('click', (evt) => {
        const i = parseInt(evt.target.dataset.index, 10);

        const opponent = handler(i);
        const oppBoard = opponent.board.board;

        if (opponent) {
          if (oppBoard[i].ship && oppBoard[i].isShot) {
            cell.style.backgroundColor = 'green';
          } else if (oppBoard[i].ship && opponent.name === 'p1') {
            cell.style.backgroundColor = 'gray';
          } else if (oppBoard[i].ship === null && oppBoard[i].isShot) {
            cell.style.backgroundColor = 'red';
          } else {
            cell.style.backgroundColor = 'white';
          }
        }
      });
    }
  }
}

export default View;
