import { Publisher } from '@kemsu/publisher';
import { Subscriber } from './Subscriber';

export class Composer extends Subscriber {
  valuesChangeEvent = new Publisher();
  resetEvent = new Publisher();
  submitEvent = new Publisher();

  constructor(forceUpdate, composer, name) {
    super(forceUpdate, composer);
    this.name = name;
  }

  get form() {
    return this.composer.form;
  }

  get values() {
    return this.composer.values?.[this.name];
  }

  set values(values) {
    if (this.composer.values == null) this.composer.values = {};
    this.composer.values[this.name] = values;
  }

  get currentErrors() {
    return this.composer.errors.map(this.currentError);
  }

  dispatchValuesChangeEvent(...callers) {
    this.composer.dispatchValuesChangeEvent(this, ...callers);
  }

  handleValuesChange(caller, ...callers) {
    this.valuesChangeEvent.publish(...callers);
    super.handleValuesChange(caller, ...callers);
  }

  handleReset(prevValues) {
    this.handleReset.publish(prevValues?.[this.name]);
    super.handleReset(prevValues);
  }

  handleSubmit() {
    this.handleSubmit.publish();
    super.handleSubmit();
  }
}