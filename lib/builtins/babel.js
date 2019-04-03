const {transform} = require('@babel/core');
const each = require('../actions/each');

module.exports = options => {
    return each(obj => {
        const settings = Object.assign({}, options, {filename: obj.source});
        obj.content = transform(obj.content, settings).code;
    });
};
