import path from 'path';
import less from 'less';
import each from '../actions/each';

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

export default function action(options) {
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
        })
        .then(data => {
            obj.content = data.css;
        });
    });
}
