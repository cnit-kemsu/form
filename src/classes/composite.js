import { Publisher } from './publisher';
import { nonUndefined } from './_shared';

export class Composite {
  updateEvent = new Publisher();
  resetEvent = new Publisher();

  constructor(composer, name) {
    this.composer = composer;
    this.name = name;

    this.currentError = error => error[this.name];
    this.validate();

    this.submitEvent = composer.submitEvent;
    this.completeEvent = composer.completeEvent;

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  get form() {
    return this.composer.form;
  }

  get values() {
    return this.composer.values?.[this.name];
  }

  set values(values) {
    if (this.composer.values === undefined) this.composer.values = {};
    this.composer.values[this.name] = values;
  }

  update(...args) {
    this.composer.update(...args);
  }

  validate() {  
    this.errorStack = this.composer.errorStack.map(this.currentError).filter(nonUndefined);
  }

  handleUpdate(...args) {
    this.validate();
    this.updateEvent.publish(...args);
  }

  handleReset(prevValues) {
    this.validate();
    this.resetEvent.publish(prevValues?.[this.name]);
  }

  subscribeToEvents() {
    if (this.composer instanceof Composite) this.composer.subscribeToEvents();
    this.updateSub = this.composer.updateEvent.subscribe(this.handleUpdate);
    this.resetSub = this.composer.resetEvent.subscribe(this.handleReset);
  }

  unsubscribeFromEvents() {
    this.updateSub.unsubscribe();
    this.resetSub.unsubscribe();
    if (this.composer instanceof Composite) this.composer.unsubscribeFromEvents();
  }
}