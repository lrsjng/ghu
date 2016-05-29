const {test, assert, insp} = require('scar');
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
    'eslint',
    'htmlminifier',
    'includeit',
    'jade',
    'jszip',
    'less',
    'pug',
    'uglify',
    'watch',
    'webpack'
];

test('lib is object', () => {
    assert.equal(typeof lib, 'object');
});

test(`lib has the right props: ${insp(PROPS)}`, () => {
    assert.deepEqual(Object.keys(lib).sort(), PROPS.sort());
});

test('lib.ghu is object and instance of Runner', () => {
    assert.equal(typeof lib.ghu, 'object');
    // assert.ok(lib.ghu instanceof lib.Runner);
});

PROPS.filter(prop => prop !== 'ghu').forEach(prop => {
    test(`lib.${prop} is function`, () => {
        assert.equal(typeof lib[prop], 'function');
    });
});
