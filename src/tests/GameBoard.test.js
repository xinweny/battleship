const GameBoard = require('../factories/GameBoard');
const Ship = require('../factories/Ship');

it('Instantiates board object correctly', () => {
	const board = GameBoard();

	expect(board.board.length).toBe(100);
	for (const cell of board.board) {
		expect(cell).toEqual({ ship: null, isShot: false });
	}
});

describe('Should place ships at the correct coordinates', () => {
	const board = GameBoard();

	it('places ship correctly on x-axis', () => {
		const carrier = Ship(5, 'carrier');

		board.placeShip(carrier, 0, 'x');

		for (const cell of board.board.slice(0, 5)) {
			expect(cell.ship).toBe('carrier');
		}
	});

	it('places ship correctly on y-axis', () => {
		const patrolBoat = Ship(2, 'patrol boat');

		board.placeShip(patrolBoat, 10, 'y');
	
		for (const cell of [10, 20].map(i => board.board[i])) {
			expect(cell.ship).toBe('patrol boat');
		}
	});

	it('does not allow out-of-bounds placement', () => {
		const battleship = Ship(4, 'battleship');

		expect(() => board.placeShip(battleship, 9, 'x')).toThrow('Invalid placement');
	});

	it('does not allow placement overlapping other ships', () => {
		const submarine = Ship(3, 'submarine');

		expect(() => board.placeShip(submarine, 10, 'x')).toThrow('Invalid placement');
	});
});