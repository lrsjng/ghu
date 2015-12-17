const {asFn} = require('../util');

const identity = obj => obj;

module.exports = (expr, onTruthy = identity, onFalsy = identity) => {
    return obj => Promise.resolve()
        .then(() => asFn(expr)(obj))
        .then(exprValue => exprValue ? asFn(onTruthy)(obj) : asFn(onFalsy)(obj));
};
