const monomeGrid = require("monome-grid");
const ping = require("ping");
const open = require("open");
const helpers = require("./helpers");
const hosts = require("./hosts");

async function run() {
  // Change these if you have a different size grid
  const sizeY = 8;
  const sizeX = 8;

  // For varibright grids, use a value between 0 and 14.
  // For non-varibright grids, 1 or 0 (on or off).
  const brightness = 1;

  let grid = await monomeGrid();
  let led = helpers.create2DArray(sizeY, sizeX);
  let currentStep = 0;
  let frequency = 75; // in milliseconds

  // Setup a randomized array whose length matches the number of hosts
  let randoSteps = [];
  while (randoSteps.length < hosts.length) {
    randoSteps.push(randoSteps.length);
  }
  randoSteps = helpers.shuffleArray(randoSteps);

  let refresh = function() {
    // Reset the currentStep to 0 and reshuffle the randoSteps
    if (currentStep >= hosts.length) {
      randoSteps = helpers.shuffleArray(randoSteps);
      currentStep = 0;
    }

    // Use our randomized randoSteps to choose the next currentStep
    const randoStep = randoSteps[currentStep];
    const { y, x } = helpers.numberToCoords(randoStep, sizeY, sizeX);

    // turn on the current currentStep
    led[y][x] = brightness;

    ping.promise.probe(hosts[randoStep]).then(res => {
      if (res.alive) {
        // The repsonse time will usually be too fast for us to see the light
        // turn on and off so we set a timeout before turning it off.
        setTimeout(() => {
          led[y][x] = 0;
          grid.refresh(led);
        }, frequency);
      }
    });

    currentStep++;
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
