// @ts-check
const preactRefresh = require("@prefresh/vite");

/**
 * @type { import('vite').UserConfig }
 */
const config = {
  jsx: {
    factory: "h",
    fragment: "Fragment",
  },
  plugins: [preactRefresh()],
};

module.exports = config;
