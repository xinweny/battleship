const shipActions = {
	hit() {
		this.hits = this.hits + 1;
	},
	isSunk() {
		return this.hits == this.length;
	},
};

const Ship = (length, name) => {
	let ship = Object.create(shipActions);

	ship.length = length;
	ship.hits = 0;
	ship.name = name;

	return ship;
};

module.exports = Ship;