const GameBoard = require('../factories/GameBoard');
const Ship = require('../factories/Ship');

const board = GameBoard();

it('Instantiates board object correctly', () => {
	expect(board.board.length).toBe(100);
	for (const cell of board.board) {
		expect(cell).toEqual({ ship: null, isShot: false });
	}
});

describe('Should place ships at the correct coordinates', () => {
	it('places ship correctly on x-axis', () => {
		board.placeShip('carrier', 0, 'x');

		for (const cell of board.board.slice(0, 5)) {
			expect(cell.ship).toBe('carrier');
		}
	});

	it('places ship correctly on y-axis', () => {
		board.placeShip('patrolBoat', 10, 'y');
	
		for (const cell of [10, 20].map(i => board.board[i])) {
			expect(cell.ship).toBe('patrolBoat');
		}
	});

	it('does not allow out-of-bounds placement', () => {
		expect(() => board.placeShip('battleship', 9, 'x')).toThrow('Invalid placement');
	});

	it('does not allow placement overlapping other ships', () => {
		expect(() => board.placeShip('submarine', 10, 'x')).toThrow('Invalid placement');
	});

	describe('records hits and misses correctly', () => {
		it('records and increases hit at occupied cell', () => {
			board.receiveAttack(4);

			expect(board.board[4].isShot).toBe(true);
			expect(board.shipAt(4).hits).toBe(1);
		});

		it('records a miss at empty cell', () => {
			board.receiveAttack(99);

			expect(board.isShotHit(99)).toBe(false);
		});
	});
});