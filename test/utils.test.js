import fs from 'fs';
import path from 'path';

import {
  sortByPoints,
  readFileData,
  normalizeFileData,
  writeToFileDest
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
