import fs from 'fs';
import path from 'path';

import scorekeeper from '../lib';

afterAll(() => {
  fs.unlinkSync(path.resolve(__dirname, 'rank1.txt'));
});

describe('scorekeeper', () => {
  it('should accept 3 arguments', () => {
    expect(scorekeeper(__dirname, 'Scores.txt', 'rank1.txt')).toBeDefined();
  });
});
