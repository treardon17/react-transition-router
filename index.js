const Window = require('window');
const window = new Window();
require('./dist/manifest');
require('./dist/vendor');
module.exports = require('./dist/index').default;
