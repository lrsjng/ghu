const {test, assert} = require('scar');
const {less} = require('../../../lib/ghu');

test('lib.less()', () => {
    assert.equal(typeof less, 'function');
    assert.equal(typeof less(), 'function');
});

test('lib.less() - no objects', () => {
    const fn = less();
    const objs = [];

    return fn(objs).then(val => {
        assert.deepEqual(val, []);
    });
});

test('lib.less() - empty', () => {
    const fn = less();
    const content = '';
    const expected = '';
    const objs = [{source: 'a.less', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.less', content: expected}]);
    });
});

test('lib.less() - empty rule', () => {
    const fn = less();
    const content = 'div {}';
    const expected = '';
    const objs = [{source: 'a.less', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.less', content: expected}]);
    });
});

test('lib.less() - nested rule', () => {
    const fn = less();
    const content = 'div{color:#aaa;p{color:#bbb}}';
    const expected = 'div {\n  color: #aaa;\n}\ndiv p {\n  color: #bbb;\n}\n';
    const objs = [{source: 'a.less', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.less', content: expected}]);
    });
});

test('lib.less() - err', () => {
    const fn = less();
    const objs = [{source: 'a.less', content: 'x'}];

    return assert.rejects(fn(objs), /unrecognised input/i);
});
