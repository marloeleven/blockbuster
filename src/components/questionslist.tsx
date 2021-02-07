import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as appActions from 'app/slices/app';
import clsx from 'clsx';
import questions from 'handlers/questions';

export default function QuestionsList() {
  const selectedLetter = useSelector(appActions.get.selectedLetter);
  const questionsList = useSelector(appActions.get.questionsList);
  const { question: selectedQuestion } = useSelector(appActions.get.question);

  const dispatch = useDispatch();

  const filteredList = useMemo(() => {
    return selectedLetter
      ? questionsList.filter(({ answer }) =>
          answer
            .toLocaleLowerCase()
            .startsWith(selectedLetter.toLocaleLowerCase())
        )
      : [];
  }, [questionsList, selectedLetter]);

  const onSelect = useCallback(
    (event: React.MouseEvent<HTMLLIElement>) => {
      const target = event.currentTarget as HTMLElement;

      const index = target.dataset.index as number | string;

      if (filteredList.hasOwnProperty(index)) {
        dispatch(appActions.setQuestion(filteredList[index as number]));
      }
    },
    [dispatch, filteredList]
  );

  useEffect(() => {
    if (filteredList.length) {
      dispatch(appActions.setQuestion(filteredList[0]));
    }
  }, [filteredList, dispatch]);

  return (
    <ul>
      {filteredList.map(({ question, answer }, index) => {
        return (
          <li
            onClick={onSelect}
            data-index={index}
            key={index}
            className={clsx(
              {
                'bg-yellow-200': question === selectedQuestion,
              },
              'mb-3 hover:bg-yellow-200 cursor-pointer'
            )}
          >
            <span className="answer block italic font-light">{answer}</span>
            <span className="question- text-sm font-semibold">{question}</span>
          </li>
        );
      })}
    </ul>
  );
}
