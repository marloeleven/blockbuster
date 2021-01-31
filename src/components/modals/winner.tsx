import React from 'react';

import { IFunction } from 'types';

interface IWinnerArgs {
  onClickRed: IFunction;
  onClickBlue: IFunction;
}

export default function Winner({ onClickRed, onClickBlue }: IWinnerArgs) {
  return (
    <div className="flex justify-center items-center flex-col w-full">
      <h3 className="mb-5">Choose a winner</h3>
      <div>
        <button className="button  mr-3 red" onClick={onClickRed}>
          RED
        </button>
        <button className="button  blue" onClick={onClickBlue}>
          BLUE
        </button>
      </div>
    </div>
  );
}
