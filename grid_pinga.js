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
  let frequency = 50; // in milliseconds

  // Setup a randomized array that matches the number of keys
  let stepper = [];
  while (stepper.length < sizeY * sizeX) {
    stepper.push(stepper.length);
  }
  stepper = helpers.shuffleArray(stepper);

  let refresh = function() {
    // Reset the step to 0 and reshuffle the stepper
    if (step >= hosts.length) {
      stepper = helpers.shuffleArray(stepper);
      step = 0;
    }

    // Use our randomized stepper to choose the next step
    const randoStep = stepper[step];
    const { y, x } = helpers.numberToCoords(randoStep, sizeY, sizeX);

    // turn on the current step
    led[y][x] = brightness;

    ping.promise
      .probe(hosts[randoStep], {
        timeout: 10
      })
      .then(res => {
        if (res.alive) {
          // Most times the repsonse is too fast for us to see the light
          // turn on and off so we set a timeout before turning it off.
          setTimeout(() => {
            led[y][x] = 0;
            grid.refresh(led);
          }, frequency);
        }
      });

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
