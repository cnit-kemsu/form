import { Transistor } from './Transistor';

export class Subscriber {
  constructor() {
    this.unsubscribeFromEvents = this.unsubscribeFromEvents.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
  }

  subscribeToEvents() {
    if (this.composer instanceof Transistor) this.composer.subscribers++;
    this.updateSub = this.composer.updateEvent.subscribe(this.handleUpdate);
    this.resetSub = this.composer.resetEvent.subscribe(this.handleReset);
    this.submitSub = this.composer.submitEvent.subscribe(this.handleSubmit);
  }

  unsubscribeFromEvents() {
    this.updateSub.unsubscribe();
    this.resetSub.unsubscribe();
    this.submitSub.unsubscribe();
    if (this.composer instanceof Transistor) this.composer.subscribers--;
  }

  handleSubscriptions() {
    this.subscribeToEvents();
    return this.unsubscribeFromEvents;
  }
}