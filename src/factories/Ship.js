const Ship = length => {
	let numHits = 0;
	let isSunk = false;

	return {
		length,
		numHits,
		isSunk,
	}
};

module.exports = Ship;