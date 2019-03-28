import { Publisher } from '@implicit/publisher';
import { Composite } from './composite';
import { compose, nonUndefined, firstElement } from './_shared';

export class Compound {
  dirty = false;
  touched = false;
  updateEvent = new Publisher();
  resetEvent = new Publisher();
  submitEvent = new Publisher();

  constructor(forceUpdate, composer, name, validate) {
    this.forceUpdate = forceUpdate;
    compose(this, composer, name);
    this._validate = validate;

    this.currentError = error => error[this.name];
    this.validate();

    this.handleBlur = this.handleBlur.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.unsubscribeFromEvents = this.unsubscribeFromEvents.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
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

  handleBlur({ currentTarget, relatedTarget }) {
    if (!this.touched && !relatedTarget?.attributes['data-control'] && !currentTarget.contains(relatedTarget)) {
      this.touched = true;
      this.forceUpdate();
    }
  }

  update(...args) {
    this.composer.update(this, ...args);
  }

  validate() {
    const errors = [
      this._validate?.(this.values),
      ...this.composer.errorStack.map(this.currentError)
    ].filter(nonUndefined);
    
    this.errorStack = errors.map(firstElement).filter(nonUndefined);

    const error = errors[0]?.[1];
    if (error !== undefined) this.composer.form.hasErrors = true;
    if (this.error !== error) {
      this.error = error;
      return true;
    }
    return false;
  }

  makeDirty() {
    if (!this.dirty) {
      this.dirty = true;
      return true;
    }
    return false;
  }

  handleUpdate(caller, ...args) {
    const shoudUpdate = this.validate();
    this.updateEvent.publish(...args);
    if ((caller === this && this.makeDirty()) || shoudUpdate
    ) this.forceUpdate();
  }

  handleReset(prevValues) {
    const shoudUpdate = this.validate() || this.dirty || this.touched;
    this.dirty = false;
    this.touched = false;
    this.resetEvent.publish(prevValues?.[this.name]);
    if (shoudUpdate) this.forceUpdate();
  }

  handleSubmit() {
    this.submitEvent.publish();
    if (this.error) if (!this.dirty || !this.touched) {
      this.dirty = true;
      this.touched = true;
      this.forceUpdate();
    }
  }

  subscribeToEvents() {
    if (this.composer instanceof Composite) this.composer.subscribeToEvents();
    this.updateSub = this.composer.updateEvent.subscribe(this.handleUpdate);
    this.resetSub = this.composer.resetEvent.subscribe(this.handleReset);
    this.submitSub = this.composer.submitEvent.subscribe(this.handleSubmit);
  }

  unsubscribeFromEvents() {
    this.updateSub.unsubscribe();
    this.resetSub.unsubscribe();
    this.submitSub.unsubscribe();
    if (this.composer instanceof Composite) this.composer.unsubscribeFromEvents();
  }

  handleSubscriptions() {
    this.subscribeToEvents();
    return this.unsubscribeFromEvents;
  }
}