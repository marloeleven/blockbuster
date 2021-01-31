import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { ITeams } from 'types';
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

  question: [string, string];

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

  question: ['What is my name?', 'Marlo Dela Torre'], // [question, answer]

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
    },
    endGame: (state) => {
      Object.assign(state, initialState);
    },
    setLetters: (state, { payload }: PayloadAction<string[][]>) => {
      state.letters = payload;
    },
    setSelectedLetter: (state, { payload }: PayloadAction<string>) => {
      state.selectedLetter = payload;
      state.showAnswer = false;
    },
    setQuestion: (state, { payload }: PayloadAction<[string, string]>) => {
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
  setLetters,
  setSelectedLetter,
  toggleShowQuestion,
  toggleShowAnswer,
  toggleBlink,
  assignLetter,
  removeLetter,
} = appSlice.actions;

export const get = {
  letters: (state: RootState) => state.app.letters,
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
