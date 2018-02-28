import fs from 'fs';
import path from 'path';

import scorekeeper from '../lib';

describe('scorekeeper', () => {
  afterEach(() => {
    fs.unlinkSync(path.resolve(__dirname, 'testData/rank1.txt'));
  });

  it('should accept a single Object arugment containing two String properties', () => {
    expect(scorekeeper({ fileName: 'test/testData/Scores.txt', destName: 'test/testData/rank1.txt' })).toBeDefined();

    expect(() => scorekeeper()).toThrow();
    expect(() => scorekeeper(1)).toThrow('Invalid arguments provided.');
    expect(() => scorekeeper({ destName: true })).toThrow('Invalid arguments provided.');
  });

  it('should return an Array of rankings', () => {
    const sut = scorekeeper({ fileName: 'test/testData/Scores.txt', destName: 'test/testData/rank1.txt' });

    expect(sut).toBeDefined();
    expect(Array.isArray(sut)).toBe(true);
    expect(sut.length).toBe(8);
  });
});
