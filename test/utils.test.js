import {
  convertUtfDataToArray,
  parseMatchesToObjects,
  calculatePointTotal
} from '../lib/utils';

describe('convertUtfDataToArray', () => {
  it('should only accept a string as an argument', () => {
    expect(() => convertUtfDataToArray(1)).toThrow();
    expect(() => convertUtfDataToArray({})).toThrow();
    expect(() => convertUtfDataToArray([])).toThrow();
    expect(() => convertUtfDataToArray(false)).toThrow();
    expect(() => convertUtfDataToArray(NaN)).toThrow();
    expect(convertUtfDataToArray('')).toBeInstanceOf(Array);
  });

  it('should return an array', () => {
    const sut = convertUtfDataToArray('');

    expect(sut).toHaveProperty('length');
    expect(sut).toBeInstanceOf(Array);
  });

  it('should split utf8 data on line breaks', () => {
    const sut = convertUtfDataToArray('Hello \n world');

    expect(sut.length).toEqual(2);
    expect(sut[0]).toEqual('Hello');
    expect(sut[1]).toEqual('world');
    expect(sut.includes('\n')).toEqual(false);
  });

  it('should trim white space', () => {
    const sut = convertUtfDataToArray('Hello \n world           \n       My name is Blake');

    expect(sut[0]).toEqual('Hello');
    expect(sut[1]).toEqual('world');
    expect(sut[2]).toEqual('My name is Blake');
  });
});

describe('parseMatchesToObjects', () => {
  it('should only accept an array as an argument', () => {
    expect(() => parseMatchesToObjects(1)).toThrow();
    expect(() => parseMatchesToObjects({})).toThrow();
    expect(() => parseMatchesToObjects('Batman')).toThrow();
    expect(() => parseMatchesToObjects(false)).toThrow();
    expect(() => parseMatchesToObjects(NaN)).toThrow();
    expect(parseMatchesToObjects([])).toBeInstanceOf(Array);
  });

  it('should return an array', () => {
    const sut = parseMatchesToObjects([]);

    expect(sut).toBeInstanceOf(Array);
  });

  it('should parse games into separate arrays', () => {
    const arrayOfGames = ['Panthers 10, Vikings 14', 'Cardinals 14, Patriots 0'];

    const sut = parseMatchesToObjects(arrayOfGames);

    expect(sut.length).toEqual(2);
  });

  it('should designate a "score" and "name" property to each team represented in the game', () => {
    const arrayOfGames = ['Vikings 21, Lions 3', '49ers 6, Rams 42', 'Donkeys 2, Firebirds 3'];

    const sut = parseMatchesToObjects(arrayOfGames);

    const gameOne = sut[0];

    expect(gameOne.length).toEqual(2);
    expect(gameOne[0]).toHaveProperty('name');
    expect(gameOne[0]).toHaveProperty('score');
    expect(gameOne[0].score).toEqual(21);

    expect(gameOne[1]).toHaveProperty('name');
    expect(gameOne[1]).toHaveProperty('score');
    expect(gameOne[1].name).toEqual('Lions');

    expect(sut[1].length).toEqual(2);
    expect(sut[2].length).toEqual(2);
  });
});

describe('calculatePointTotal', () => {
  it('should only accept an array as an argument', () => {
    expect(() => calculatePointTotal(1)).toThrow();
    expect(() => calculatePointTotal({})).toThrow();
    expect(() => calculatePointTotal(false)).toThrow();
    expect(() => calculatePointTotal('Robin')).toThrow();
    expect(() => calculatePointTotal(NaN)).toThrow();
    expect(calculatePointTotal([])).toBeInstanceOf(Object);
  });

  it('should return an object', () => {
    expect(calculatePointTotal([])).toBeInstanceOf(Object);
  });

  it('return a dictionary of teams with', () => {
    const arrayOfMatchs = [
      [
        { name: 'Dolphins', score: 10, },
        { name: 'Cowboys', score: 21, }
      ],
      [
        { name: 'Eagles', score: 3, },
        { name: 'Vikings', score: 21, }
      ]
    ];

    const sut = calculatePointTotal(arrayOfMatchs);

    expect(sut).toHaveProperty('Dolphins');
    expect(sut).toHaveProperty('Eagles');
    expect(sut[0]).toEqual('Hello');
    expect(sut[1]).toEqual('world');
    expect(sut.includes('\n')).toEqual(false);
  });

});