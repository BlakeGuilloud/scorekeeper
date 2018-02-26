import fs from 'fs';
import path from 'path';

import {
  normalizeFileData,
  assignRanks,
  parseAndSortData,
  readFileData,
  reduceGameData,
  reduceTeamScores,
  sortByPoints,
  writeToFileDest
} from './utils';

module.exports = (fileName, destName, shouldWriteFile = false) => {
  if (typeof fileName !== 'string' || typeof destName !== 'string') {
    throw new Error('Invalid arguments provided.');
  }

  const fileData = readFileData(fileName);
  const cleanData = normalizeFileData(fileData);
  const parsedGameData = cleanData
    .reduce(reduceGameData, [])
    .reduce(reduceTeamScores, [])
    .sort(sortByPoints);

  const rankings = assignRanks(parsedGameData)
    .map(({ name, points, rank }) => `${rank}. ${name} ${points}`)
    .join('\n');


  if (shouldWriteFile === true) {
    writeToFileDest(destName, rankings);
  }


  return rankings;
};
