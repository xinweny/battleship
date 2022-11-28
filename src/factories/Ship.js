const shipActions = {
	hit() {
		this.hits = this.hits + 1;
	},
	isSunk() {
		return this.hits == this.length;
	},
};

const Ship = length => {
	let ship = Object.create(shipActions);

	ship.length = length;
	ship.hits = 0;

	return ship;
};

module.exports = Ship;