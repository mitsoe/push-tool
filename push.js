const simpleGit = require('simple-git');
const fs = require('fs-extra')
const rimraf = require('rimraf');

const repos = [
    `https://username@bitbucket.org/username/repository.git`,
    `https://username@bitbucket.org/username/repository.git`
]
const files = [
    `newfile.js`,
    `newfile2.js`
]

init();

function init() {
    const tempFolder = `./alltemp/tmp`;
    repos.forEach((element, index) => {
        clone(element, `${tempFolder}-${index}`);
    })
}

function clone(aRepo, aTempFolder) {
    rimraf(aTempFolder, function () {
        simpleGit().clone(aRepo, aTempFolder, (result) => {
            copyFile(aTempFolder);
        });
    });
}

function copyFile(aTempFolder) {
    files.forEach((fileName, index) => {
        var newFile = `${aTempFolder}/${fileName}`;
        rimraf(newFile, function () {
            fs.copy(`./${fileName}`, newFile)
                .then(() => {
                    var lastFile = files.length == index + 1;
                    addToGit(aTempFolder, fileName, lastFile);
                })
                .catch(err => {
                    console.error('Copy failed, remove folder')
                    removeFolder(aTempFolder);
                })
        });
    });
}

function addToGit(aTempFolder, aFileName, aIsLastFile) {
    const gitInDir = simpleGit(aTempFolder);
    gitInDir.add(aFileName, (result) => {
        if (aIsLastFile) {
            gitInDir.commit(`update from push tool`).push('origin', 'master', (succes) => {
                removeFolder(aTempFolder);
            });
        }
    });
}

function removeFolder(aTempFolder) {
    rimraf(aTempFolder, () => { });
}

