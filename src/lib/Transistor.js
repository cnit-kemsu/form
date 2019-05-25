import { Composer } from './Composer';
import { noUndefined } from './_shared';

export class Transistor extends Composer {
  _subscribers = 0;

  constructor(composer, name) {
    super();
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.composer = composer;
    this.name = name;

    this.currentError = error => error[this.name];
    this.propagateErrors();
  }

  get subscrbers() {
    return this._subscribers;
  }

  set subscrbers(value) {
    if (this._subscribers === 0 && value === 1) this.subscribeToEvents();
    if (this._subscribers === 1 && value === 0) this.unsubscribeFromEvents();
    this._subscribers = value;
  }

  propagateErrors() {
    this.errorStack = this.composer.errorStack.map(this.currentError).filter(noUndefined);
  }

  update(callers) {
    this.composer.update(callers);
  }

  handleUpdate(callers) {
    this.propagateErrors();
    this.updateEvent.publish(callers);
  }

  handleReset(prevValues) {
    this.propagateErrors();
    this.resetEvent.publish(prevValues?.[this.name]);
  }

  handleSubmit() {
    this.submitEvent.publish();
  }
}