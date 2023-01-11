import GameBoard from './GameBoard';
import Player from './Player';

class Game {
	constructor() {
		const player = new Player(isComp=false);
		const computer = new Player(isComp=true);

		// Place player ships
		player.board.placeShip('carrier', 4, 'x');
		player.board.placeShip('battleship', 12, 'y');
		player.board.placeShip('cruiser', 97, 'x');
		player.board.placeShip('submarine', 66, 'y');
		player.board.placeShip('patrolBoat', 39, 'x');

		// Place computer ships randomly

	}
}