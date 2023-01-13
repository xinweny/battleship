class AI {
  constructor() {
    this.shots = [];
    this.cells = [...Array(100).keys()];
  }

  getRandomShot() {
    const legalMoves = this.cells.filter((index) => !this.shots.includes(index));

    const loc = legalMoves[Math.floor(Math.random() * legalMoves.length)];

    return loc;
  }

  placeShips() {
    const axes = ['x', 'y'];

    Object.keys(this.ships).forEach((shipName) => {
      let validPlacement = false;

      while (!validPlacement) {
        const loc = this.cells[Math.floor(Math.random() * 100)];
        const axis = axes[Math.floor(Math.random() * 2)];

        validPlacement = this.board.placeShip(shipName, loc, axis);
      }
    });
  }

  clickCell(cell) {
    cell.click();
  }
}

module.exports = AI;
