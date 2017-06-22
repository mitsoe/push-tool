var simpleGit = require('simple-git');

const tempFolder = `./tmp`;
const repo = `https://mitch_lamers@bitbucket.org/mitch_lamers/ftp.git`;

simpleGit().clone(repo, tempFolder, (result) => {
    console.log(result);
})