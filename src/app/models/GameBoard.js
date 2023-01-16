const Ship = require('./Ship');
const { checkEdgeCollisions } = require('../modules/helpers');

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

    const isValid = this.checkCollisions(locs, axis, this.board);

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
      ship: null,
      cell: loc,
    };

    if (!this.board[loc].isShot) {
      this.board[loc].isShot = true;

      const target = this.board[loc].ship;

      if (target) {
        const ship = this.ships[target];

        moveInfo.ship = ship;
        ship.hit();
      } else {
        moveInfo.ship = null;
      }
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

  placeShipsRandomly() {
    const axes = ['x', 'y'];
    const cells = [...Array(100).keys()];

    Object.keys(this.ships).forEach((shipName) => {
      let validPlacement = false;

      while (!validPlacement) {
        const loc = cells[Math.floor(Math.random() * 100)];
        const axis = axes[Math.floor(Math.random() * 2)];

        validPlacement = this.placeShip(shipName, loc, axis);
      }
    });
  }

  checkCollisions(locs, axis) {
    if (!checkEdgeCollisions(locs, axis)) return false;

    for (const loc of locs) {
      if (this.board[loc].ship != null) return false;
    }

    return true;
  }
}

module.exports = GameBoard;
