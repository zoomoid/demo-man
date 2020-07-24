const webpack = require('webpack');
const { version } = require('./.version.json');

module.exports = {
  pwa: {
    name: 'demo-man',
    themeColor: '#F58B44',
    msTileColor: '#F58B44',
    manifestOptions: {
      background_color: '#F58B44',
    },
  },
  configureWebpack: () => ({
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          VERSION: JSON.stringify(version),
        },
      }),
    ],
  }),
};
