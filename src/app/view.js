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
    for (let i = 0; i < 100; i += 1) {
      const cell = this.createElement('div', 'cell');
      cell.setAttribute('data-index', i);

      grid.appendChild(cell);
    }
  }
}

module.exports = View;
