import { Composer } from './Composer';
import { noUndefined } from './_shared';

export class Transistor extends Composer {
  totalSubscribers = 0;
  subscribedToEvents = false;

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

  subscribeToEvents() {
    if (this.subscribedToEvents) return;
    this.subscribedToEvents = true;
    super.subscribeToEvents();
  }

  unsubscribeFromEvents() {
    if (!this.subscribedToEvents) return;
    this.subscribedToEvents = false;
    super.unsubscribeFromEvents();
  }

  increaseTotalSubscribers() {
    if (this.totalSubscribers === 0) this.subscribeToEvents();
    this.totalSubscribers++;
  }

  decreaseTotalSubscribers() {
    this.totalSubscribers--;
    if (this.totalSubscribers === 0) this.unsubscribeFromEvents();
  }

  propagateErrors() {
    this.transitErrors = this.composer.transitErrors.map(this.currentError).filter(noUndefined);
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