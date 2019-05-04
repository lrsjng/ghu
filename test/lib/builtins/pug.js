const {test, assert} = require('scar');
const {pug} = require('../../../lib/ghu');

test('lib.pug()', () => {
    assert.equal(typeof pug, 'function');
    assert.equal(typeof pug(), 'function');
});

test('lib.pug() - no objects', () => {
    const fn = pug();
    const objs = [];

    return fn(objs).then(val => {
        assert.deep_equal(val, []);
    });
});

test('lib.pug() - empty', () => {
    const fn = pug();
    const content = '';
    const expected = '';
    const objs = [{content}];

    return fn(objs).then(val => {
        assert.deep_equal(val, [{content: expected}]);
    });
});

test('lib.pug() - p', () => {
    const fn = pug();
    const content = 'p hi';
    const expected = '<p>hi</p>';
    const objs = [{content}];

    return fn(objs).then(val => {
        assert.deep_equal(val, [{content: expected}]);
    });
});

test('lib.pug() - env', () => {
    const fn = pug({name: 'x'});
    const content = 'p hi #{name}';
    const expected = '<p>hi x</p>';
    const objs = [{content}];

    return fn(objs).then(val => {
        assert.deep_equal(val, [{content: expected}]);
    });
});
