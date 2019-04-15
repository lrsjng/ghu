const {test, assert} = require('scar');
const lib = require('../../lib/ghu');

const PROPS = [
    'Runner',
    'ghu',

    'once',

    'concat',
    'each',
    'hash',
    'ife',
    'log',
    'mapfn',
    'newerThan',
    'paths',
    'read',
    'remove',
    'run',
    'stats',
    'wrap',
    'write',

    'autoprefixer',
    'babel',
    'cssmin',
    'htmlminifier',
    'includeit',
    'jszip',
    'less',
    'pug',
    'uglify',
    'watch',
    'webpack'
];

test('lib', () => {
    assert.equal(typeof lib, 'object', 'is object');
    assert.deepEqual(Object.keys(lib).sort(), PROPS.sort(), 'right props');
    assert.equal(typeof lib.ghu, 'object', '.ghu is object');
    PROPS.filter(prop => prop !== 'ghu').forEach(prop => {
        assert.equal(typeof lib[prop], 'function', `.${prop} is function`);
    });
});
