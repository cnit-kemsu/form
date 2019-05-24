import { Composite } from './Composite';
import { compose, nonUndefined } from './compose';

export class Field {
  dirty = false;
  touched = false;

  constructor(forceUpdate, composer, name, validate, getValue) {
    this.forceUpdate = forceUpdate;
    compose(this, composer, name);
    this._validate = validate;
    this.getValue = getValue;

    this.currentError = error => error[this.name];
    this.validate();

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.unsubscribeFromEvents = this.unsubscribeFromEvents.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
  }

  get value() {
    return this.composer.values?.[this.name];
  }

  set value(value) {
    if (!this.composer.values) this.composer.values = {};
    this.composer.values[this.name] = value;
  }

  handleChange(event) {
    this.value = this.getValue(event);
    this.dirty = true;
    this.composer.update(this);
  }

  handleBlur({ relatedTarget }) {
    if (!this.touched && !relatedTarget?.attributes['data-control']) {
      this.touched = true;
      this.forceUpdate();
    }
  }

  validate() {
    const error = [
      this._validate?.(this.value),
      ...this.composer.errorStack.map(this.currentError)
    ].filter(nonUndefined)[0];
    
    if (error !== undefined) this.composer.form.hasErrors = true;
    if (this.error !== error) {
      this.error = error;
      return true;
    }
    return false;
  }

  handleUpdate(caller) {
    if (this.validate() || caller === this) this.forceUpdate();
  }

  handleReset(prevValues) {
    if (this.validate() || this.dirty 
      || this.touched || prevValues?.[this.name] !== this.value) {

      this.dirty = false;
      this.touched = false;
      this.forceUpdate();
    }
  }

  handleSubmit() {
    if (this.error !== undefined) if (!this.dirty || !this.touched) {
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