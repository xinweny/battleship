class View {
  constructor() {
    this.elements = {
      p1Board: document.getElementById('p1-board'),
      p2Board: document.getElementById('p2-board'),
    };
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;

    return element;
  }

  renderBoard(player) {
    const grid = document.getElementById(`${player.name}-board`);
    const { board } = player.board;

    for (let i = 0; i < 100; i += 1) {
      const cell = this.createElement('div', 'cell');
      cell.setAttribute('data-index', i);

      if (board[i].ship && board[i].isShot) {
        cell.style.backgroundColor = 'red';
      } else if (board[i].ship && player.name === 'p1') {
        cell.style.backgroundColor = 'gray';
      }

      grid.appendChild(cell);
    }
  }
}

module.exports = View;
