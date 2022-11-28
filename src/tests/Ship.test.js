const Ship = require('../factories/Ship.js')

it('Returns an object with the correct properties', () => {
	const obj = {
		length: 5,
		numHits: 0,
		isSunk: false,
	};

	expect(Ship(5)).toEqual(obj);
});