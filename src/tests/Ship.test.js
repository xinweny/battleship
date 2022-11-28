const Ship = require('../factories/Ship.js')

it('Returns an object with the correct properties', () => {
	const obj = {
		length: 5,
		hits: 0,
		isSunk: false,
	};

	expect(Ship(5)).toEqual(obj);
});

it('Increases the number of hits of the ship when hit', () => {
	const ship = Ship(3);
	ship.hit();

	expect(ship.hits).toBe(1);
});