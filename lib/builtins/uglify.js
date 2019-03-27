const uglify = require('uglify-js');
const each = require('../actions/each');

module.exports = options => {
    const settings = Object.assign({}, options);

    return each(obj => {
        obj.content = uglify.minify({
            [obj.source]: obj.content
        }, settings).code;
    });
};
