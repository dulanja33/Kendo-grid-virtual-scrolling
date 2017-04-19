var path = require('path');

module.exports = {
  entry: './Kendo-Grid-VirtualScroll.js',
  output: {
    path: path.join(__dirname, '/dist'),
    // export to AMD, CommonJS, or window
    libraryTarget: 'umd',
    // set the following name if exporting to window
    library: 'Kendo-Grid-VirtualScroll'
  },
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    "jquery": "jQuery"
  }
};