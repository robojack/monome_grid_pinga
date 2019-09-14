# monome grid pinga

This Node-based [monome](https://monome.org) app pings a set of user defined hosts and will let you know when a host is unreachable. When a host is unreachable, the corresponding key will stay lit. You can press the key, lit or not, and it will open the corresponding host in your default browser.

## how to use

After forking/cloning/downloading the repo, `cd` into the directory and install the Node dependencies.

```bash
# for Yarn (preferred)
$ yarn install

# for NPM
$ npm install
```

Now rename `hosts.example.js` to `hosts.js` and add the hosts that you want to ping. You can add as many hosts as your grid has keys.

You can adjust the size of your grid by finding and adjusting the following:

```javascript
const sizeY = 8;
const sizeX = 8;
```

`sizeY` corresponds to the number of rows and `sizeX` corresponds to the number of columns. Make sure these numbers are not larger than the size of your grid.

You can also adjust the speed of the pings by adjusting:

```javascript
let frequency = 50; // in milliseconds
```

Now you are ready to run pinga:

```bash
$ node grid_pinga.js
```

## alternative sequencing

In the current version, pinga will ping your defined hosts randomly. If you want it to ping your hosts sequentially (i.e. in order), take a look at [`v1.0`](releases/tag/v1.0)

## dependencies

- [monome-grid](https://www.npmjs.com/package/monome-grid)
- [ping](https://www.npmjs.com/package/ping)
- [open](https://www.npmjs.com/package/open)

---

The name of this project was inspired by [@rockbottomsimpsons](https://www.facebook.com/rockbottomsimpsons/) on Facebook.
