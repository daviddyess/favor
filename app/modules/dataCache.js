export default class DataCache {
  _cached = {};
  _state = {};

  get cached() {
    return this._cached;
  }

  set data(obj) {
    this._cached = {
      ...this._cached,
      ...obj
    };
    const props = Object.keys(obj);
    return obj[props[0]];
  }

  set(name, value) {
    this._cached = {
      ...this._cached,
      [name]: value
    };
    return value;
  }

  get(name) {
    return this._cached?.[name];
  }

  update(name, value) {
    this._cached = {
      ...this._cached,
      [name]: {
        ...this._cached?.[name],
        value
      }
    };
    return this._cached[name];
  }

  unset(name) {
    delete this._cached[name];
    return true;
  }
}
