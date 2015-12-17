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

        const generateOpts = {
            type: 'nodebuffer'
        };
        if (settings.level) {
            generateOpts.compression = 'DEFLATE';
            generateOpts.compressionOptions = {level: settings.level};
        }
        const zipped = jszip.generate(generateOpts);

        return [{source: '@jszip', content: zipped}];
    });
};
