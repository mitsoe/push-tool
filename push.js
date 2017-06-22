const simpleGit = require('simple-git');
const fs = require('fs-extra')
const rimraf = require('rimraf');

const repos = [
    `https://mitch_lamers@bitbucket.org/mitch_lamers/ftp.git`,
    // `https://mitch_lamers@bitbucket.org/mitch_lamers/woezik.git`
]
const files = [
    `example.js`,
    `bla.js`
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
        console.log(`Added ${aFileName} ${aIsLastFile}`)
        //     gitInDir.commit(`update ${aFileName}`).push('origin', 'master', (succes) => {
        //         removeFolder(aTempFolder);
        //     });
    });
}

function removeFolder(aTempFolder) {
    rimraf(aTempFolder, () => { });
}

