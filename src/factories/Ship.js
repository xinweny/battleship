const shipActions = {
	hit() {
		this.hits = this.hits + 1;
	}
};

const Ship = length => {
	let ship = Object.create(shipActions);

	ship.length = length;
	ship.hits = 0;
	ship.isSunk = false;

	return ship;
};

module.exports = Ship;