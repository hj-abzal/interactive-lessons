const projectWebpack = require('../webpack.config')({});

const path = require("path");
const fs = require("fs");
const { merge } = require("webpack-merge");

function getPackageDir(filepath) {
  let currDir = path.dirname(require.resolve(filepath));
  while (true) {
    if (fs.existsSync(path.join(currDir, "package.json"))) {
      return currDir;
    }
    const { dir, root } = path.parse(currDir);
    if (dir === root) {
      throw new Error(
        `Could not find package.json in the parent directories starting from ${filepath}.`
      );
    }
    currDir = dir;
  }
}


module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    '@storybook/addon-actions',
  ],
  "core": {
    "builder": "webpack5"
  },
  webpackFinal: async (config, { configType }) => {
    config.resolve = {
      ...config.resolve,
      ...projectWebpack.resolve,
      alias: {
        ...config.resolve.alias,
        ...projectWebpack.resolve.alias
      }
    }

    config.module.rules = [
      ...config.module.rules,
      ...projectWebpack.module.rules,
    ]

    // Return the altered config
    return merge(config, {
      resolve: {
        alias: {
          "@emotion/core": getPackageDir("@emotion/react"),
          "@emotion/styled": getPackageDir("@emotion/styled"),
          "emotion-theming": getPackageDir("@emotion/react"),
        },
      },
    });
  },
}
