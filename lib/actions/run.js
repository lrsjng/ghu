const {spawn, spawnSync} = require('child_process');
// const chalk = require('chalk');
const chalk = import('chalk');
const {as_fn} = require('../util');

const run = module.exports = (cmd, options) => {
    return new Promise((resolve, reject) => {
        const settings = Object.assign({
            stdout: false,
            stderr: false,
            onStdout: null,
            onStderr: null,
            local: true,
            silent: false,
            cwd: process.cwd(),
            env: {},
            encoding: 'utf-8',
            stdio: 'pipe'
        }, options);

        const result = {
            code: null,
            stdout: '',
            stderr: ''
        };

        const env = Object.assign({}, process.env, settings.env); // eslint-disable-line no-process-env
        if (settings.local) {
            const paths = (env.PATH || '').split(':');
            paths.unshift('./node_modules/.bin');
            env.PATH = paths.join(':');
        }

        if (!settings.silent) {
            console.log(chalk.green('run') + ' ' + cmd);
        }

        const proc = spawn('sh', ['-c', cmd], {
            stdio: settings.stdio,
            encoding: settings.encoding,
            cwd: settings.cwd,
            env
        });

        proc.on('close', code => {
            result.code = code;
            if (result.code === 0) {
                resolve(result);
            } else {
                const err = new Error(`[${code}] ${cmd}`);
                err.run = result;
                reject(err);
            }
        });

        proc.on('error', err => {
            err.run = result;
            reject(err);
        });

        if (proc.stdout) {
            proc.stdout.on('data', data => {
                data = data.toString(settings.encoding);
                result.stdout += data;
                as_fn(settings.onStdout)(data);
                if (settings.stdout) {
                    process.stdout.write(data);
                }
            });
        }

        if (proc.stderr) {
            proc.stderr.on('data', data => {
                data = data.toString(settings.encoding);
                result.stderr += data;
                as_fn(settings.onStderr)(data);
                if (settings.stderr) {
                    process.stderr.write(data);
                }
            });
        }
    });
};

run.sync = (cmd, options) => {
    const result = {
        code: null,
        stdout: '',
        stderr: '',
        error: null
    };

    try {
        const settings = Object.assign({
            local: true,
            silent: false,
            cwd: process.cwd(),
            env: {},
            encoding: 'utf-8',
            stdio: 'pipe'
        }, options);

        const env = Object.assign({}, process.env, settings.env); // eslint-disable-line no-process-env
        if (settings.local) {
            const paths = (env.PATH || '').split(':');
            paths.unshift('./node_modules/.bin');
            env.PATH = paths.join(':');
        }

        if (!settings.silent) {
            console.log(chalk.green('run') + ' ' + cmd);
        }

        const res = spawnSync('sh', ['-c', cmd], {
            stdio: settings.stdio,
            encoding: settings.encoding,
            cwd: settings.cwd,
            env
        });

        result.code = res.status;
        result.stdout = res.stdout;
        result.stderr = res.stderr;
    } catch (err) {
        result.error = err;
    }

    return result;
};
