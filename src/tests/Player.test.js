const Player = require('../factories/Player');
const GameBoard = require('../factories/GameBoard');

const player = Player('Donald Duck');
const computer = Player('Computer', true);

computer.board.placeShip('carrier', 4, 'x');
computer.board.placeShip('battleship', 12, 'y');
computer.board.placeShip('cruiser', 97, 'x');
computer.board.placeShip('submarine', 66, 'y');
computer.board.placeShip('patrolBoat', 39, 'x');

describe('player tests', () => {
	it('initialises player name and board correctly', () => {
		expect(player.name).toBe('Donald Duck');
		expect(player.board).toEqual(GameBoard());
	});

	it('can attack opponent board', () => {
		player.fireShot(computer, 5);

		expect(computer.getCell(5).isShot).toBe(true);
		expect(computer.ships['carrier'].hits).toBe(1);
	});
});

describe('computer tests', () => {
	it('can make random, legal moves', () => {
		const loc = computer.randomShot(player);
		
		expect(player.getCell(loc).isShot).toBe(true);
	});
});