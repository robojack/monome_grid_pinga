/**
 * Create a 2-dimensional array based on the provided sizes.
 * @param {Integer} sizeY - Number of rows
 * @param {Integer} sizeX - Number of columns
 */
function create2DArray(sizeY, sizeX) {
  let arr = [];
  for (let y = 0; y < sizeY; y++) {
    arr[y] = [];
    for (let x = 0; x < sizeX; x++) {
      arr[y][x] = 0;
    }
  }
  return arr;
}

/**
 * Returns a number corresponding to a position in an array. This assumes that we are reading the array left to right, top to bottom and that coordinates start at 0, 0.
 * @param {Integer} array - Any 2-dimensional array
 * @param {Integer} posY - A y coordinate (row)
 * @param {Integer} posX - An x coordinate (column)
 */
function coordsToNumber(array, posY, posX) {
  let counter = 0;
  // Count the number of items in each row preceeding posY
  for (let row = 0; row < posY; row++) {
    for (let x = 0; x < array[row].length; x++) {
      counter++;
    }
  }
  // Return the count of items in preceeding rows plus the X position
  return counter + posX;
}

/**
 * Returns a set of coordinates from a number based on the width and height of the grid where all rows have the same number of columns.
 * @param {Integer} num - A representation of a position on the grid, starts at 0. This means an 8x8 grid with 64 buttons has a starting value of 0 and a maximum value of 63
 * @param {Integer} sizeY - The height of the grid (rows)
 * @param {Integer} sizeX - The width of the grid (columns)
 */
function numberToCoords(num, sizeY, sizeX) {
  if (num < sizeX) return { y: 0, x: num };

  const offsetNum = num;
  const quotientY = Math.floor(offsetNum / sizeX);
  const remainderX = offsetNum % sizeX;

  if (quotientY >= sizeY)
    return new Error("The number provided falls outside the grid");

  return { y: quotientY, x: remainderX };
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
  const randoArray = array;

  for (var i = randoArray.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = randoArray[i];
    randoArray[i] = randoArray[j];
    randoArray[j] = temp;
  }

  return randoArray;
}

module.exports = {
  create2DArray,
  coordsToNumber,
  numberToCoords,
  shuffleArray
};
