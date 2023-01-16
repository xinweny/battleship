import Player from '../models/Player';
import View from './view';
import AI from './AI';

import { shipLengths, getNextShip } from './helpers';

class Game {
  constructor() {
    this.p1 = new Player(); // Human player
    this.p2 = new Player(new AI(this.p1.board.board)); // Computer

    this.view = new View();

    this.turn = 'p1';
    this.winner = null;
    this.placementState = {
      axis: 'x',
      shipName: 'carrier',
      validPlacement: false,
      allShipsPlaced: false,
    };

    // Place player ships
    // this.p1.board.placeShip('carrier', 4, 'x');
    // this.p1.board.placeShip('battleship', 12, 'y');
    // this.p1.board.placeShip('cruiser', 97, 'x');
    // this.p1.board.placeShip('submarine', 66, 'y');
    // this.p1.board.placeShip('patrolBoat', 38, 'x');

    // Place computer ships
    this.p2.board.placeShipsRandomly();
  }

  switchTurn() {
    this.turn = (this.turn === 'p1') ? 'p2' : 'p1';
  }

  checkWin(oppBoard) {
    if (oppBoard.shipsSunk() === 5) {
      this.winner = this.turn;
    }

    return this.winner;
  }

  playPlayerTurn(index) {
    if (this.winner != null) return false;

    const oppBoard = this.p2.board;
    const outcome = {
      validMove: false,
      opponent: this.p2,
      winner: null,
    };

    if (!oppBoard.board[index].isShot) {
      outcome.validMove = true;

      this.p1.fireShot(this.p2, index);

      if (this.checkWin(oppBoard)) {
        outcome.winner = this.winner;
      } else {
        this.switchTurn();

        const nextIndex = this.p2.AI.getSmartShot(this.p2.movesMade);
        const cell = this.view.getCell('p1', nextIndex);
        this.p2.AI.clickCell(cell);
      }
    }

    return outcome;
  }

  playComputerTurn(index) {
    if (this.winner != null) return false;

    const outcome = {
      validMove: false,
      opponent: this.p1,
      winner: null,
    };

    if (this.turn === 'p2') {
      outcome.validMove = true;
      this.p2.fireShot(this.p1, index);

      if (this.checkWin(this.p1.board)) {
        outcome.winner = this.winner;
      } else {
        this.switchTurn();
      }
    }

    return outcome;
  }

  checkValidPlacement(i) {
    const outcome = {
      valid: false,
      boardState: this.p1.board.board,
    };

    if (!this.placementState.allShipsPlaced) {
      const shipLength = shipLengths[this.placementState.shipName];

      const locs = [...Array(shipLength).keys()].map((n) => ((this.placementState.axis === 'x') ? i + n : i + (n * 10)));

      const isValid = this.p1.board.checkCollisions(locs, this.placementState.axis);

      if (isValid) {
        outcome.valid = true;
        outcome.viewLocs = locs;

        this.placementState.validPlacement = true;
      } else if (this.placementState.axis === 'y') {
        outcome.viewLocs = locs.filter((loc) => loc < 100);
      } else {
        const firstLoc = locs[0];

        if (firstLoc < 10) {
          outcome.viewLocs = locs.filter((loc) => loc < 10);
        } else {
          outcome.viewLocs = locs.filter((loc) => loc.toString()[0] === firstLoc.toString()[0]);
        }
      }
    }

    return outcome;
  }

  placeShip(index) {
    const info = {};

    this.p1.board.placeShip(this.placementState.shipName, index, this.placementState.axis);

    info.board = this.p1.board.board;

    if (this.p1.board.getShipsPlaced().length === 5) {
      info.nextShip = null;
      this.placementState.allShipsPlaced = true;
      console.log(1);
    } else {
      const nextShip = getNextShip(this.placementState.shipName);
      this.placementState.shipName = nextShip;
      info.nextShip = nextShip;
    }

    return info;
  }

  togglePlacementAxis() {
    this.placementState.axis = (this.placementState.axis === 'x') ? 'y' : 'x';
  }

  setupGame() {
    this.view.renderBoard(this.p1);
    this.view.renderStartScreen();

    this.view.bindMouseOverCell(this.checkValidPlacement.bind(this));
    this.view.bindPressSpaceKey(this.togglePlacementAxis.bind(this));
    this.view.bindClickPlacementCell(this.placeShip.bind(this));
  }

  startGame() {
    this.view.resetBoardEventListeners();

    this.view.renderBoard(this.p1);
    this.view.renderBoard(this.p2);

    this.view.bindClickOpponentCell(this.playPlayerTurn.bind(this), this.p1);
    this.view.bindClickOpponentCell(this.playComputerTurn.bind(this), this.p2);
  }
}

export default Game;
