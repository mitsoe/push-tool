const simpleGit = require('simple-git');
const fs = require('fs-extra')
const rimraf = require('rimraf');

const repo = `https://xx@bitbucket.org/user/repo.git`;
const tempFolder = `./tmp`;
const fileName = `example.js`;
const newFile = `${tempFolder}/${fileName}`;

clone(repo);

function clone(aRepo) {
    rimraf(tempFolder, function () {
        simpleGit().clone(repo, tempFolder, (result) => {
            copyFile();
        });
    });
}

function copyFile() {
    rimraf(newFile, function () {
        fs.copy(`./${fileName}`, newFile)
            .then(() => {
                addToGit();
            })
            .catch(err => console.error(err))
    });
}

function addToGit() {
    const gitInDir = simpleGit('./tmp');

    gitInDir.add(fileName, (result) => {
        gitInDir.commit(`update ${fileName}`).push('origin', 'master', (succes) => {
            removeFolder(tempFolder);
        }, (error) => {
            console.error('Commit or push failed');
            removeFolder(tempFolder);
        });
    });
}

function removeFolder(aTempFolder) {
    rimraf(aTempFolder, () => { });
}

