const Ship = require('../models/Ship');

it('Returns an object with the correct properties', () => {
  const obj = {
    length: 5,
    hits: 0,
    name: 'carrier',
    sunk: false,
  };

  expect(new Ship(5, 'carrier')).toEqual(obj);
});

it('Increases the number of hits of the ship when hit', () => {
  const ship = new Ship(3, 'destroyer');
  ship.hit();

  expect(ship.hits).toBe(1);
});

it('Checks if the ship is sunk when hit enough times', () => {
  const ship = new Ship(2, 'patrolBoat');
  ship.hit();
  ship.hit();

  expect(ship.isSunk()).toBe(true);
});
