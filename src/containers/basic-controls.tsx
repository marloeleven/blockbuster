import React, { useCallback, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { ITeams } from 'types';

import * as appActions from 'app/slices/app';
import clsx from 'clsx';

export default () => {
  const isRunning = useSelector(appActions.get.isRunning);
  const selectedLetter = useSelector(appActions.get.selectedLetter);

  const isQuestionVisible = useSelector(appActions.get.isQuestionVisible);
  const isAnswerVisible = useSelector(appActions.get.isAnswerVisible);

  const isBlueBlinking = useSelector(appActions.get.isBlueBlinking);
  const isRedBlinking = useSelector(appActions.get.isRedBlinking);

  const blueLetters = useSelector(appActions.get.blueLetters);
  const redLetters = useSelector(appActions.get.redLetters);

  const dispatch = useDispatch();

  const toggleShowQuestion = useCallback(() => {
    dispatch(appActions.toggleShowQuestion());
  }, [dispatch]);

  const toggleShowAnswer = useCallback(() => {
    dispatch(appActions.toggleShowAnswer());
  }, [dispatch]);

  const toggleRedBlink = useCallback(() => {
    dispatch(appActions.toggleBlink(ITeams.RED));
  }, [dispatch]);

  const toggleBlueBlink = useCallback(() => {
    dispatch(appActions.toggleBlink(ITeams.BLUE));
  }, [dispatch]);

  const setSelectedLetterToRed = useCallback(() => {
    dispatch(appActions.assignLetter(ITeams.RED));
  }, [dispatch]);

  const setSelectedLetterToBlue = useCallback(() => {
    dispatch(appActions.assignLetter(ITeams.BLUE));
  }, [dispatch]);

  const clearColor = useCallback(() => dispatch(appActions.removeLetter()), [
    dispatch,
  ]);

  const startGame = useCallback(() => dispatch(appActions.startGame()), [
    dispatch,
  ]);
  const endGame = useCallback(() => dispatch(appActions.endGame()), [dispatch]);

  const selectedLetterIsAssigned = useMemo(
    () =>
      blueLetters.includes(selectedLetter) ||
      redLetters.includes(selectedLetter),
    [blueLetters, redLetters, selectedLetter]
  );

  return (
    <div className="basic-controls p-5 flex flex-col flex-grow">
      <div className="basic flex-grow">
        <h3>Blinkers</h3>
        <button
          className={clsx(
            {
              'blink-active': isRedBlinking,
            },
            'button  mr-3 red'
          )}
          onClick={toggleRedBlink}
        >
          RED
        </button>
        <button
          className={clsx(
            {
              'blink-active': isBlueBlinking,
            },
            'button blue'
          )}
          onClick={toggleBlueBlink}
        >
          BLUE
        </button>
        <button className="button float-right">SET WINNER</button>
      </div>
      <div
        className={clsx({ hidden: !selectedLetter }, 'actions flex flex-col')}
      >
        <div className={clsx({ hidden: selectedLetterIsAssigned }, 'mb-3')}>
          <button className="button mr-3" onClick={toggleShowQuestion}>
            {isQuestionVisible ? 'HIDE QUESTION' : 'SHOW QUESTION'}
          </button>
          <button
            className={clsx({ hidden: !isQuestionVisible }, 'button mr-3')}
            onClick={toggleShowAnswer}
          >
            {isAnswerVisible ? 'HIDE ANSWER' : 'SHOW ANSWER'}
          </button>
        </div>
        <div
          className={clsx({ hidden: !selectedLetterIsAssigned }, 'clearLetter')}
        >
          <button className="button mr-3 red" onClick={clearColor}>
            Clear Color
          </button>
        </div>
        <div
          className={clsx(
            { hidden: selectedLetterIsAssigned },
            'assign-letter'
          )}
        >
          <h3>
            Assign Letter <span className="font-bold">"{selectedLetter}"</span>{' '}
            to:
          </h3>
          <button className="button mr-3 red" onClick={setSelectedLetterToRed}>
            Red
          </button>
          <button
            className="button mr-3 blue"
            onClick={setSelectedLetterToBlue}
          >
            Blue
          </button>
        </div>
      </div>
      <div className="main">
        <div className="float-right flex flex-col">
          <button
            className={clsx('button', { hidden: isRunning })}
            onClick={endGame}
          >
            END GAME
          </button>
          <button
            className={clsx('button', { hidden: !isRunning })}
            onClick={startGame}
          >
            START GAME
          </button>
        </div>
      </div>
    </div>
  );
};
