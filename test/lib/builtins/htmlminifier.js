const {test, assert} = require('scar');
const {htmlminifier} = require('../../../lib/ghu');

test('lib.htmlminifier()', () => {
    assert.equal(typeof htmlminifier, 'function');
    assert.equal(typeof htmlminifier(), 'function');
});

test('lib.htmlminifier() - no objects', () => {
    const fn = htmlminifier();
    const objs = [];

    return fn(objs).then(val => {
        assert.deep_equal(val, []);
    });
});

test('lib.htmlminifier() - empty', () => {
    const fn = htmlminifier();
    const content = '';
    const expected = '';
    const objs = [{source: 'a.html', content}];

    return fn(objs).then(val => {
        assert.deep_equal(val, [{source: 'a.html', content: expected}]);
    });
});

test('lib.htmlminifier() - whitespace', () => {
    const fn = htmlminifier();
    const content = '<p  >   </p >';
    const expected = '<p>   </p>';
    const objs = [{source: 'a.html', content}];

    return fn(objs).then(val => {
        assert.deep_equal(val, [{source: 'a.html', content: expected}]);
    });
});
