const {test, assert} = require('scar');
const {webpack} = require('../../../lib/ghu');

test('lib.webpack()', () => {
    assert.equal(typeof webpack, 'function');
    assert.equal(typeof webpack(), 'function');
});

test('lib.webpack() - no objects', () => {
    const fn = webpack({}, {showStats: false});
    const objs = [];

    return fn(objs).then(val => {
        assert.deepEqual(val, []);
    });
});

test('lib.webpack() - empty', () => {
    const fn = webpack({}, {showStats: false});
    const content = '';
    const objs = [{source: 'empty.js', content}];

    return fn(objs).then(val => {
        assert.equal(val.length, 1);
        assert.equal(val[0].source, 'empty.js');
        assert.ok(val[0].content.match(/function/));
    });
});

test('lib.webpack() - minimal', () => {
    const fn = webpack({}, {showStats: false});
    const content = 'module.exports = " Heyhoh "';
    const objs = [{source: 'minimal.js', content}];

    return fn(objs).then(val => {
        assert.equal(val.length, 1);
        assert.equal(val[0].source, 'minimal.js');
        assert.ok(val[0].content.match(/function/));
        assert.ok(val[0].content.match(/ Heyhoh /));
    });
});
