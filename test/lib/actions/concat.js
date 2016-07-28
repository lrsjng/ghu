const {test, assert} = require('scar');
const {concat} = require('../../../lib/ghu');

test('lib.concat()', () => {
    assert.equal(typeof concat, 'function', 'is function');
    assert.equal(typeof concat(), 'function', '() -> function');
});

test('lib.concat() - no objects', () => {
    const fn = concat();
    const objs = [];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: '@concat', content: ''}]);
    });
});

test('lib.concat() - one object', () => {
    const fn = concat();
    const objs = [{content: 'a'}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: '@concat', content: 'a'}]);
    });
});

test('lib.concat() - two objects', () => {
    const fn = concat();
    const objs = [{content: 'a'}, {content: 'b'}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: '@concat', content: 'a\nb'}]);
    });
});
