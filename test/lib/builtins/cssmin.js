const {test, assert} = require('scar');
const {cssmin} = require('../../../lib/ghu');

test('lib.cssmin()', () => {
    assert.equal(typeof cssmin, 'function');
    assert.equal(typeof cssmin(), 'function');
});

test('lib.cssmin() - no objects', () => {
    const fn = cssmin();
    const objs = [];

    return fn(objs).then(val => {
        assert.deepEqual(val, []);
    });
});

test('lib.cssmin() - empty', () => {
    const fn = cssmin();
    const content = '';
    const expected = '';
    const objs = [{source: 'a.css', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.css', content: expected}]);
    });
});

test('lib.cssmin() - empty rule', () => {
    const fn = cssmin();
    const content = 'div {}';
    const expected = '';
    const objs = [{source: 'a.css', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.css', content: expected}]);
    });
});

test('lib.cssmin() - compact', () => {
    const fn = cssmin();
    const content = 'div {\n  color: #aaa;\n}\n';
    const expected = 'div{color:#aaa}';
    const objs = [{source: 'a.css', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.css', content: expected}]);
    });
});
