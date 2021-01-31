import React from 'react';

import { ITeams } from 'types';

interface IWinnerArgs {
  team: ITeams;
}

export default function Congrats({ team }: IWinnerArgs) {
  return (
    <div className="flex justify-center items-center flex-col w-full">
      <h3 className="mb-5">Congratulations {team.toLocaleUpperCase()} team!</h3>
      <span>Would you like to start a new game?</span>
    </div>
  );
}
