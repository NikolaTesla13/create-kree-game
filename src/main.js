import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import listr from  'listr';
import { projectInstall } from 'pkg-install';
import Listr from 'listr';

const access = promisify(fs.access); 
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false,
    })
}

async function initGit(options) {
    const result = await execa('git', ['init'], {
        cwd: options.targetDirectory
    });
    if(result.failed) {
        return;
    }
}

export async function createProject(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    };

    const currentFileUrl = import.meta.url;
    var templateDir = path.resolve(
        new URL(currentFileUrl).pathname,
        '../../templates',
        options.template.toLowerCase()
    );
    templateDir = templateDir.substring(3, templateDir.length);
    options.templateDirectory = templateDir;

    try {
        await access(templateDir, fs.constants.R_OK);
    } catch(err) {
        console.log('%s Invalid template name', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    const tasks = new Listr([
        {
            title: 'Copy project files',
            task: () => copyTemplateFiles(options)
        },
        {
            title: 'Initialize git',
            task: () => initGit(options),
            enabled: () => options.git
        },
    ]);
    await tasks.run();
    console.log('%s Project rady', chalk.green.bold('DONE'));
    return true;
}