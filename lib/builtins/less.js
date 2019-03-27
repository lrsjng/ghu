const path = require('path');
const less = require('less');
const each = require('../actions/each');

const DEFAULTS = {
    paths: [], // Specify search paths for @import directives
    filename: '', // Specify a filename, for better error messages
    syncImport: false,
    async: false,
    fileAsync: false,
    silent: false,
    verbose: false,
    ieCompat: true,
    compress: false,
    cleancss: false,
    sourceMap: false
};

module.exports = options => {
    return each(obj => {
        return new Promise((resolve, reject) => {
            const settings = Object.assign({}, DEFAULTS, options, {
                paths: [path.dirname(obj.source)],
                filename: obj.source
            });
            less.render(obj.content, settings, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        }).then(data => {
            obj.content = data.css;
        });
    });
};
