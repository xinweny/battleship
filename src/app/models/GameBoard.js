const Ship = require('./Ship');
const { checkCollisions } = require('../modules/helpers');

class GameBoard {
  constructor() {
    this.board = [];

    for (let i = 0; i < 100; i += 1) {
      this.board.push({ ship: null, isShot: false });
    }

    this.ships = {
      carrier: new Ship(5, 'carrier'),
      battleship: new Ship(4, 'battleship'),
      cruiser: new Ship(3, 'cruiser'),
      submarine: new Ship(3, 'submarine'),
      patrolBoat: new Ship(2, 'patrolBoat'),
    };
  }

  placeShip(shipName, start, axis) {
    const ship = this.ships[shipName];

    const locs = [...Array(ship.length).keys()].map((n) => ((axis === 'x') ? start + n : start + (n * 10)));

    const isValid = checkCollisions(locs, axis, this.board);

    if (isValid) {
      for (const loc of locs) {
        this.board[loc].ship = ship.name;
      }

      return true;
    }

    return false;
  }

  isShotHit(loc) {
    return this.board[loc].isShot && this.board[loc].ship != null;
  }

  receiveAttack(loc) {
    const moveInfo = {
      target: null,
      cell: loc,
    };

    if (!this.board[loc].isShot) {
      this.board[loc].isShot = true;

      moveInfo.target = this.board[loc].ship;

      if (moveInfo.target) this.ships[moveInfo.target].hit();
    }

    return moveInfo;
  }

  shipAt(loc) {
    return this.ships[this.board[loc].ship];
  }

  shipsSunk() {
    let sunk = 0;

    Object.keys(this.ships).forEach((shipName) => {
      if (this.ships[shipName].isSunk()) {
        sunk += 1;
      }
    });

    return sunk;
  }
}

module.exports = GameBoard;
