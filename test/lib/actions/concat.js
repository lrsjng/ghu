const {test, assert} = require('scar');
const {concat} = require('../../../lib/ghu');

test(`lib.concat is function`, () => {
    assert.equal(typeof concat, 'function');
});

test(`lib.concat() returns function`, () => {
    assert.equal(typeof concat(), 'function');
});

test(`lib.concat - works`, () => {
    const fn = concat();
    const objs = [];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: '@concat', content: ''}]);
    });
});

test(`lib.concat()([{content: 'a'}]) works`, () => {
    const fn = concat();
    const objs = [{content: 'a'}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: '@concat', content: 'a'}]);
    });
});

test(`lib.concat()([{content: 'a'}, {content: 'b'}]) works`, () => {
    const fn = concat();
    const objs = [{content: 'a'}, {content: 'b'}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: '@concat', content: 'a\nb'}]);
    });
});
