import GSheets from 'g-sheets-api';

const DEFAULT_OPTIONS = {
  sheetId: '1Cb7PQ25BJHBc6812aI4dK_l-ua2CWKYj41KnNulOMLA',
  returnAllResults: true,
};

export default function fetchGSheets(options = DEFAULT_OPTIONS) {
  return new Promise((resolve, reject) => {
    try {
      GSheets({ ...DEFAULT_OPTIONS, ...options }, resolve);
    } catch (e) {
      reject(e);
    }
  });
}
