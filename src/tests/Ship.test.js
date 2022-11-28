const Ship = require('../factories/Ship.js')

it('Returns an object with the correct properties', () => {
	const obj = {
		length: 5,
		hits: 0,
	};

	expect(Ship(5)).toEqual(obj);
});

it('Increases the number of hits of the ship when hit', () => {
	const ship = Ship(3);
	ship.hit();

	expect(ship.hits).toBe(1);
});

it('Checks if the ship is sunk when hit enough times', () => {
	const ship = Ship(2);
	ship.hit();
	ship.hit();

	expect(ship.isSunk()).toBe(true);
});