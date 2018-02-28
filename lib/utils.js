import fs from 'fs';
import path from 'path';
import emoji from 'node-emoji';

/**
 * Read file data from current working directory/${fileName}.
 * @param {string} fileName
 * @returns {string}
 */
export function readFileData(fileName) {
  const filePath = path.resolve(process.cwd(), fileName);
  const fileData = fs.readFileSync(filePath, 'utf8');

  if (!fileData) {
    handleError(`File '${filePath}' is empty.`);
  }

  return fileData;
}

/**
 * Sorting by team points, resorts to alphabetical sort if teams have same points.
 * @param {Object} a
 * @param {Object} b
 * @returns {boolean}
 */
export function sortByPoints(a, b) {
  if (typeof a !== 'object' || typeof b !== 'object') {
    handleError(`Invalid arguments provided. Expected ${a} and ${b} to be Type Object`);
  }

  if (a.points === b.points) {
    return a.name > b.name;
  }

  return a.points < b.points;
}

/**
 * Normalizes fileData to an array split at line breaks.
 * @param {string} fileData
 * @returns {Array}
 */
export function normalizeFileData(fileData) {
  if (!fileData || typeof fileData !== 'string') {
    handleError('File does not contain valid data.');
  }

  return fileData
    .trim()
    .split('\n')
    .map(el => el.trim());
}

/**
 * Writes a file to `destName` with the contents of `rankings`
 * @param {string} destName
 * @param {string} rankings
 */
export function writeToFileDest(destName, rankings) {
  if (typeof destName !== 'string' || typeof rankings !== 'string') {
    handleError(`Invalid input provided. Expected ${destName} and ${rankings} to be Type String`);
  }

  log(' Writing to file...', 'hammer');

  const destPath = path.resolve(process.cwd(), destName);

  fs.writeFileSync(destPath, rankings);

  log(` File written to: ${destPath}`, 'balloon');
}

/**
 * Assigns rankings to teams based on points
 * @param {Array} parsedAndSortedData
 * @returns {Array}
 */
export function assignRanks(parsedAndSortedData) {
  if (!Array.isArray(parsedAndSortedData)) {
    handleError(`Invalid input provided. Expected ${parsedAndSortedData} to be Type Array`);
  }

  let rank = 1;
  let skipRank = 0;

  return parsedAndSortedData.map((item, idx) => {
    const currentTeam = item;
    const previousTeam = idx > 0 ? parsedAndSortedData[idx - 1] : { points: -1 }; // assign a default point value of -1 for the

    if (currentTeam.points < previousTeam.points) {
      rank = rank + 1 + skipRank;
      skipRank = 0;
    } else if (currentTeam.points === previousTeam.points) {
      skipRank++;
    }

    item.rank = rank;

    return item;
  });
}

/**
 * Assigns points based on Win / Loss / Tie point allocations
 * @param {Array} game
 * @returns {Array}
 */
export function assignPoints(game) {
  if (!Array.isArray(game)) {
    handleError(`Invalid input provided. Expected ${game} to be Type Array`);
  }

  const [team1, team2] = game;

  if (typeof team1 !== 'object' || typeof team2 !== 'object' || typeof team1.points !== 'number' || typeof team2.points !== 'number') {
    handleError(`Invalid input provided. Expected ${team1} and ${team2} to be Type Objects with a Type Number "points" property`);
  }

  if (team1.score > team2.score) {
    team1.points += 3;
  } else if (team1.score < team2.score) {
    team2.points += 3;
  } else if (team1.score === team2.score) {
    team1.points += 1;
    team2.points += 1;
  }

  // Remove `score` property as it is no longer needed;
  delete team1.score;
  delete team2.score;

  return [team1, team2];
}

/**
 * Accumulates team points based on scores per-game.
 * @param {Array} acc
 * @param {Array} currVal
 * @returns {Array}
 */
export function reduceTeamPoints(acc, currVal) {
  if (!Array.isArray(acc) || !Array.isArray(currVal)) {
    handleError(`Invalid input provided. Expected ${acc} and ${currVal} to be Type Arrays`);
  }

  const [team1, team2] = assignPoints(currVal);

  const team1Idx = acc.findIndex(el => el.name === team1.name);

  if (team1Idx === -1) {
    acc.push(team1);
  } else {
    acc[team1Idx] = Object.assign(acc[team1Idx], { points: acc[team1Idx].points + team1.points });
  }

  const team2Idx = acc.findIndex(el => el.name === team2.name);

  if (team2Idx === -1) {
    acc.push(team2);
  } else {
    acc[team2Idx] = Object.assign(acc[team2Idx], { points: acc[team2Idx].points + team2.points });
  }

  return acc;
}

/**
 * Parses string data into a workable Array of game Objects.
 * @param {Array} acc
 * @param {String} currVal
 * @returns {Array}
 */
export function reduceGameData(acc, currVal) {
  return acc.concat([
    currVal
      .split(', ')
      .map((item) => {
        const splitItem = item.split(' ');

        return {
          name: splitItem.slice(0, -1).join(' ').trim(),
          score: Number(splitItem[splitItem.length - 1]),
          points: 0,
        };
      }),
  ]);
}


// Helpers
function handleError(message) {
  throw new Error(message);
}

function log(message, emoj) {
  return console.log(emoji.get(emoj), message); // eslint-disable-line no-console
}