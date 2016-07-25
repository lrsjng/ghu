const {test, assert} = require('scar');
const {autoprefixer} = require('../../../lib/ghu');

test('lib.autoprefixer is function', () => {
    assert.equal(typeof autoprefixer, 'function');
});

test('lib.autoprefixer() returns function', () => {
    assert.equal(typeof autoprefixer(), 'function');
});

test('lib.autoprefixer - no objects', () => {
    const fn = autoprefixer();
    const objs = [];

    return fn(objs).then(val => {
        assert.deepEqual(val, []);
    });
});

test('lib.autoprefixer - empty', () => {
    const fn = autoprefixer();
    const content = '';
    const expected = '';
    const objs = [{source: 'a.css', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.css', content: expected}]);
    });
});

test('lib.autoprefixer - empty rule', () => {
    const fn = autoprefixer();
    const content = 'div {}';
    const expected = 'div {}';
    const objs = [{source: 'a.css', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.css', content: expected}]);
    });
});

test('lib.autoprefixer - noncompact', () => {
    const fn = autoprefixer();
    const content = 'div {    }';
    const expected = 'div {    }';
    const objs = [{source: 'a.css', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.css', content: expected}]);
    });
});

test('lib.autoprefixer - prefixing', () => {
    const fn = autoprefixer();
    const content = 'div {display: flex}';
    const expected = 'div {display: -ms-flexbox;display: flex}'; // this will break!
    const objs = [{source: 'a.css', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.css', content: expected}]);
    });
});
