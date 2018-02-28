import fs from 'fs';
import path from 'path';

import {
  assignPoints,
  assignRanks,
  sortByPoints,
  readFileData,
  normalizeFileData,
  reduceTeamPoints,
  writeToFileDest,
  reduceGameData
} from '../lib/utils';

describe('sortByPoints', () => {
  it('should sort two objects by points', () => {
    expect(sortByPoints({ points: 1 }, { points: 3 })).toBe(true);
    expect(sortByPoints({ points: 10 }, { points: 3 })).toBe(false);
  });

  it('should resort to sorting by name if points are tied', () => {
    expect(sortByPoints({ points: 2, name: 'Alpha' }, { points: 2, name: 'Beta'})).toBe(false);
    expect(sortByPoints({ points: 12, name: 'Zed' }, { points: 12, name: 'Beta'})).toBe(true);
  });

  it('should throw an error on invalid input', () => {
    expect(() => sortByPoints(null, { points: 2, name: 'Beta'})).toThrow();
    expect(() => sortByPoints()).toThrow();
  });
});

describe('readFileData', () => {
  it('should return utf8 string', () => {
    expect(typeof readFileData('test/testData/Scores.txt')).toBe('string');
    expect(readFileData('test/testData/Scores.txt')).toContain('Falcons');
    expect(readFileData('test/testData/Scores.txt')).toContain('Bears');
  });

  it('should throw an error when reading an empty file', () => {
    expect(() => readFileData('test/testData/Empty.txt')).toThrow();
  });

  it('should throw an error when provided an invalid path', () => {
    expect(() => readFileData('test/testData/EmptyThatDoesNotExist.txt')).toThrow();
  });
});

describe('normalizeFileData', () => {
  it('should return an array split at linebreaks', () => {
    expect(Array.isArray(normalizeFileData('The night is dark and full of terror'))).toBe(true);
    expect(normalizeFileData('Bolton 2, Stark 9000 \n Lannister 3, Tyrell 14').length).toBe(2);
    expect(normalizeFileData('Bolton 2, Stark 9000 \n Lannister 3, Tyrell 14 \n Greyjoy 1, Martell 20').length).toBe(3);
  });

  it('should trim whitespace from each line', () => {
    expect(normalizeFileData('Bolton 2, Stark 9000 \n          Lannister 3, Tyrell 14               ')[1]).toBe('Lannister 3, Tyrell 14');
    expect(normalizeFileData('Bolton 2, Stark 9000               ')[0]).toBe('Bolton 2, Stark 9000');
  });

  it('should throw an error on an invalid input', () => {
    expect(() => normalizeFileData([])).toThrow();
    expect(() => normalizeFileData(1)).toThrow();
    expect(() => normalizeFileData('')).toThrow();
    expect(() => normalizeFileData(false)).toThrow();
  });
});

describe('writeToFileDest', () => {
  it('should throw an error when provided invalid arguments', () => {
    expect(() => writeToFileDest()).toThrow();
    expect(() => writeToFileDest('test')).toThrow();
    expect(() => writeToFileDest(null, 'test')).toThrow();
  });

  it('should throw when an invalid file path is provided', () => {
    expect(() => writeToFileDest('test', 'test')).toThrow();
  });

  // Need to nest this describe so I can cleanup written files..
  describe('creating a new file', () => {
    afterAll(() => {
      fs.unlinkSync(path.resolve(__dirname, 'testData/test.txt'));
    });

    it('should create a new file', () => {
      expect(writeToFileDest('test/testData/test.txt', 'Winter is coming'));
      expect(fs.readFileSync('test/testData/test.txt', 'utf8')).toBe('Winter is coming');
    });
  });
});

describe('assignRanks', () => {
  it('should throw an error when provided invalid arguments', () => {
    expect(() => assignRanks()).toThrow();
    expect(() => assignRanks('test')).toThrow();
    expect(() => assignRanks(null)).toThrow();
    expect(() => assignRanks({})).toThrow();
    expect(() => assignRanks(false)).toThrow();
  });

  it('should assign ranks to an already sorted list', () => {
    expect(assignRanks([{ name: 'Badgers', points: 10 }, { name: 'Bears', points: 3 }])[0]).toEqual({ name: 'Badgers', points: 10, rank: 1 });
    expect(assignRanks([{ name: 'Badgers', points: 10 }, { name: 'Bears', points: 3 }])[1]).toEqual({ name: 'Bears', points: 3, rank: 2 });
  });

  it('should "skip" a rank if teams have the same points', () => {
    expect(assignRanks([{ name: 'Badgers', points: 3 }, { name: 'Bears', points: 3 }])[0]).toEqual({ name: 'Badgers', points: 3, rank: 1 });
    expect(assignRanks([{ name: 'Badgers', points: 3 }, { name: 'Bears', points: 3 }])[1]).toEqual({ name: 'Bears', points: 3, rank: 1 });
    expect(assignRanks([{ name: 'Badgers', points: 3 }, { name: 'Bears', points: 3 }, { name: 'Falcons', points: 1 }])[2]).toEqual({ name: 'Falcons', points: 1, rank: 3 });
  });
});

