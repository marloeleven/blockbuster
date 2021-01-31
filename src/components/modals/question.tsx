import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

import clsx from 'clsx';
import { css } from 'emotion/macro';

import withBaseModal, { BaseModalArgs } from 'components/base-modal';

import * as appActions from 'app/slices/app';

export const QuestionModal: React.FC<BaseModalArgs> = ({
  dialog,
  setIsOpen,
}) => {
  const isQuestionVisible = useSelector(appActions.get.isQuestionVisible);
  const isAnswerVisible = useSelector(appActions.get.isAnswerVisible);
  const [question, answer] = useSelector(appActions.get.question);

  useEffect(() => {
    setIsOpen(isQuestionVisible);
  }, [setIsOpen, isQuestionVisible]);

  return (
    <>
      <div className="game-question">
        <span className="mb-4 mt-2">Question:</span>
        <p>{question}</p>
      </div>

      <div className={clsx({ hidden: !isAnswerVisible }, 'game-answer')}>
        <span>Answer:</span>
        <p>{answer}</p>
      </div>
    </>
  );
};

export default withBaseModal(QuestionModal);
