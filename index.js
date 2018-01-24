const window = window || { location: {pathname: ''}, history: [] } // eslint-disable-line
require('./dist/manifest');
require('./dist/vendor');
module.exports = require('./dist/index').default;
