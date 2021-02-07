import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { ITeams, IQuestion } from 'types';
import { generateLettersArray, hasKey } from 'utils/helpers';

interface IBlinkers {
  red: boolean;
  blue: boolean;
}

interface AppState {
  letters: string[][];
  blueLetters: string[];
  redLetters: string[];

  // is game started
  isRunning: boolean;

  selectedLetter: string;
  showQuestion: boolean;
  showAnswer: boolean;

  questionsList: IQuestion[];
  question: IQuestion;

  blinkers: IBlinkers;
}

const initialState: AppState = {
  letters: generateLettersArray(5, 5),
  blueLetters: [],
  redLetters: [],

  // is game started
  isRunning: false,

  selectedLetter: '',
  showQuestion: false,
  showAnswer: false,

  questionsList: [],
  question: { answer: 'Unassigned', question: 'No question available' }, // [question, answer]

  blinkers: {
    red: false,
    blue: false,
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    startGame: (state) => {
      state.isRunning = true;
      state.letters = generateLettersArray(5, 5);
    },
    endGame: (state) => {
      Object.assign(state, initialState, { letters: state.letters });
    },
    setQuestionsList: (state, { payload }: PayloadAction<IQuestion[]>) => {
      state.questionsList = payload;
    },
    setSelectedLetter: (state, { payload }: PayloadAction<string>) => {
      state.selectedLetter = payload;
      state.showAnswer = false;
    },
    setQuestion: (state, { payload }: PayloadAction<IQuestion>) => {
      state.showQuestion = false;
      state.showAnswer = false;
      state.question = payload;
    },
    toggleShowQuestion: (state) => {
      state.showQuestion = !state.showQuestion;
      state.showAnswer = false;
    },
    toggleShowAnswer: (state) => {
      state.showAnswer = !state.showAnswer;
    },
    toggleBlink: (state, { payload }: PayloadAction<string>) => {
      if (hasKey(state.blinkers, payload)) {
        const isBlinking = state.blinkers[payload];

        state.blinkers[payload] = !isBlinking;
      }
    },
    assignLetter: (state, { payload }: PayloadAction<ITeams>) => {
      const selectedLetter = state.selectedLetter;

      state.showQuestion = false;
      state.showAnswer = false;
      state.selectedLetter = '';

      if (payload === ITeams.RED) {
        state.redLetters = [...state.redLetters, selectedLetter];
        return;
      }
      state.blueLetters = [...state.blueLetters, selectedLetter];
    },
    removeLetter: (state) => {
      const selectedLetter = state.selectedLetter;

      if (state.redLetters.includes(selectedLetter)) {
        const index = state.redLetters.findIndex(
          (letter) => letter === selectedLetter
        );

        state.redLetters.splice(index, 1);

        return;
      }

      const index = state.blueLetters.findIndex(
        (letter) => letter === selectedLetter
      );

      state.blueLetters.splice(index, 1);
    },
  },
});

export const {
  startGame,
  endGame,
  setQuestionsList,
  setQuestion,
  setSelectedLetter,
  toggleShowQuestion,
  toggleShowAnswer,
  toggleBlink,
  assignLetter,
  removeLetter,
} = appSlice.actions;

export const get = {
  letters: (state: RootState) => state.app.letters,
  questionsList: (state: RootState) => state.app.questionsList,
  isRunning: (state: RootState) => state.app.isRunning,
  selectedLetter: (state: RootState) => state.app.selectedLetter,
  isQuestionVisible: (state: RootState) => state.app.showQuestion,
  isAnswerVisible: (state: RootState) => state.app.showAnswer,
  question: (state: RootState) => state.app.question,
  blueLetters: (state: RootState) => state.app.blueLetters,
  redLetters: (state: RootState) => state.app.redLetters,
  isRedBlinking: (state: RootState) => state.app.blinkers.red,
  isBlueBlinking: (state: RootState) => state.app.blinkers.blue,
};

export default appSlice.reducer;
