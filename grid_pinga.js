const monomeGrid = require("monome-grid");
const ping = require("ping");
const open = require("open");
const hosts = require("./hosts");

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
 * Returns a set of coordinates from a number based on the width and height of the grid.
 * @param {Integer} num - A representation of a position on the grid, starts at 0. This means an 8x8 grid with 64 buttons has a starting value of 0 and a maximum value of 63
 * @param {Integer} sizeY - The height of the grid (rows)
 * @param {Integer} sizeX - The width of the grid (columns)
 */
function numToCoords(num, sizeY, sizeX) {
  if (num < sizeX) return { y: 0, x: num };

  const offsetNum = num;
  const quotientY = Math.floor(offsetNum / sizeX);
  const remainderX = offsetNum % sizeX;

  if (quotientY >= sizeY)
    return new Error("The number provided falls outside the grid");

  return { y: quotientY, x: remainderX };
}

async function run() {
  // Change these if you have a different size grid
  const sizeY = 8;
  const sizeX = 8;
  // Newer grids support a value between 0 and 14.
  // Older grids are either on or off, e.g. 1 or 0.
  const brightness = 1;

  let grid = await monomeGrid();
  let led = create2DArray(sizeY, sizeX);
  let step = 0;
  let frequency = 100; // in milliseconds

  let refresh = function() {
    if (step >= hosts.length) step = 0;
    const { y, x } = numToCoords(step, sizeY, sizeX);

    // turn on the current step
    led[y][x] = brightness;

    ping.promise.probe(hosts[step]).then(res => {
      if (res.alive) {
        // Most times the repsonse is too fast for us to see the light
        // turn on and off so we set a short delay before turning it off.
        setTimeout(() => {
          led[y][x] = 0;
        }, 100);
      }
    });

    grid.refresh(led);
    step++;
  };

  // Refresh the grid
  setInterval(refresh, frequency);

  // Set up key handler
  grid.key(async (x, y, s) => {
    const position = coordsToNumber(led, y, x);
    const host = hosts[position];
    if (host) await open(`https://${host}`);
  });
}

run();
