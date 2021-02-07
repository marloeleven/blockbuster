import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

import clsx from 'clsx';

import withBaseModal, { BaseModalArgs } from 'components/base-modal';

import * as appActions from 'app/slices/app';

export const QuestionModal: React.FC<BaseModalArgs> = ({
  dialog,
  setIsOpen,
}) => {
  const isQuestionVisible = useSelector(appActions.get.isQuestionVisible);
  const isAnswerVisible = useSelector(appActions.get.isAnswerVisible);
  const { question, answer } = useSelector(appActions.get.question);

  useEffect(() => {
    setIsOpen(isQuestionVisible);
  }, [setIsOpen, isQuestionVisible]);

  return (
    <>
      <div className="game-question question">
        <span className="mb-4 mt-2 font-medium text-base">Question:</span>
        <p className="font-medium text-lg">{question}</p>
      </div>

      <div
        className={clsx(
          { 'opacity-0': !isAnswerVisible },
          'game-answer question'
        )}
      >
        <span className="font-medium text-base">Answer:</span>
        <p className="font-medium text-lg">{answer}</p>
      </div>
    </>
  );
};

export default withBaseModal(QuestionModal);
