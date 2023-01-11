class AI {
  randomShot(opponent) {
    const oppBoard = opponent.board;
    const legalMoves = oppBoard.board.filter((cell) => !cell.isShot)
      .map((cell) => oppBoard.board.indexOf(cell));

    const loc = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    oppBoard.receiveAttack(loc);

    return loc;
  }

  placeShips() {
    const axes = ['x', 'y'];
    const cells = [...Array(100).keys()];

    Object.keys(this.ships).forEach((shipName) => {
      let validPlacement = false;

      while (!validPlacement) {
        const loc = cells[Math.floor(Math.random() * cells.length)];
        const axis = axes[Math.floor(Math.random() * axes.length)];

        const shipPlaced = this.board.placeShip(shipName, loc, axis);

        if (shipPlaced) {
          validPlacement = true;
        }
      }
    });
  }
}

module.exports = AI;
