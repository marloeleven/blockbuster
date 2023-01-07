import clsx from 'clsx';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as appActions from 'app/slices/app';
import { IBroadcastChannels, IFunction, IGameWindowEvents } from 'types';
import noop from 'lodash/noop';

import QuestionModal from 'components/modals/question';
import {
  createMessageChannel,
  createSenderChannel,
} from 'observables/broadcast-channel';
import { onResyncAnimation$ } from 'handlers/subscriptions';
import { map, tap, filter, delay } from 'rxjs/operators';

interface IGenerateItem {
  letter: string;
  rowIndex: number;
  colIndex: number;
}

const GenerateItem: React.FC<IGenerateItem> = ({
  letter,
  rowIndex,
  colIndex,
}) => {
  const appContext = useContext(GameContext);

  const selectedLetter = useSelector(appActions.get.selectedLetter);
  const blueLetters = useSelector(appActions.get.blueLetters);
  const redLetters = useSelector(appActions.get.redLetters);

  const isBlue = blueLetters.includes(letter);
  const isRed = redLetters.includes(letter);

  const onSelectLetter = useCallback(() => {
    appContext.onSelectLetter(letter);
  }, [appContext, letter]);

  const index = `${rowIndex},${colIndex}`;

  return (
    <div
      className={clsx('item', {
        letter,
        selected: letter && selectedLetter === letter,
        red: isRed,
        blue: isBlue,
      })}
      key={index}
      data-index={index}
      onClick={onSelectLetter}
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 173.20508075688772 200"
      >
        <path
          fill="#fff"
          d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z"
        ></path>
      </svg>
      <div className="textContainer">
        <span>{letter}</span>
      </div>
    </div>
  );
};

interface IGenerateRowArgs {
  letters: string[];
  rowIndex: number;
}

const GenerateRow: React.FC<IGenerateRowArgs> = ({ letters, rowIndex }) => {
  const items = letters.map((letter: string, colIndex) => (
    <GenerateItem
      key={`col-${colIndex}`}
      letter={letter}
      rowIndex={rowIndex}
      colIndex={colIndex}
    />
  ));

  return (
    <div className="row" key={`row-${rowIndex}`}>
      {items}
    </div>
  );
};

interface IHexagonArgs {
  lettersArray: string[][];
}

const Hexagons = ({ lettersArray }: IHexagonArgs) => {
  const isBlueBlinking = useSelector(appActions.get.isBlueBlinking);
  const isRedBlinking = useSelector(appActions.get.isRedBlinking);

  const items = lettersArray.map((letters, index) => {
    return <GenerateRow letters={letters} rowIndex={index} key={index} />;
  });

  return (
    <div className="game p-0 m-0 flex justify-center items-center w-full">
      <div
        className={clsx(
          {
            'pointer-events-none': isGameRoute,
            'blink-blue': isBlueBlinking,
            'blink-red': isRedBlinking,
          },
          'grid flex-wrap'
        )}
      >
        {items}
      </div>
    </div>
  );
};

interface IGameContext {
  onSelectLetter: IFunction;
}

export const GameContext = React.createContext<IGameContext>({
  onSelectLetter: noop,
});

const eventListener$ = createMessageChannel(IBroadcastChannels.MAIN);

const sender = createSenderChannel(IBroadcastChannels.GAME);

const isGameRoute = window.location.href.includes('game');

export default function Game() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersArray = useSelector(appActions.get.letters);
  const isRunning = useSelector(appActions.get.isRunning);

  const dispatch = useDispatch();

  const onSelectLetter = useCallback(
    (letter: string) => {
      dispatch(appActions.setSelectedLetter(letter));
    },
    [dispatch]
  );

  useEffect(() => {
    if (isGameRoute) {
      const sub = eventListener$.subscribe(dispatch);

      sender(IGameWindowEvents.OPEN);

      window.addEventListener('beforeunload', () => {
        sender(IGameWindowEvents.CLOSE);
      });

      return () => {
        sub.unsubscribe();
      };
    }
  }, [dispatch]);

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
    <GameContext.Provider
      value={{
        onSelectLetter,
      }}
    >
      <div
        className={clsx({ started: isRunning }, 'relative game-area')}
        ref={containerRef}
      >
        <Hexagons lettersArray={lettersArray} />;
        <QuestionModal
          defaultStyle={false}
          className="h-full flex justify-center items-center flex-col text-center"
        />
      </div>
    </GameContext.Provider>
  );
}
