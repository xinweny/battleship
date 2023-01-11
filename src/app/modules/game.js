import Player from '../models/Player';
import AI from './AI';
import View from './view';

class Game {
  constructor() {
    this.p1 = new Player(); // Human player
    this.p2 = new Player(new AI()); // Computer

    this.view = new View();

    this.turn = 'p1';
    this.winner = null;

    // Place player ships
    this.p1.board.placeShip('carrier', 4, 'x');
    this.p1.board.placeShip('battleship', 12, 'y');
    this.p1.board.placeShip('cruiser', 97, 'x');
    this.p1.board.placeShip('submarine', 66, 'y');
    this.p1.board.placeShip('patrolBoat', 39, 'x');

    // Place computer ships
    // computer.AI.placeShips();
    this.p2.board.placeShip('carrier', 4, 'x');
    this.p2.board.placeShip('battleship', 12, 'y');
    this.p2.board.placeShip('cruiser', 97, 'x');
    this.p2.board.placeShip('submarine', 66, 'y');
    this.p2.board.placeShip('patrolBoat', 39, 'x');
  }

  renderBoards() {
    this.view.renderBoard(this.p1);
    this.view.renderBoard(this.p2);
  }

  switchTurn() {
    this.turn = (this.turn === 'p1') ? 'p2' : 'p1';
  }

  checkWin(oppBoard) {
    if (oppBoard.shipsSunk() === 5) {
      this.winner = this.turn;
    }
  }

  play() {
    while (this.winner == null) {
      if (this.turn === 'p1') {
        this.p1.fireShot(this.p2);
        this.view.renderBoard(this.p2);
        this.checkWin(this.p2.board);
      } else {
        this.p2.AI.randomShot(this.p1);
        this.checkWin(this.p1.board);
      }
    }
  }
}

export default Game;
