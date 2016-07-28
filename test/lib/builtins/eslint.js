const {test, assert} = require('scar');
const {eslint} = require('../../../lib/ghu');

test('lib.eslint()', () => {
    assert.equal(typeof eslint, 'function');
    assert.equal(typeof eslint(), 'function');
});

test('lib.eslint() - no objects', () => {
    const fn = eslint({showReport: false});
    const objs = [];

    return fn(objs).then(val => {
        assert.deepEqual(val, []);
    });
});

test('lib.eslint() - empty', () => {
    const fn = eslint({showReport: false});
    const content = '';
    const expected = '';
    const objs = [{source: 'a.js', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.js', content: expected}]);
    });
});

test('lib.eslint() - does not alter objects', () => {
    const fn = eslint({showReport: false});
    const content = 'const a = 1;';
    const objs = [{source: 'a.js', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, objs);
    });
});
