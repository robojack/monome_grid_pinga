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
    // console.log(array[row].length);
    for (let x = 0; x < array[row].length; x++) {
      counter++;
    }
  }
  // Return the count of items in preceeding rows plus the X position
  return counter + posX;
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

  let refresh = function() {
    for (let y = 0; y < sizeY; y++) {
      for (let x = 0; x < sizeX; x++) {
        const ledNum = coordsToNumber(led, y, x);

        if (ledNum < hosts.length) {
          led[y][x] = brightness;
        }

        ping.promise.probe(hosts[ledNum]).then(res => {
          if (res.alive) led[y][x] = 0;
          grid.refresh(led);
        });
      }
    }
  };

  // Refresh the grid
  setInterval(refresh, 2000);

  // set up key handler
  grid.key(async (x, y, s) => {
    const position = coordsToNumber(led, y, x);
    const host = hosts[position];
    if (host) await open(`https://${host}`);
  });
}

run();
