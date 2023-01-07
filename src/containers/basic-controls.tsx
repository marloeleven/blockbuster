import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import { IModalManagerActions, ITeams } from 'types';

import messages from 'const/messages';

import * as appActions from 'app/slices/app';

import { modalManager$, ModalManagerContext } from 'components/modal-manager';
import Winner from 'components/modals/winner';
import Congrats from 'components/modals/congrats';
import { onResyncAnimation$ } from 'handlers/subscriptions';
import { delay, filter, map, tap } from 'rxjs/operators';
import { generateLettersArray } from 'utils/helpers';

export default function BasicControl() {
  const isRunning = useSelector(appActions.get.isRunning);
  const selectedLetter = useSelector(appActions.get.selectedLetter);

  const isQuestionVisible = useSelector(appActions.get.isQuestionVisible);
  const isAnswerVisible = useSelector(appActions.get.isAnswerVisible);

  const isBlueBlinking = useSelector(appActions.get.isBlueBlinking);
  const isRedBlinking = useSelector(appActions.get.isRedBlinking);

  const blueLetters = useSelector(appActions.get.blueLetters);
  const redLetters = useSelector(appActions.get.redLetters);

  const modalManager = useContext(ModalManagerContext);

  const containerRef = useRef<HTMLDivElement>(null);

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

  const onSetWinner = useCallback(async () => {
    let winner = ITeams.RED;
    const clickRed = () => {
      modalManager$.next(IModalManagerActions.OK);
      winner = ITeams.RED;
    };
    const clickBlue = () => {
      modalManager$.next(IModalManagerActions.OK);
      winner = ITeams.BLUE;
    };

    await modalManager.showModal({
      title: messages.setWinner.title,
      message: <Winner onClickRed={clickRed} onClickBlue={clickBlue} />,
      okButton: {
        enabled: false,
      },
      cancelButton: {
        enabled: false,
      },
    });

    modalManager
      .showModal({
        title: messages.congratulations.title,
        message: <Congrats team={winner} />,
        okButton: {
          label: 'Yes',
        },
        cancelButton: {
          label: 'No',
        },
      })
      .then(() => {
        dispatch(appActions.endGame());
        dispatch(appActions.startGame());
        dispatch(appActions.setLetters(generateLettersArray(5, 5)));
      })
      .catch(() => dispatch(appActions.endGame()));
  }, [dispatch, modalManager]);

  const startGame = useCallback(() => {
    modalManager
      .showModal({
        title: messages.gameStart.title,
        message: messages.gameStart.message,
        okButton: {
          label: 'Yes',
        },
        cancelButton: {
          label: 'No',
        },
      })
      .then(() => {
        dispatch(appActions.startGame());
        dispatch(appActions.setLetters(generateLettersArray(5, 5)));
      })
      .catch(() => {});
  }, [dispatch, modalManager]);

  const endGame = useCallback(() => {
    modalManager
      .showModal({
        title: messages.gameEnd.title,
        message: messages.gameEnd.message,
        okButton: {
          label: 'Yes',
        },
        cancelButton: {
          label: 'No',
        },
      })
      .then(() => {
        dispatch(appActions.endGame());
      })
      .catch(() => {});
  }, [dispatch, modalManager]);

  const selectedLetterIsAssigned = useMemo(
    () =>
      blueLetters.includes(selectedLetter) ||
      redLetters.includes(selectedLetter),
    [blueLetters, redLetters, selectedLetter]
  );

  useEffect(() => {
    const resyncSub = onResyncAnimation$
      .pipe(
        map(() => containerRef.current as HTMLDivElement),
        filter((container) => Boolean(container)),
        tap((container) => container.classList.add('stop-animation')),
        delay(50)
      )
      .subscribe((container) => {
        container.classList.remove('stop-animation');
      });

    return () => resyncSub.unsubscribe();
  }, [containerRef]);

  return (
    <div
      ref={containerRef}
      className="basic-controls p-5 flex flex-col flex-grow"
    >
      <div className="basic flex-grow">
        <div className={clsx({ hidden: !isRunning })}>
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
          <button
            className="button float-right bg-yellow-400"
            onClick={onSetWinner}
          >
            SET A WINNER
          </button>
        </div>
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
          <a href="/game" target="_blank">
            Game
          </a>
          <button
            className={clsx('button bg-red-400', { hidden: !isRunning })}
            onClick={endGame}
          >
            END GAME
          </button>
          <button
            className={clsx('button btn-primary', { hidden: isRunning })}
            onClick={startGame}
          >
            START GAME
          </button>
        </div>
      </div>
    </div>
  );
}
