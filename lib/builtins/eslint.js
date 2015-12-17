const {CLIEngine} = require('eslint');

module.exports = options => {
    return objs => Promise.resolve().then(() => {
        const settings = Object.assign({}, options);
        const cli = new CLIEngine(settings);
        const report = cli.executeOnFiles(objs.map(obj => obj.source));
        const formatter = cli.getFormatter();
        console.log(formatter(report.results));

        if (report.errorCount) {
            throw new Error(`eslint found ${report.errorCount} errors`);
        }

        return objs;
    });
};
