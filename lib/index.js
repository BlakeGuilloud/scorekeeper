import fs from 'fs';
import path from 'path';

import {
  normalizeFileData,
  assignRanks,
  parseAndSortData,
  readFileData,
  reduceGameData,
  reduceTeamPoints,
  sortByPoints,
  writeToFileDest
} from './utils';

module.exports = ({ fileName, destName }) => {
  if (typeof fileName !== 'string' || (destName && typeof destName !== 'string')) {
    throw new Error('Invalid arguments provided.');
  }

  const fileData = readFileData(fileName);
  const cleanData = normalizeFileData(fileData);
  const parsedGameData = cleanData
    .reduce(reduceGameData, [])
    .reduce(reduceTeamPoints, [])
    .sort(sortByPoints);

  const rankings = assignRanks(parsedGameData);

  const text = rankings
    .map(({ name, points, rank }) => `${rank}. ${name} ${points}`)
    .join('\n');

  // Only write to file if a "destName" is provided.
  // This gives flexibility to the application as it can be used for more than just writing to local files.
  if (destName) {
    writeToFileDest(destName, text);
  }

  console.log(text); // eslint-disable-line no-console

  // Return "rankings" as it the data has practical use
  return rankings;
};
