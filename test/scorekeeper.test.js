import fs from 'fs';
import path from 'path';

import scorekeeper from '../lib';

describe('scorekeeper', () => {
  afterEach(() => {
    fs.unlinkSync(path.resolve(__dirname, 'testData/rank1.txt'));
  });

  it('should require 2 arguments of Type string', () => {
    expect(scorekeeper('test/testData/Scores.txt', 'test/testData/rank1.txt', true)).toBeDefined();

    expect(() => scorekeeper()).toThrow('Invalid arguments provided.');
    expect(() => scorekeeper(1)).toThrow('Invalid arguments provided.');
    expect(() => scorekeeper(null, true)).toThrow('Invalid arguments provided.');
  });

  it('should return a string of rankings', () => {
    const sut = scorekeeper('test/testData/Scores.txt', 'test/testData/rank1.txt', true);

    expect(sut).toBeDefined();
    expect(typeof sut).toBe('string');
    expect(sut.split('\n').length).toBe(8);
  });
});
