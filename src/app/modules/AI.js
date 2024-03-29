import GameBoard from '../models/GameBoard';

import {
  randElement,
  getActiveShips,
  shipLengths,
  checkEdgeCollisions,
  projectShipLocs,
} from './helpers';

class AI {
  constructor() {
    this.cellsHit = {
      carrier: [],
      battleship: [],
      cruiser: [],
      submarine: [],
      patrolBoat: [],
    };

    this.modelBoard = (new GameBoard()).board;
    this.offsets = [-1, 1, -10, 10];
  }

  getRandomShot(movesMade) {
    // Get movesMade object reference from Player with AI module and determine possible moves
    const cellsShot = movesMade.map((move) => move.cell);
    const legalMoves = [...Array(100).keys()].filter((index) => !cellsShot.includes(index));

    const loc = randElement(legalMoves);

    return loc;
  }

  getSmartShot(movesMade) {
    if (movesMade.length === 0) return this.getRandomShot(movesMade); // First shot is random

    let loc = null;

    const prevMove = movesMade.slice(-1)[0];
    const prevCell = prevMove.cell;

    const { ship } = prevMove;

    if (ship && !ship.isSunk()) {
      // If previous move hit a ship that is not sunk, update cellsHit to remember the move
      this.cellsHit[ship.name].push(prevCell);
      this.modelBoard[prevCell].ship = ship;

      loc = this.findSuitableMoves(ship);
    } else {
      // Check if there are any other active ships discovered
      const activeShips = getActiveShips(movesMade);

      if (activeShips.length > 0) {
        const prevShip = activeShips.slice(-1)[0];

        // Repeat searching algorithm above
        loc = this.findSuitableMoves(prevShip);
      } else {
        // Otherwise make smart guess
        const hiddenShipLengths = this.getUndiscoveredShipLengths();
        const shipLength = randElement(hiddenShipLengths); // Pick random undiscovered ship

        // Get all valid placements on the board for that ship
        const validLocs = this.modelValidPlacements(shipLength);

        // Pick random element of randomly selected location array
        loc = randElement(randElement(validLocs));
      }
    }

    return loc;
  }

  findSuitableMoves(ship) {
    const shipCellsHit = this.cellsHit[ship.name];
    const validNextMoves = [];

    if (shipCellsHit.length === 1) {
      // If ship hit once, project ship onto valid adjacent left/right/up/down cells
      const cell = shipCellsHit[0];

      for (const offset of this.offsets) {
        const move = this.findValidProjection(cell, offset, ship.length - 1);
        if (move) validNextMoves.push(move);
      }
    } else {
      // If ship has > 1 hit, establish limits and axis
      const limits = [Math.min(...shipCellsHit), Math.max(...shipCellsHit)];

      let axisOffsets = null;

      if ((limits[1] - limits[0]) % 10 === 0) {
        axisOffsets = this.offsets.slice(2); // y-axis
      } else {
        axisOffsets = this.offsets.slice(0, 2); // x-axis
      }

      // Check if adjacent cell on same axis is valid

      for (let i = 0; i < 2; i += 1) {
        const limit = limits[i];
        const offset = axisOffsets[i];

        const move = this.findValidProjection(limit, offset, ship.length - shipCellsHit.length);

        if (move != null) validNextMoves.push(move);
      }
    }

    return randElement(validNextMoves); // Select random next valid move
  }

  modelValidPlacements(length) {
    const validLocs = [];

    const emptyLocs = this.getEmptyLocs();

    // Check project ship on x and y axis onto all empty cells
    for (const emptyLoc of emptyLocs) {
      for (const offset of [1, 10]) {
        const locs = projectShipLocs(emptyLoc, offset, length);

        if (this.checkCollisions(locs, offset)) validLocs.push(locs);
      }
    }

    return validLocs;
  }

  clickCell(index, cell) {
    this.modelBoard[index].isShot = true;

    cell.click();
  }

  getUndiscoveredShipLengths() {
    const hiddenShipLengths = [];

    Object.keys(this.cellsHit).forEach((shipName) => {
      const shipLength = shipLengths[shipName];

      if (this.cellsHit[shipName].length === 0) hiddenShipLengths.push(shipLength);
    });

    return hiddenShipLengths;
  }

  getEmptyLocs() {
    return this.modelBoard.filter((cell) => !cell.isShot)
      .map((cell) => this.modelBoard.indexOf(cell));
  }

  checkCollisions(locs, axis) {
    if (!checkEdgeCollisions(locs, axis)) return false;

    for (const loc of locs) {
      if (this.modelBoard[loc].isShot) return false;
    }

    return true;
  }

  findValidProjection(start, offset, l) {
    let length = l;

    // project ship onto valid adjacent left/right/up/down cells at each edge
    while (length > 0) {
      const projectedLocs = projectShipLocs(start, offset, length, 1);

      if (this.checkCollisions(projectedLocs, offset)) return start + offset;

      // If no valid moves found for the projection, reduce projected size
      length -= 1;
    }

    return null;
  }
}

export default AI;
