const {resolve} = require('path');
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
    const assets = resolve(__dirname, 'assets');
    const a = resolve(assets, 'a.txt');
    const fn = eslint({showReport: false});
    const objs = [{source: a}];

    return fn(objs).then(val => {
        assert.deepEqual(val, objs);
    });
});

test('lib.eslint() - does not alter objects', () => {
    const assets = resolve(__dirname, 'assets');
    const b = resolve(assets, 'b.txt');
    const fn = eslint({showReport: false});
    const objs = [{source: b}];

    return fn(objs).then(val => {
        assert.deepEqual(val, objs);
    });
});
