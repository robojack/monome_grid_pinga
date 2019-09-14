const monomeGrid = require("monome-grid");
const ping = require("ping");
const open = require("open");
const helpers = require("./helpers");
const hosts = require("./hosts");

async function run() {
  // Change these if you have a different size grid
  const sizeY = 8;
  const sizeX = 8;
  // Newer grids support a value between 0 and 14.
  // Older grids are either on or off, e.g. 1 or 0.
  const brightness = 1;

  let grid = await monomeGrid();
  let led = helpers.create2DArray(sizeY, sizeX);
  let step = 0;
  let frequency = 100; // in milliseconds

  let refresh = function() {
    if (step >= hosts.length) step = 0;
    const { y, x } = helpers.numberToCoords(step, sizeY, sizeX);

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

  // Link each key to its host and open in the default browser
  grid.key(async (x, y, s) => {
    const position = helpers.coordsToNumber(led, y, x);
    const host = hosts[position];
    if (host) await open(`https://${host}`);
  });
}

run();
