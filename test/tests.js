const {test} = require('scar');

require('./lib/ghu');
require('./lib/actions');
require('./lib/builtins');
require('./lib/util');

test.cli();
