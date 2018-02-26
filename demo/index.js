const scorekeeper = require('../dist');

const fileName = 'demo/scores.txt';
const fileDest = `demo/${Date.now()}-ranks.txt`;

const rankings = scorekeeper(fileName, fileDest, true);

console.log(rankings); // eslint-disable-line no-console