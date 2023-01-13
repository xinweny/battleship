class AI {
  constructor() {
    this.shotsMade = [];
    this.cells = [...Array(100).keys()];
    this.prevShot = null;
    this.shipsSunk = [];
  }

  getRandomShot() {
    const legalMoves = this.cells.filter((index) => !this.shotsMade.includes(index));

    const loc = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    this.shotsMade.push(loc);

    return loc;
  }

  getSmartShot() {
    if (this.prevShot === null) {
      return this.getRandomShot(); // First shot is random
    }

    return null;
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
