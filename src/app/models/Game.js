import Player from './Player';
import AI from '../modules/AI';

class Game {
  constructor() {
    this.p1 = new Player(); // Human player
    this.p2 = new Player(new AI()); // Computer

    this.turn = 'player';
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
}

export default Game;
