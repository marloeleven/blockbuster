import clsx from 'clsx';
import { css, cx } from 'emotion';
import React from 'react';
import _ from 'lodash/fp';

const gameClass = clsx(
  css`
    width: 100%;
    height: 100%;
  `,
  'game'
);

const aspectRatio = 4 / 3;

const getGameSize = () => {
  return {
    screen: {
      width: aspectRatio * window.screen.availHeight,
      height: window.screen.availHeight,
    },
  };
};

const generateItem = (rowIndex: number, colIndex: number) => {
  const index = `${rowIndex},${colIndex}`;
  return (
    <div className="item" key={index} data-index={index}>
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
        <span>{index}</span>
      </div>
    </div>
  );
};

const generateRow = (val: string, rowIndex: number) => {
  const items = Array(7)
    .fill('')
    .map((val, colIndex) => generateItem(rowIndex, colIndex));

  return (
    <div className="row" key={`row-${rowIndex}`}>
      {items}
    </div>
  );
};

const Hexagons = () => {
  const items = Array(7).fill('').map(generateRow);

  return <ul className="hex-grid__list">{items}</ul>;
};

export default function () {
  return (
    <div className={gameClass}>
      <Hexagons />
    </div>
  );
}
