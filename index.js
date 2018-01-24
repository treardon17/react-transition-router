let window // eslint-disable-line
if (typeof window === 'undefined') {
  window = { location: {pathname: ''}, history: [] }
}

require('./dist/manifest');
require('./dist/vendor');
module.exports = require('./dist/index').default;
