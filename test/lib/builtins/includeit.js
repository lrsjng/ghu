const {test, assert} = require('scar');
const {includeit} = require('../../../lib/ghu');

test('lib.includeit()', () => {
    assert.equal(typeof includeit, 'function');
    assert.equal(typeof includeit(), 'function');
});

test('lib.includeit() - no objects', () => {
    const fn = includeit();
    const objs = [];

    return fn(objs).then(val => {
        assert.deep_equal(val, []);
    });
});

test('lib.includeit() - empty content throws', () => {
    const fn = includeit();
    const content = '';
    const objs = [{source: 'a.js', content}];

    return assert.throws(() => fn(objs), /content undefined/);
});

test('lib.includeit() - space', () => {
    const fn = includeit();
    const content = ' ';
    const expected = ' ';
    const objs = [{source: 'a.js', content}];

    return fn(objs).then(val => {
        assert.deep_equal(val, [{source: 'a.js', content: expected}]);
    });
});
