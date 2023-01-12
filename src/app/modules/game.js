import Player from '../models/Player';
import AI from './AI';

class Game {
  constructor() {
    this.p1 = new Player(); // Human player
    this.p2 = new Player(new AI()); // Computer

    this.turn = 'p1';
    this.winner = null;

    // Place player ships
    this.p1.board.placeShip('carrier', 4, 'x');
    this.p1.board.placeShip('battleship', 12, 'y');
    this.p1.board.placeShip('cruiser', 97, 'x');
    this.p1.board.placeShip('submarine', 66, 'y');
    this.p1.board.placeShip('patrolBoat', 38, 'x');

    // Place computer ships
    // computer.AI.placeShips();
    this.p2.board.placeShip('carrier', 4, 'x');
    this.p2.board.placeShip('battleship', 12, 'y');
    this.p2.board.placeShip('cruiser', 97, 'x');
    this.p2.board.placeShip('submarine', 66, 'y');
    this.p2.board.placeShip('patrolBoat', 39, 'x');
  }

  switchTurn() {
    this.turn = (this.turn === 'p1') ? 'p2' : 'p1';
  }

  checkWin(oppBoard) {
    if (oppBoard.shipsSunk() === 5) {
      this.winner = this.turn;
    }
  }

  playPlayerTurn(index) {
    if (!this.p2.board.board[index].isShot) {
      this.p1.fireShot(this.p2, index);
      this.switchTurn();
      this.playComputerTurn();

      return this.p2;
    }

    return false;
  }

  playComputerTurn() {

  }
}

export default Game;
