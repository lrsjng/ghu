const uglify = require('uglify-js');
const each = require('../actions/each');

module.exports = options => {
    const settings = Object.assign({}, options);

    return each(obj => {
        const res = uglify.minify({
            [obj.source]: obj.content
        }, settings);
        obj.content = res.code;
        if (res.error) {
            throw res.error;
        }
    });
};