describe('assignPoints', () => {
  it('should throw an error when provided invalid arguments', () => {
    expect(() => assignPoints()).toThrow();
    expect(() => assignPoints('test')).toThrow();
    expect(() => assignPoints(null)).toThrow();
    expect(() => assignPoints({})).toThrow();
    expect(() => assignPoints(false)).toThrow();
  });

  it('should throw an error when a valid Array is provided, but invalid contents', () => {
    expect(() => assignPoints([true, false])).toThrow();
    expect(() => assignPoints(['dog', 'cat'])).toThrow();
    expect(() => assignPoints([false, null])).toThrow();
    expect(() => assignPoints([])).toThrow();

    expect(() => assignPoints([{ name: 'Badgers', score: 35, points: 0 }, { name: 'Bears', score: 10 }])).toThrow();
    expect(() => assignPoints([{ name: 'Badgers', score: 35, points: 0 }, { name: 'Bears', score: 10, points: null }])).toThrow();
    expect(() => assignPoints([{ name: 'Badgers', score: 35, points: 0 }, { name: 'Bears', score: 10, points: '0' }])).toThrow();
  });

  it('should give 3 points to the winning team', () => {
    expect(assignPoints([{ name: 'Badgers', score: 35, points: 0 }, { name: 'Bears', score: 10, points: 0 }])[0]).toEqual({ name: 'Badgers', points: 3 });
  });

  it('should give 1 point to each team if there is a tie', () => {
    expect(assignPoints([{ name: 'Badgers', score: 10, points: 0 }, { name: 'Bears', score: 10, points: 0 }])[0]).toEqual({ name: 'Badgers', points: 1 });
    expect(assignPoints([{ name: 'Badgers', score: 10, points: 0 }, { name: 'Bears', score: 10, points: 0 }])[1]).toEqual({ name: 'Bears', points: 1 });
  });

  it('should give 0 points to the losing team', () => {
    expect(assignPoints([{ name: 'Badgers', score: 35, points: 0 }, { name: 'Bears', score: 10, points: 0 }])[1]).toEqual({ name: 'Bears', points: 0 });
  });

  it('should remove the "score" property from both teams', () => {
    expect(assignPoints([{ name: 'Badgers', score: 10, points: 0 }, { name: 'Bears', score: 10, points: 0 }])[0].score).toBeUndefined();
    expect(assignPoints([{ name: 'Badgers', score: 10, points: 0 }, { name: 'Bears', score: 10, points: 0 }])[1].score).toBeUndefined();
  });
});

describe('reduceTeamPoints', () => {
  it('should throw an error when provided invalid arguments', () => {
    expect(() => reduceTeamPoints()).toThrow();
    expect(() => reduceTeamPoints('test')).toThrow();
    expect(() => reduceTeamPoints(null)).toThrow();
    expect(() => reduceTeamPoints({})).toThrow();
    expect(() => reduceTeamPoints(false)).toThrow();
  });

  it('should only return a single instance of each team', () => {
    const gameData = [
      { name: 'Red Pandas', score: 1, points: 0 },
      { name: 'Snakes', score: 3, points: 0 },
    ];

    expect(reduceTeamPoints([{ name: 'Red Pandas', points: 3 }], gameData).length).toBe(2);
    expect(reduceTeamPoints([{ name: 'Snakes', points: 1 }], gameData).length).toBe(2);
  });

  it('should increment points of each team with the existing accumulated points', () => {
    const acc = [
      { name: 'Red Pandas', points: 3 },
      { name: 'Snakes', points: 1 },
    ];

    const gameData = [
      { name: 'Red Pandas', score: 1, points: 0 },
      { name: 'Snakes', score: 3, points: 0 },
    ];

    // Mutates "acc" variable as it is used in a .reduce chain
    reduceTeamPoints(acc, gameData);

    expect(acc[0].points).toBe(3);
    expect(acc[1].points).toBe(4);
    expect(acc[2]).toBeUndefined();
  });
});

describe('reduceGameData', () => {
  it('should throw an error when provided invalid arguments', () => {
    expect(() => reduceGameData()).toThrow();
    expect(() => reduceGameData('test')).toThrow();
    expect(() => reduceGameData(null)).toThrow();
    expect(() => reduceGameData({})).toThrow();
    expect(() => reduceGameData(false)).toThrow();
  });

  it('should return an array of games', () => {
    const acc = [];
    const game = 'Snakes 10, Panthers 4';

    expect(reduceGameData(acc, game).length).toBe(1);
    expect(reduceGameData(acc, game)[0][0].name).toBe('Snakes');
    expect(reduceGameData(acc, game)[0][1].name).toBe('Panthers');
  });
});