import chunk from 'lodash/chunk';
import { LETTERS } from 'const';

export const generateLettersArray = (rows: number, columns: number) => {
  // const letters = LETTERS.split('');

  // const total = rows * columns;

  // const shuffledLetters = Array(total)
  //   .fill('')
  //   .map(() => letters.splice(getRandom.indexFromArray(letters), 1).pop());

  // return chunk(shuffledLetters, rows);

  const lettersArray = [
    ['H', 'V', 'I', 'Y', 'A'],
    ['N', 'L', 'Q', 'X', 'D'],
    ['Z', 'M', 'U', 'O', 'S'],
    ['T', 'W', 'B', 'P', 'J'],
    ['R', 'K', 'C', 'F', 'E'],
  ];

  lettersArray.map((colLettersArray: string[]) => {
    colLettersArray.unshift('');
    colLettersArray.push('');

    return colLettersArray;
  });

  lettersArray.unshift(Array(7).fill(''));
  lettersArray.push(Array(7).fill(''));

  return lettersArray;
};

export const getRandom = {
  indexFromArray: (array: any[]) => Math.floor(Math.random() * array.length),
  fromArray: (array: any[]) => {
    const index = Math.floor(Math.random() * array.length);

    return array[index];
  },
};

export function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in obj;
}
