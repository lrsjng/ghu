const {test, assert} = require('scar');
const {autoprefixer} = require('../../../lib/ghu');

test('lib.autoprefixer()', () => {
    assert.equal(typeof autoprefixer, 'function');
    assert.equal(typeof autoprefixer(), 'function');
});

test('lib.autoprefixerd() - no objects', () => {
    const fn = autoprefixer();
    const objs = [];

    return fn(objs).then(val => {
        assert.deepEqual(val, []);
    });
});

test('lib.autoprefixer() - empty', () => {
    const fn = autoprefixer();
    const content = '';
    const expected = '';
    const objs = [{source: 'a.css', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.css', content: expected}]);
    });
});

test('lib.autoprefixer() - empty rule', () => {
    const fn = autoprefixer();
    const content = 'div {}';
    const expected = 'div {}';
    const objs = [{source: 'a.css', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.css', content: expected}]);
    });
});

test('lib.autoprefixer() - noncompact', () => {
    const fn = autoprefixer();
    const content = 'div {    }';
    const expected = 'div {    }';
    const objs = [{source: 'a.css', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.css', content: expected}]);
    });
});

test('lib.autoprefixer() - prefixing', () => {
    const fn = autoprefixer();
    const content = '::placeholder {}';
    const expected = '::-webkit-input-placeholder {}\n:-ms-input-placeholder {}\n::-ms-input-placeholder {}\n::placeholder {}';
    const objs = [{source: 'a.css', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.css', content: expected}]);
    });
});
