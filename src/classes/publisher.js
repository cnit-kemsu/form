export class Publisher {

  _subscribers = [];

  _unsubscribe(callback) {
    this._subscribers.splice(this._subscribers.indexOf(callback), 1);
  }

  subscribe(callback) {
    this._subscribers.push(callback);
    return {
      unsubscribe: () => this._unsubscribe(callback)
    };
  }

  publish(...args) {
    for (const callback of this._subscribers) callback(...args);
  }
}