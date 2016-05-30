const {test, assert} = require('scar');
const {pug, jade} = require('../../../lib/ghu');

test('lib.pug is function', () => {
    assert.equal(typeof pug, 'function');
});

test('lib.pug === lib.jade', () => {
    assert.equal(pug, jade);
});

test('lib.pug() returns function', () => {
    assert.equal(typeof pug(), 'function');
});

test('lib.pug - no objects', () => {
    const fn = pug();
    const objs = [];

    return fn(objs).then(val => {
        assert.deepEqual(val, []);
    });
});

test('lib.pug - empty', () => {
    const fn = pug();
    const content = '';
    const expected = '';
    const objs = [{content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{content: expected}]);
    });
});

test('lib.pug - p', () => {
    const fn = pug();
    const content = 'p hi';
    const expected = '<p>hi</p>';
    const objs = [{content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{content: expected}]);
    });
});

test('lib.pug - env', () => {
    const fn = pug({name: 'x'});
    const content = 'p hi #{name}';
    const expected = '<p>hi x</p>';
    const objs = [{content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{content: expected}]);
    });
});
