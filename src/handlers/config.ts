import lscache from 'lscache';

enum ISTORAGE_TYPE {
  LOCAL_STORAGE = 'localStorage',
  FILE = 'file',
}

enum ISTORAGE_KEYS {
  DATA = 'data',
}

class Config {
  storageType: ISTORAGE_TYPE = ISTORAGE_TYPE.LOCAL_STORAGE;

  private _saveLocalStorage(data: string) {
    return lscache.set(ISTORAGE_KEYS, data);
  }

  private _saveFileStorage(data: string) {
    // to implement
    return true;
  }

  private _save(data: string) {
    if (this.storageType === ISTORAGE_TYPE.LOCAL_STORAGE) {
      return this._saveLocalStorage(data);
    }

    return this._saveFileStorage(data);
  }

  save(data: object | string) {
    if (typeof data === 'string') {
      return this._save(data);
    }

    return this._save(JSON.stringify(data));
  }

  private _loadFileStorage(defaultValue: string | object) {
    // to implement
    return defaultValue;
  }

  load(defaultValue: string | object = '') {
    if (this.storageType === ISTORAGE_TYPE.LOCAL_STORAGE) {
      return lscache.get(ISTORAGE_KEYS.DATA) || defaultValue;
    }

    return this._loadFileStorage(defaultValue);
  }
}

export default new Config();
