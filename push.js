const simpleGit = require('simple-git');
const fs = require('fs-extra')
const rimraf = require('rimraf');

const repos = [
    `https://mitch_lamers@bitbucket.org/mitch_lamers/ftp.git`,
    `https://mitch_lamers@bitbucket.org/mitch_lamers/woezik.git`
]
const files = [
    `example.js`
]

init();

function init() {
    const tempFolder = `./tmp`;
    repos.forEach((element, index) => {
        clone(element, `example.js`, `${tempFolder}-${index}`);
    })
}

function clone(aRepo, aFileName, aTempFolder) {
    rimraf(aTempFolder, function () {
        simpleGit().clone(aRepo, aTempFolder, (result) => {
            copyFile(aFileName, aTempFolder);
        });
    });
}

function copyFile(aFileName, aTempFolder) {
    const newFile = `${aTempFolder}/${aFileName}`;
    rimraf(newFile, function () {
        fs.copy(`./${aFileName}`, newFile)
            .then(() => {
                addToGit(aTempFolder, aFileName);
            })
            .catch(err => console.error(err))
    });
}

function addToGit(aTempFolder, aFileName) {
    const gitInDir = simpleGit(aTempFolder);
    gitInDir.add(aFileName, (result) => {
        gitInDir.commit(`update ${aFileName}`).push('origin', 'master', (succes) => {
            removeFolder(aTempFolder);
        });
    });
}

function removeFolder(aTempFolder) {
    rimraf(aTempFolder, () => { });
}

