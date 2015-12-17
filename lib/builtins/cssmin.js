const cssmin = require('cssmin');
const each = require('../actions/each');

module.exports = options => {
    const settings = Object.assign({
        linebreak: -1
    }, options);

    return each(obj => {
        obj.content = cssmin(obj.content, settings.linebreak);
    });
};
