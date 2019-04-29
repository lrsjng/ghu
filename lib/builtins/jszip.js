const path = require('path');
const JsZip = require('jszip');

module.exports = options => {
    return objs => Promise.resolve().then(() => {
        const settings = Object.assign({
            dir: process.cwd(),
            level: 0
        }, options);
        settings.dir = path.resolve(settings.dir);

        const jszip = new JsZip();
        objs.forEach(obj => {
            jszip.file(path.relative(settings.dir, obj.source), obj.content);
        });

        const gen_opts = {
            type: 'nodebuffer'
        };
        if (settings.level) {
            gen_opts.compression = 'DEFLATE';
            gen_opts.compressionOptions = {level: settings.level};
        }

        return jszip.generateAsync(gen_opts).then(zipped => {
            return [{source: '@jszip', content: zipped}];
        });
    });
};
