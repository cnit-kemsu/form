import { Composer } from './Composer';

export const cache = [];

export class Transistor extends Composer {
  totalSubscribers = 0;

  constructor(composer, name) {
    super(null, composer, name);

    this.errors = this.currentErrors;
  }

  handleValuesChange(...callers) {
    this.errors = this.currentErrors;
    super.handleValuesChange(...callers);
  }

  handleReset(prevValues) {
    this.errors = this.currentErrors;
    super.handleReset(prevValues);
  }

  findInCache([,, transistor]) {
    transistor === this;
  }

  subscribeToEvents() {
    if (this.totalSubscribers === 0) super.subscribeToEvents();
    this.totalSubscribers++;
  }

  unsubscribeFromEvents() {
    this.totalSubscribers--;
    if (this.totalSubscribers === 0) super.unsubscribeFromEvents();
    cache.splice(cache.indexOf(this.findInCache), 1);
  }
}